from flask import Flask
from functions.orchestrator_lib import *
app = Flask(__name__)

# Permet de récupérer les infos d'un node
@app.route("/list-nodes/<ip>", methods=['GET'])
def get_list_nodes(ip):
    node_info = get_node_info(get_connector_to_node(ip))
    return node_info



# Pour les tests
if __name__ == '__main__':
    get_list_nodes("localhost")
