from flask import Flask
import json

from functions.orchestrator_lib import *
from objects.NodeInfo import NodeInfo
app = Flask(__name__)

# Permet de récupérer les infos d'un node
@app.route("/node-info/<ip>", methods=['GET'])
def get_node_info_endpoint(ip):
    node_info_array = get_node_info(get_connector_to_node(ip))
    node_info=NodeInfo(node_info_array)
    return json.dumps(node_info.__dict__)



# Pour les tests
if __name__ == '__main__':
    get_node_info_endpoint("localhost")
