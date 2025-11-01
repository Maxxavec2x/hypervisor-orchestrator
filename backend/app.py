from flask import Flask, jsonify
import json
from pprint import pprint
from functions.orchestrator_lib import *
from objects.NodeInfo import NodeInfo
app = Flask(__name__)

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

# Pour les tests
if __name__ == '__main__':
    app.run(debug=True)
    #help(libvirt)
    #get_node_info_endpoint("localhost")
    pprint(get_all_domains_info_endpoint("localhost"))

