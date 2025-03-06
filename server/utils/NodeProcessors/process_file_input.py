import base64
import io
import json
import fitz
import docx

# Processing File Input
def process_file_input(client, node_label, data, node_values):
    try:
        files = data.get("input", [])
        if not files:
            return {"error": "No file provided"}

        file_results = []
        for file in files:
            file_name = file.name.lower()

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