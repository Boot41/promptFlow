import json

# Processing JSON Input
def process_json_input(client, node_label, data, node_values):
    try:
        input_data = data.get("input", {})
        if isinstance(input_data, str):
            input_data = json.loads(input_data)
        return input_data
    except (json.JSONDecodeError, TypeError) as e:
        return {"error": f"Error processing {node_label}: {str(e)}"}