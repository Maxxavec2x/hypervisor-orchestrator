# File that contains functions to manage hypervisor (checker https://libvirt.org/python.html)

import libvirt
import sys


# Take an ip of an hypervisor and return the connector to it
def get_connector_to_node(ip):
    try:
        conn = libvirt.open("qemu:///system")
        return conn
    except libvirt.libvirtError:
        print('Failed to open connection to the hypervisor')
        sys.exit(1)


# Renvoie un dictionnaireavec le format :
# {id : dict} avec un dictionnaire pour chaque id, contenant l'info sur le domain id
def get_node_info(conn):
    domainIds = [domain for domain in conn.listDomainsID()]
    print("Id des domains " + str(domainIds))
    nodeInfos = {}
    for id in domainIds:
        domain = conn.lookupByID(id)
        domainInfo = domain.info()
        domainInfoDict = create_info_object(domainInfo)
        nodeInfos[id] = domainInfoDict
    print(nodeInfos)
    return nodeInfos 



# Je sais pas si c'est pythonesque de faire ça, j'aurais surement du faire une classe mais osef
# Cette function prend un array d'info et renvoie un dictionnaire précisant les clés
def create_info_object(info_array):
    info_dict = {}
    if len(info_array) > 0:
        info_dict["state"] = info_array[0]
        info_dict["max_memory"] = info_array[1]
        info_dict["memory"] = info_array[2]
        info_dict["nb_virt_cpu"] = info_array[3]
        info_dict["cpu_time"] = info_array[4]
    return info_dict

