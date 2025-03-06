import smtplib
import os
import re
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=587
SMTP_USERNAME="1rn21ai071.mayurgowda@gmail.com"
SMTP_PASSWORD="ejpo zvqi kqui ongf"

def process_api_node(client, node_label, data, node_values):
    # Collect context from node values
    context = list(node_values.values())

    # Check if this is an email node
    if data['input'] == "email":

        previous_output = data.get("previous_output", {})

        # Since previous_output is a dictionary with dynamic keys, get the first value
        first_node_output = next(iter(previous_output.values()), {})

        # Extract the extracted_data part
        extracted_data = first_node_output.get("extracted_data", {})
        extracted_data = extracted_data.get("email", [])
        if not extracted_data:
            return {"status": "error", "message": "No emails found to send."}
        

        if not extracted_data:
            return {"status": "error", "message": "No valid emails found to send."}
        
        # Generate email content
        try:
            email_content = generate_email_content(client, context, extracted_data)

            # Send emails
            send_result = send_email(extracted_data, email_content)
            
            return {
                "status": send_result["status"],
                "message": send_result["message"],
                "recipients": extracted_data
            }
        
        except Exception as e:
            return {
                "status": "error", 
                "message": f"Email processing failed: {str(e)}"
            }
    
    return {"status": "error", "message": "Not an email processing node"}

def generate_email_content(client, context, emails):
    # Convert context to a single string
    context_str = " ".join(str(item) for item in context)
    
    full_prompt = f"""ADVANCED EMAIL GENERATION INSTRUCTIONS:

    PRIMARY OBJECTIVE:
    - Generate a professional, nuanced communication that reflects strategic organizational communication
    - Approach the content from a leadership perspective
    - Demonstrate depth of insight beyond a standard template response

    COMMUNICATION GUIDELINES:
    - Write as a senior executive or strategic decision-maker
    - Avoid generic, templated language
    - Inject subtle professional authority and thoughtful analysis
    - Use varied sentence structures and tone
    - Demonstrate strategic thinking

    CONTEXT ANALYSIS: {context_str}

    CRITICAL CONSTRAINTS:
    - DO NOT mention specific recipient names or emails
    - Do NOT use salutations like "Dear Hiring Team"
    - Avoid repetitive phrases
    - Keep the tone authoritative yet engaging
    - Maximum length: 50 words

    TONE SPECTRUM:
    - Professional
    - Confident
    - Strategic
    - Slightly formal
    - Indicative of senior leadership perspective

    CONTENT STRUCTURE:
    1. Open with a compelling, context-driven statement
    2. Provide substantive insight or decision
    3. Hint at broader strategic implications
    4. Close with a forward-looking, action-oriented statement

    PROHIBITED ELEMENTS:
    - First-person narrative ("I am writing...")
    - Direct references to the review process
    - Overly administrative language
    - Passive constructions

    GENERATE A SINGLE, COHESIVE COMMUNICATION"""

    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "Generate a formal email based on the given context."},
                {"role": "user", "content": full_prompt},
            ],
        )
        
        # Extract and clean the content
        email_content = response.choices[0].message.content.strip()
        
        # Remove content inside and including XML-like tags
        email_content = re.sub(r'<[^>]+>.*?</[^>]+>', '', email_content, flags=re.DOTALL)
        
        # Remove any remaining standalone XML-like tags
        email_content = re.sub(r'<[^>]+>', '', email_content)
        
        # Trim whitespace and ensure clean output
        email_content = email_content.strip()
        
        return email_content
    except Exception as e:
        return f"Error generating email content: {str(e)}"

def send_email(recipients, message_body):
    try:
        # Validate SMTP credentials
        if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
            raise ValueError("Missing SMTP configuration")

        # Create message
        msg = MIMEText(message_body)
        msg["Subject"] = "Important Notice"
        msg["From"] = SMTP_USERNAME
        msg["To"] = ", ".join(recipients)

        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, recipients, msg.as_string())
        
        return {"status": "success", "message": f"Emails sent successfully to recipients."}
    
    except smtplib.SMTPAuthenticationError:
        return {"status": "error", "message": "SMTP Authentication Failed. Check your credentials."}
    except smtplib.SMTPException as smtp_e:
        return {"status": "error", "message": f"SMTP Error: {str(smtp_e)}"}
    except ValueError as ve:
        return {"status": "error", "message": f"Configuration Error: {str(ve)}"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}