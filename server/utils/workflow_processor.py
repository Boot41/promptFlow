import json
import csv
import io
import fitz  # PyMuPDF for PDFs
import docx  # python-docx for Word files
from collections import deque

def execute_workflow(nodes, edges, node_values):
    print("this", node_values)
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
            result = process_node(node_type, node_label, node_input_data)
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

    return node_results

def process_node(node_type, node_label, data):
    node_functions = {
        "jsonInput": process_json_input,
        "fileInput": process_file_input,
        "promptNode": process_prompt_field,
        # "logicNode": process_logic_node
    }

    func = node_functions.get(node_type, default_function)
    return func(node_label, data)

# 📌 Processing JSON Input
def process_json_input(node_label, data):
    try:
        input_data = data.get("input", {})
        if isinstance(input_data, str):
            input_data = json.loads(input_data)
        return input_data
    except (json.JSONDecodeError, TypeError) as e:
        return {"error": f"Error processing {node_label}: {str(e)}"}

# 📌 Processing File Input
def process_file_input(node_label, data):
    try:
        files = data.get("input", [])
        if not files:
            return {"error": "No file provided"}

        file_results = []
        for file in files:
            file_name = file.name.lower()
            
            # Use base64 encoding for binary files to avoid UTF-8 decoding issues
            import base64

            if file_name.endswith(".json"):
                try:
                    file_data = json.loads(file.read().decode("utf-8"))
                except UnicodeDecodeError:
                    # If UTF-8 decoding fails, use base64
                    file_data = {
                        "content": base64.b64encode(file.read()).decode('utf-8'),
                        "encoding": "base64"
                    }

            elif file_name.endswith(".csv"):
                try:
                    csv_reader = csv.DictReader(io.StringIO(file.read().decode("utf-8")))
                    file_data = [row for row in csv_reader]
                except UnicodeDecodeError:
                    # If UTF-8 decoding fails, use base64
                    file_data = {
                        "content": base64.b64encode(file.read()).decode('utf-8'),
                        "encoding": "base64"
                    }

            elif file_name.endswith(".txt"):
                try:
                    file_data = file.read().decode("utf-8").strip()
                except UnicodeDecodeError:
                    # If UTF-8 decoding fails, use base64
                    file_data = {
                        "content": base64.b64encode(file.read()).decode('utf-8'),
                        "encoding": "base64"
                    }

            elif file_name.endswith(".pdf"):
                file_data = extract_text_from_pdf(file.read())

            elif file_name.endswith(".docx"):
                file_data = extract_text_from_docx(file.read())

            else:
                # For unsupported or binary files, use base64 encoding
                file_data = {
                    "content": base64.b64encode(file.read()).decode('utf-8'),
                    "encoding": "base64",
                    "file_type": file_name.split('.')[-1] if '.' in file_name else "unknown"
                }

            file_results.append({"file_name": file.name, "content": file_data})

        print(file_results)

        return file_results

    except Exception as e:
        return {"error": f"Error processing {node_label}: {str(e)}"}

def extract_text_from_pdf(pdf_bytes):
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "\n".join(page.get_text("text") for page in pdf_doc)

        # Ensure UTF-8 encoding
        text = text.encode("utf-8", "ignore").decode("utf-8")

        return text.strip()
    except Exception as e:
        return f"Error reading PDF: {str(e)}"


# 📌 Extract text from DOCX
def extract_text_from_docx(docx_bytes):
    try:
        doc = docx.Document(io.BytesIO(docx_bytes))
        text = "\n".join(para.text for para in doc.paragraphs)
        return text.strip()
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

def process_prompt_field(node_label, data):
    return {"prompt_response": f"Processed: {data}"}

def default_function(node_label, data):
    return {"message": "No specific processing for this node type"}
