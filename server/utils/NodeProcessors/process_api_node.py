import smtplib
import os
import re
import json
import logging
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# SMTP Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "1rn21ai071.mayurgowda@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "ejpo zvqi kqui ongf")

# LLM Model Configuration
EMAIL_MODEL = "llama-3.3-70b-versatile"

def normalize_emails_with_llm(client, extracted_data):
    """
    Uses an LLM to extract and normalize email addresses into a single 'email' key.
    """
    logger.info("Starting email normalization with LLM")
    
    # Handle different input types
    if isinstance(extracted_data, dict):
        data_str = json.dumps(extracted_data)
    elif isinstance(extracted_data, str):
        try:
            # Try to parse as JSON if it's a string
            json.loads(extracted_data)
            data_str = extracted_data
        except json.JSONDecodeError:
            # If not valid JSON, wrap it in quotes
            data_str = f'"{extracted_data}"'
    else:
        data_str = str(extracted_data)
    
    logger.info(f"Extracted data for normalization: {data_str}")
    
    full_prompt = f"""
    Extract all valid email addresses from the following data and return them in a standardized format.
    
    Input Data:
    {data_str}
    
    Expected Output Format:
    {{
        "email": ["email1@example.com", "email2@example.com"]
    }}
    
    Ensure:
    - All emails are properly formatted (username@domain.tld).
    - Duplicate emails are removed.
    - The key is always "email".
    - If no valid emails are found, return an empty array.
    """
    
    try:
        logger.info(f"Sending prompt to {EMAIL_MODEL}")
        response = client.chat.completions.create(
            model=EMAIL_MODEL,
            messages=[
                {"role": "system", "content": "Extract and normalize email addresses into a standard JSON format."},
                {"role": "user", "content": full_prompt},
            ],
            response_format={"type": "json_object"},
        )
        
        # Parse JSON output
        normalized_data = response.choices[0].message.content
        logger.info(f"LLM response: {normalized_data}")
        
        try:
            normalized_dict = json.loads(normalized_data)
            # Extract emails
            emails = normalized_dict.get("email", [])
            
            # Ensure it's a list
            if not isinstance(emails, list):
                logger.warning(f"Emails not returned as a list: {emails}")
                emails = [emails] if emails else []
                
            # Basic validation of email format
            valid_emails = []
            for email in emails:
                if isinstance(email, str) and '@' in email and '.' in email.split('@')[1]:
                    valid_emails.append(email)
                else:
                    logger.warning(f"Invalid email format: {email}")
            
            logger.info(f"Normalized emails: {valid_emails}")
            return valid_emails
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            # Try to extract emails using regex as fallback
            email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            emails = re.findall(email_regex, normalized_data)
            logger.info(f"Extracted emails using regex fallback: {emails}")
            return emails
            
    except Exception as e:
        logger.error(f"Email normalization failed: {str(e)}")
        return []

def process_api_node(client, node_label, data, node_values):
    """Process API node for email sending functionality"""
    logger.info(f"Processing API node: {node_label}")
    context = list(node_values.values())
    
    if data['input'] == "email":
        logger.info("Email node detected")
        
        # Extract data from previous node
        previous_output = data.get("previous_output", {})
        logger.info(f"Previous output keys: {list(previous_output.keys())}")
        
        if not previous_output:
            return {"status": "error", "message": "No previous output data found"}
        
        # Get the first node output
        first_node_output = next(iter(previous_output.values()), {})
        logger.info(f"First node output keys: {list(first_node_output.keys())}")
        
        # Try different ways to extract email data
        extracted_data = first_node_output.get("extracted_data", {})
        
        if not extracted_data:
            logger.warning("No extracted_data found in previous output")
            # Try to find emails in the raw output
            raw_output = first_node_output.get("output", "")
            if raw_output:
                logger.info("Attempting to extract emails from raw output")
                extracted_data = raw_output
        
        logger.info(f"Extracted data type: {type(extracted_data)}")
        
        # Use LLM to normalize emails
        emails = normalize_emails_with_llm(client, extracted_data)
        
        if not emails:
            logger.error("No valid emails found to send")
            return {"status": "error", "message": "No valid emails found to send."}
        
        try:
            logger.info(f"Generating email content for {len(emails)} recipients")
            email_content = generate_email_content(client, context, emails)
            
            logger.info("Sending emails")
            send_result = send_email(emails, email_content)
            
            logger.info(f"Email sending result: {send_result}")
            return {
                "status": send_result["status"],
                "message": send_result["message"],
                "recipients": emails
            }
            
        except Exception as e:
            logger.error(f"Email processing failed: {str(e)}")
            return {"status": "error", "message": f"Email processing failed: {str(e)}"}
    
    logger.info("Not an email processing node")
    return {"status": "error", "message": "Not an email processing node"}

def generate_email_content(client, context, emails):
    """Generate email content using LLM"""
    logger.info("Generating email content")
    
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
        logger.info(f"Sending prompt to {EMAIL_MODEL}")
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "Generate a formal email based on the given context."},
                {"role": "user", "content": full_prompt},
            ],
        )
        
        # Extract and clean the content
        email_content = response.choices[0].message.content.strip()
        
        # Remove content inside and including XML-like tags - fixed regex
        email_content = re.sub(r'<[^>]+>.*?</[^>]+>', '', email_content, flags=re.DOTALL)
        
        # Remove any remaining standalone XML-like tags
        email_content = re.sub(r'<[^>]+>', '', email_content)
        
        # Trim whitespace and ensure clean output
        email_content = email_content.strip()
        
        logger.info(f"Generated email content: {email_content[:50]}...")
        return email_content
    except Exception as e:
        logger.error(f"Error generating email content: {str(e)}")
        return f"Error generating email content: {str(e)}"

def send_email(recipients, message_body):
    """Send email to recipients"""
    logger.info(f"Attempting to send email to {len(recipients)} recipients")
    
    try:
        # Validate SMTP credentials
        if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
            logger.error("Missing SMTP configuration")
            raise ValueError("Missing SMTP configuration")

        # Create message
        msg = MIMEText(message_body)
        msg["Subject"] = "Important Notice"
        msg["From"] = SMTP_USERNAME
        msg["To"] = ", ".join(recipients)

        logger.info(f"Connecting to SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            logger.info(f"Logging in as: {SMTP_USERNAME}")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            logger.info(f"Sending email from {SMTP_USERNAME} to {recipients}")
            server.sendmail(SMTP_USERNAME, recipients, msg.as_string())
        
        logger.info("Email sent successfully")
        return {"status": "success", "message": f"Emails sent successfully to {len(recipients)} recipients."}
    
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication Failed")
        return {"status": "error", "message": "SMTP Authentication Failed. Check your credentials."}
    except smtplib.SMTPException as smtp_e:
        logger.error(f"SMTP Error: {str(smtp_e)}")
        return {"status": "error", "message": f"SMTP Error: {str(smtp_e)}"}
    except ValueError as ve:
        logger.error(f"Configuration Error: {str(ve)}")
        return {"status": "error", "message": f"Configuration Error: {str(ve)}"}
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}