from flask import Flask, jsonify, request
import json
from pprint import pprint
from functions.orchestrator_lib import *
from objects.NodeInfo import NodeInfo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Permet de récupérer les infos d'un node
@app.route("/node/<ip>/info", methods=['GET'])
def get_node_info_endpoint(ip):
    node_info_array = get_node_info(get_connector_to_node(ip))
    node_info=NodeInfo(node_info_array)
    print(node_info.__dict__)
    return jsonify(node_info.__dict__)


# Permet de récupérer les infos de tout les domaines
@app.route("/node/<ip>/domains/info", methods=['GET'])
def get_all_domains_info_endpoint(ip):
    domainArray = get_all_domain_info(get_connector_to_node(ip))
    domain_dicts = [domain.to_dict() for domain in domainArray]
    return jsonify(domain_dicts)

@app.route("/node/<ip>/domains/create/<name>", methods=['GET'])
def create_domain_endpoint(ip, name):
    return create_domain(get_connector_to_node(ip), name)

@app.route("/node/<ip>/domains/destroy/<name>", methods=['GET'])
def destroy_domain_endpoint(ip, name):
    return destroy_domain(get_connector_to_node(ip), name)

@app.route("/node/<ip>/domains/undefine/<name>", methods=['GET'])
def undefine_domain_endpoint(ip, name):
    return undefine_domain(get_connector_to_node(ip), name)

@app.route("/node/<ip>/domains/getsnapshot/<name>", methods=['GET'])
def get_snapshot_name_domain_endpoint(ip, name):
    snapshot_array = get_snapshot_name_domain(get_connector_to_node(ip), name)
    snapshot_dict = [{index:snapshot} for snapshot, index in enumerate(snapshot_array)]
    # TODO: Voir Maxx le format du retour
    return jsonify(snapshot_dict)

# TODO: changer to post
@app.route("/node/<ip>/domains/defineXML", methods=['POST'])
def defineXML_domain_endpoint(ip):
    domain_name = request.form['domain_name']
    cpu_allocated = request.form['cpu_allocated']
    ram_allocated = request.form['ram_allocated']
    xml = f'''
<domain type='kvm' id='40'>
  <name>{domain_name}</name>
  <uuid>4dea22b3-1d52-d8f3-2516-782e98ab3fa0</uuid>
  <memory unit='KiB'>{ram_allocated}</memory>
  <currentMemory unit='KiB'>{ram_allocated}</currentMemory>
  <vcpu placement='static'>{cpu_allocated}</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-10.0'>hvm</type>
    <boot dev='hd'/>
  </os>
</domain>
  '''
    defineXML_domain(get_connector_to_node(ip), xml)
    return "ok"

# Pour les tests
if __name__ == '__main__':
    app.run(debug=True)
    #help(libvirt)
    #get_node_info_endpoint("localhost")
    pprint(get_all_domains_info_endpoint("localhost"))

