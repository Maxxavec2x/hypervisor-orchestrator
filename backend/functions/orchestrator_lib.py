# File that contains functions to manage hypervisor (checker https://libvirt.org/python.html)

import libvirt
import sys
from objects.DomainInfo import DomainInfo
from flask import make_response
import subprocess
import xml.etree.ElementTree as ET
import socket
from contextlib import closing
from werkzeug.utils import secure_filename
import os


websockify_processes = {}  # key = VM name, value = process

def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


# Take an ip of an hypervisor and return the connector to it
def get_connector_to_node(ip):
    try:
        conn = libvirt.open(f"qemu+ssh://{ip}/system")
        return conn
    except libvirt.libvirtError:
        print('Failed to open connection to the hypervisor')
        sys.exit(1)

def get_node_info(conn):
    nodeInfo = conn.getInfo()
    return nodeInfo

def get_domain_info(conn, id):
    dom = conn.lookupByID(id)
    info = libvirt.virDomainGetInfo(dom)

# Cette méthode renvoie une liste de DomainInfo, qui contienne leur propose objet Domain, ce qui permettra de l'utiliser pour certains actions 
# TODO: : On pourrait mettre les DomainInfo dans une bdd relationnelle
def get_all_domain_info(conn):
    domains = []
    domainsInfos = conn.getAllDomainStats()
    for domain in domainsInfos:
        newDomain = DomainInfo(domain[0], domain[1])
        if newDomain.state == "Running": # Si on refetch et que le domain run, on ajoute le port du websocket
            newDomain.set_ws_port(start_vnc_websocket(conn, newDomain.name()))
        domains.append(newDomain)
    return domains

# Starting a existing domain
def create_domain(conn, name):
    try:
        dom = conn.lookupByName(name)
        dom.create()
        return make_response("Success", 200)
    except libvirt.libvirtError:
        print('libvirtError: Failed to create domain')
        return make_response("libvirtError: Error when creating domain", 400)
    except :
        print("Unknown error: Failed to create domain")
        return make_response("Unknown: Error when creating domain", 400)

# IL FAUT QUE LA VM SOIT CREER AVEC VNC ET PAS SPICE !!!!!!
def start_vnc_websocket(conn, name):
    print("Tentative de création d'un websocket")
    try:
        dom = conn.lookupByName(name)
        xml_desc = dom.XMLDesc()
        print(xml_desc)
        root = ET.fromstring(xml_desc)
        graphics = root.find("./devices/graphics[@type='vnc']")
        if graphics is None:
            print("Aucun device VNC trouvé dans le XML. Tentative de récupérer via dom.displayPort()")
            vnc_port = dom.displayPort()
        else :
            vnc_port = int(graphics.attrib.get('port', -1))
            if vnc_port == -1:
                vnc_port = dom.displayPort()
        ws_port = find_free_port()
        print(f"Tentative de faire un subprocess avec ws_port: {ws_port} et vnc_port : {vnc_port}")
        process = subprocess.Popen([
            "websockify",
            str(ws_port),
            f"0.0.0.0:{vnc_port}"
        ])
        websockify_processes[name] = process
        return ws_port
    except Exception as e:
        print(f"Erreur setting websocket : {e}")
        return str(None)


# Shutdown a domain
def destroy_domain(conn, name):
    try:
        dom = conn.lookupByName(name)
        dom.destroy()
        try:
            print(f"VM {name} eteinte : arrêt du websockify.")
            process = websockify_processes.get(name)
            if process:
                process.terminate()
                process.wait()
                del websockify_processes[name]
                print(f"Process websockify arrêté pour VM {name}")
        except Exception as e:
            print(f"error stopping websocket : {e}")
        return make_response("<h1>Success</h1>", 200)
    except libvirt.libvirtError:
        print('libvirtError: Failed to destroy domain')
        return make_response("<h1>libvirtError: Error when destroying domain</h1>", 400)
    except :
        print("Unknown error: Failed to destroy domain")
        return make_response("<h1>Unknown: Error when destroying domain</h1>", 400)

def undefine_domain(conn, name):
    # NOTE: VM need to be shutdown to see the effect !
    # Don't delete the VM disk - Error if found an external snapshot (libvirt can't delete it: https://wiki.libvirt.org/I_created_an_external_snapshot_but_libvirt_will_not_let_me_delete_or_revert_to_it.html)
    try:
        dom = conn.lookupByName(name)
        flags = libvirt.VIR_DOMAIN_UNDEFINE_NVRAM
        if dom.hasManagedSaveImage():
            flags ^= libvirt.VIR_DOMAIN_UNDEFINE_MANAGED_SAVE
        if dom.hasCurrentSnapshot():
            for snapshot in dom.listAllSnapshots():
                snapshot.delete()
            flags ^= libvirt.VIR_DOMAIN_UNDEFINE_SNAPSHOTS_METADATA
        if dom.listAllCheckpoints():
            flags ^= libvirt.VIR_DOMAIN_UNDEFINE_CHECKPOINTS_METADATA
        
        dom.undefineFlags(flags)
        destroy_domain(conn, name)
        return make_response("<h1>Success</h1>", 200)

    except libvirt.libvirtError:
        return make_response("<h1>libvirtError: Error when undefine domain</h1>", 400)
    except Exception as e:
        return make_response("<h1>Unknown: Error when undefine domain</h1>", 400)

