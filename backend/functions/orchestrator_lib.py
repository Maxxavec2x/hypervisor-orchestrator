# File that contains functions to manage hypervisor (checker https://libvirt.org/python.html)

import libvirt
import sys
from objects.DomainInfo import DomainInfo
from flask import make_response

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
       domains.append(DomainInfo(domain[0], domain[1]))
    return domains

# Starting a existing domain
def create_domain(conn, name):
    try:
        dom = conn.lookupByName(name)
        dom.create()
        return make_response("<h1>Success</h1>", 200)
    except libvirt.libvirtError:
        print('libvirtError: Failed to create domain')
        return make_response("<h1>libvirtError: Error when creating domain</h1>", 400)
    except :
        print("Unknown error: Failed to create domain")
        return make_response("<h1>Unknown: Error when creating domain</h1>", 400)

# Shutdown a domain
def destroy_domain(conn, name):
    try:
        dom = conn.lookupByName(name)
        dom.destroy()
        return make_response("<h1>Success</h1>", 200)
    except libvirt.libvirtError:
        print('libvirtError: Failed to destroy domain')
        return make_response("<h1>libvirtError: Error when destroying domain</h1>", 400)
    except :
        print("Unknown error: Failed to destroy domain")
        return make_response("<h1>Unknown: Error when destroying domain</h1>", 400)
<<<<<<< HEAD
=======

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
        return make_response("<h1>Success</h1>", 200)

    except libvirt.libvirtError:
        return make_response("<h1>libvirtError: Error when undefine domain</h1>", 400)
    except Exception as e:
        return make_response("<h1>Unknown: Error when undefine domain</h1>", 400)

def get_snapshot_name_domain(conn, name):
    dom = conn.lookupByName(name)
    snapshots_name = list()
    for snapshot in dom.listAllSnapshots():
        if snapshot.isCurrent(): snapshots_name.insert(0, snapshot.getName())
        else : snapshots_name.append(snapshot.getName())

    return snapshots_name
>>>>>>> feature/undefine-vm
