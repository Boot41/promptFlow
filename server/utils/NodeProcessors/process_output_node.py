def process_text_output(client, node_label, data, node_values):
    print("Output: ", data)
    return data["previous_output"]