def get_snapshot_name_domain(conn, name):
    """
        Return a list of all snapshot name attached to the domain name. The first snapshot name in the list is the current.
    """
    try:
        dom = conn.lookupByName(name)
        snapshots_name = list()
        for snapshot in dom.listAllSnapshots():
            if snapshot.isCurrent(): snapshots_name.insert(0, snapshot.getName())
            else : snapshots_name.append(snapshot.getName())
        return snapshots_name
    except libvirt.libvirtError:
        return make_response("<h1>libvirtError: Error when getting snapshot</h1>", 400)
    except Exception as e:
        return make_response("<h1>Unknown: Error when getting snapshot</h1>", 400)

UPLOAD_FOLDER = "/home/maxx/iso/iso-imported" # A voir pour chopper le pool pour les iso ou un truc comme ça 
def getStoragePool(conn):
    try:
        pool = conn.storagePoolLookupByName("default")
        return pool
    except libvirt.libvirtError:
        raise make_response("<h1>Erreur : la storage pool 'default' est introuvable.<h1>", 400)

def createStoragePoolVolume(pool, name):    
        vol_xml = f"""
        <volume>
          <name>disk_{name}.qcow2</name>
          <allocation>0</allocation>
          <capacity unit="G">20</capacity>
          <target>
            <format type="qcow2"/>
          </target>
        </volume>"""

        new_vol = pool.createXML(vol_xml, 0)   
        return new_vol.path()

# Permet de créer une nouvelle vm
def defineXML_domain(conn, request):
    # WARNING: Override existing domain with same UUID and name ! Can be used to update a Domain
    # TODO: Fonction pour créer un disque - TO CHECK

    print("Création d'une nouvelle VM ")
    try:
        domain_name = request.form['domain_name']
        cpu_allocated = request.form['cpu_allocated']
        ram_allocated = request.form['ram_allocated']
        disk_path = request.form.get('disk_path', None) #Par défaut on pars du principe que le disque n'existe pas
        print("disk path : ", disk_path)
        #Gestion upload iso :
        iso_file = request.files.get('iso_file')
        if iso_file:
            filename = secure_filename(iso_file.filename)
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            iso_file.save(save_path)   # on sauvegarde l'iso
            iso_path = save_path
        else:
            iso_path = None

        #Gestion des disques
        if not disk_path:
            print("ENTREE DANS LE IF: ")
            pool = getStoragePool(conn)
            disk_path = createStoragePoolVolume(pool,domain_name)
        
        print("Fin de la configuration :")

        vm_xml_description = f'''
        <domain type='kvm' id='40'>
            <name>{domain_name}</name>
            <memory unit='KiB'>{ram_allocated}</memory>
            <currentMemory unit='KiB'>{ram_allocated}</currentMemory>
            <vcpu placement='static'>{cpu_allocated}</vcpu>
            <os>
                <type arch='x86_64'>hvm</type>
                <boot dev='cdrom'/>
                <boot dev='hd'/>
            </os>
            <devices>
                <emulator>/usr/bin/qemu-system-x86_64</emulator>
                <disk type='file' device='disk'>
                    <driver name='qemu' type='qcow2'/>
                    <source file='{disk_path}' index='2' />
                    <target dev='vda' bus='virtio'/>
                </disk>
                <disk type='file' device='cdrom'>
                    <driver name='qemu' type='raw' index='1' />
                    <source file='{iso_path}'/>
                    <target dev='sda' bus='sata' />
                    <readonly/>
                </disk>
                <graphics type='vnc' port='5900' autoport='yes' listen='0.0.0.0'>
                    <listen type='address' address='0.0.0.0'/>
                </graphics>
                <audio id='1' type='none'/>
            </devices>
        </domain>
        '''
        getStoragePool(conn)
        conn.defineXML(vm_xml_description)
        return make_response("Success", 200)
    except libvirt.libvirtError as e:
        return make_response(f"libvirtError: Error when defining domain : {e}", 400)
    except Exception as e:
        print(e)
        return make_response("Unknown: Error when defining domain", 400)
