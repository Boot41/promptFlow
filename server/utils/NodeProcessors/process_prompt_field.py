import json
import re

def process_prompt_field(client, node_label, data, node_values):
    # System Prompt Template
    template = """
    You are an AI that processes any type of input, including text, JSON, or file-converted strings.
    Your task is to analyze the input based on the user prompt, extract relevant information, 
    and return a structured JSON response.

    **Instructions:**
    - If the input is text, analyze it based on the user's request.
    - If the input is JSON, extract relevant fields and process them accordingly.
    - If the input is a file-converted string (base64-encoded), decode it, analyze the content, and return useful insights.

    **Response Format:**
    Ensure the response is a valid JSON object with the following structure:
    {
        "status": "success",
        "extracted_data": { ... }  # Key details from the input
    }

    !!!DON'T GIVE ADDITIONAL DETAILS THAN REQUIRED BY THE USER PROMPT!!!
    """

    print("node label", node_label)
    print("data", data)
    print("node values", node_values)

    full_prompt = f"Input Data: {data['previous_output']}\n\nUser Prompt: {data['input']}\n\nReturn the JSON output"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": full_prompt},
        ],
    )

    response_text = response.choices[0].message.content.strip()
    response_text = re.sub(r"^```json\n|\n```$", "", response_text)

    print(response_text)

    try: 
        return json.loads(response_text)
    except json.JSONDecodeError: 
        return {"status": "error", "message": "Failed to decode JSON", "raw_output": response_text}