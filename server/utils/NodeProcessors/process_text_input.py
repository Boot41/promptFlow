def process_text_input(client, node_label, data, node_values):
    try:
        # Retrieve input as a string (plain text)
        input_data = data.get("input", "")
        
        # Ensure the input is a string (text)
        if not isinstance(input_data, str):
            raise TypeError("Input data must be a string.")
        
        return input_data
    except (TypeError) as e:
        return {"error": f"Error processing {node_label}: {str(e)}"}
