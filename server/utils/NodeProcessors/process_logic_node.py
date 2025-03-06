import json

def process_logic_node(client, node_label, data, node_values):
    # System Prompt Template
    template = """
    You are an AI that processes any input, based on logic of the user input.
    Your task is to analyze the input based on the user prompt, extract details based off of the logic given by the user, 
    and return a structured JSON response.

    **Instructions:**
    Analyze the input based on the user's given logic and extract the required data or process

    **Response Format:**
    Ensure the response is a valid JSON object with the following structure:
    {
        "status": "success",
        "extracted_data": { ... }  # Key details from the input
    }

    !!!DON'T GIVE ADDITIONAL DETAILS THAN REQUIRED BY THE USER PROMPT!!!
    """

    full_prompt = f"Input Data: {data['previous_output']}\n\nUser Prompt: {data['input']}\n\nReturn the JSON output"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": full_prompt},
        ],
    )

    response_text = response.choices[0].message.content.strip()

    try: 
        return json.loads(response_text)
    except json.JSONDecodeError: 
        return {"status": "error", "message": "Failed to decode JSON", "raw_output": response_text}