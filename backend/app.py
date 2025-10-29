from flask import Flask
from functions.orchestrator_lib import *
app = Flask(__name__)

@app.route("/list-nodes", methods=['GET'])
def get_list_nodes():
    node_info = get_node_info(get_connector_to_node("localhost"))
    return node_info



# Pour les tests
if __name__ == '__main__':
    get_list_nodes()
