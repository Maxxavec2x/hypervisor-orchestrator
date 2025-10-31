# File that contains functions to manage hypervisor (checker https://libvirt.org/python.html)

import libvirt
import sys

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
    print(nodeInfo)
    return nodeInfo
