import json
import os
from collections import deque
from dotenv import load_dotenv
from groq import Groq

from .NodeProcessors.process_json_input import process_json_input
from .NodeProcessors.process_file_input import process_file_input
from .NodeProcessors.process_prompt_field import process_prompt_field
from .NodeProcessors.process_logic_node import process_logic_node
from .NodeProcessors.process_api_node import process_api_node
from .NodeProcessors.process_text_input import process_text_input
from .NodeProcessors.process_output_node import process_text_output

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(
    api_key=GROQ_API_KEY
)

def execute_workflow(nodes, edges, node_values):
    print(nodes, edges, node_values)
    node_map = {node["id"]: node for node in nodes}
    graph = {node["id"]: [] for node in nodes}
    incoming_edges = {node["id"]: 0 for node in nodes}
    edge_mappings = {}

    for edge in edges:
        source = edge["source"]
        target = edge["target"]
        graph[source].append(target)
        incoming_edges[target] += 1
        if target not in edge_mappings:
            edge_mappings[target] = []
        edge_mappings[target].append(source)

    queue = deque()
    for node_id, count in incoming_edges.items():
        if count == 0:
            queue.append(node_id)

    node_results = {}

    while queue:
        node_id = queue.popleft()
        node = node_map[node_id]
        node_type = node["type"]
        node_label = node["data"].get("label", "Unknown Node")

        # Gather previous outputs
        previous_outputs = {}
        if node_id in edge_mappings:
            for prev_node_id in edge_mappings[node_id]:
                if prev_node_id in node_results:
                    previous_outputs[prev_node_id] = node_results[prev_node_id]["output"]

        # Prepare input data
        node_input_data = {
            "input": node_values.get(node_id, {}),
            "previous_output": previous_outputs
        }
        
        try:
            result = process_node(client, node_type, node_label, node_input_data, node_values)
        except Exception as e:
            return {"error": f"Error processing node {node_label}: {str(e)}"}

        node_results[node_id] = {
            "input": node_input_data["input"],
            "output": result
        }

        for next_node_id in graph[node_id]:
            incoming_edges[next_node_id] -= 1
            if incoming_edges[next_node_id] == 0:
                queue.append(next_node_id)

    print(node_results)
    results = last_key = list(node_results.keys())[-1]
    last_result = node_results[last_key]

    print(last_result)

    return last_result

def process_node(client, node_type, node_label, data, node_values):
    node_functions = {
        "jsonInput": process_json_input,
        "fileInput": process_file_input,
        "promptNode": process_prompt_field,
        "logicNode": process_logic_node,
        "apiCall": process_api_node,
        "textInput": process_text_input,
        'textOutput': process_text_output
    }

    func = node_functions.get(node_type, default_function)
    return func(client, node_label, data, node_values)



def default_function(client, node_label, data):
    return {"error": f"Unsupported node type for {node_label}"}