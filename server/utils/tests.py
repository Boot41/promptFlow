from django.test import TestCase
from unittest.mock import patch, MagicMock
import json
import os

from .workflow_processor import execute_workflow, process_node
from .NodeProcessors.process_json_input import process_json_input
from .NodeProcessors.process_file_input import process_file_input
from .NodeProcessors.process_prompt_field import process_prompt_field
from .NodeProcessors.process_logic_node import process_logic_node
from .NodeProcessors.process_api_node import process_api_node
from .NodeProcessors.process_text_input import process_text_input

class WorkflowProcessorTestCase(TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
        
        # Sample nodes and edges for testing
        self.nodes = [
            {"id": "node1", "type": "textInput", "data": {"label": "Text Input"}},
            {"id": "node2", "type": "promptNode", "data": {"label": "Prompt Node"}},
            {"id": "node3", "type": "logicNode", "data": {"label": "Logic Node"}}
        ]
        
        self.edges = [
            {"source": "node1", "target": "node2"},
            {"source": "node2", "target": "node3"}
        ]
        
        self.node_values = {
            "node1": {"text": "Sample input text"},
            "node2": {"prompt": "Analyze this text"}
        }
    
    @patch('utils.workflow_processor.process_node')
    def test_execute_workflow_simple(self, mock_process_node):
        """Test executing a simple workflow"""
        # Configure mock to return different values for each node
        mock_process_node.side_effect = [
            {"text": "Processed text input"},
            {"analysis": "Text analysis result"},
            {"decision": "Logic decision"}
        ]
        
        result = execute_workflow(self.nodes, self.edges, self.node_values)
        
        # Verify process_node was called for each node
        self.assertEqual(mock_process_node.call_count, 3)
        
        # Verify the result contains all nodes
        self.assertIn("node1", result)
        self.assertIn("node2", result)
        self.assertIn("node3", result)
        
        # Verify the output of each node
        self.assertEqual(result["node1"]["output"], {"text": "Processed text input"})
        self.assertEqual(result["node2"]["output"], {"analysis": "Text analysis result"})
        self.assertEqual(result["node3"]["output"], {"decision": "Logic decision"})
    
    @patch('utils.workflow_processor.process_node')
    def test_execute_workflow_error(self, mock_process_node):
        """Test workflow execution when an error occurs"""
        # Configure mock to raise an exception
        mock_process_node.side_effect = Exception("Test error")
        
        result = execute_workflow(self.nodes, self.edges, self.node_values)
        
        # Verify the result contains an error
        self.assertIn("error", result)
        self.assertIn("Test error", result["error"])
    
    def test_process_node_textInput(self):
        """Test processing a text input node"""
        with patch('utils.workflow_processor.process_text_input') as mock_process:
            mock_process.return_value = {"text": "Processed text"}
            
            data = {"input": {"text": "Sample text"}, "previous_output": {}}
            result = process_node(self.mock_client, "textInput", "Text Input", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "Text Input", data, {})
            self.assertEqual(result, {"text": "Processed text"})
    
    def test_process_node_jsonInput(self):
        """Test processing a JSON input node"""
        with patch('utils.workflow_processor.process_json_input') as mock_process:
            mock_process.return_value = {"json": {"key": "value"}}
            
            data = {"input": {"json": '{"key": "value"}'}, "previous_output": {}}
            result = process_node(self.mock_client, "jsonInput", "JSON Input", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "JSON Input", data, {})
            self.assertEqual(result, {"json": {"key": "value"}})
    
    def test_process_node_fileInput(self):
        """Test processing a file input node"""
        with patch('utils.workflow_processor.process_file_input') as mock_process:
            mock_process.return_value = {"content": "File content"}
            
            data = {"input": {"file": "test.txt"}, "previous_output": {}}
            result = process_node(self.mock_client, "fileInput", "File Input", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "File Input", data, {})
            self.assertEqual(result, {"content": "File content"})
    
    def test_process_node_promptNode(self):
        """Test processing a prompt node"""
        with patch('utils.workflow_processor.process_prompt_field') as mock_process:
            mock_process.return_value = {"status": "success", "extracted_data": {"key": "value"}}
            
            data = {"input": {"prompt": "Analyze this"}, "previous_output": {}}
            result = process_node(self.mock_client, "promptNode", "Prompt Node", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "Prompt Node", data, {})
            self.assertEqual(result, {"status": "success", "extracted_data": {"key": "value"}})
    
    def test_process_node_logicNode(self):
        """Test processing a logic node"""
        with patch('utils.workflow_processor.process_logic_node') as mock_process:
            mock_process.return_value = {"decision": True}
            
            data = {"input": {"condition": "true"}, "previous_output": {}}
            result = process_node(self.mock_client, "logicNode", "Logic Node", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "Logic Node", data, {})
            self.assertEqual(result, {"decision": True})
    
    def test_process_node_apiCall(self):
        """Test processing an API call node"""
        with patch('utils.workflow_processor.process_api_node') as mock_process:
            mock_process.return_value = {"status": "success", "message": "Email sent"}
            
            data = {"input": "email", "previous_output": {}}
            result = process_node(self.mock_client, "apiCall", "API Call", data, {})
            
            mock_process.assert_called_once_with(self.mock_client, "API Call", data, {})
            self.assertEqual(result, {"status": "success", "message": "Email sent"})
    
    def test_process_node_unsupported(self):
        """Test processing an unsupported node type"""
        data = {"input": {}, "previous_output": {}}
        result = process_node(self.mock_client, "unsupportedType", "Unsupported Node", data, {})
        
        self.assertIn("error", result)
        self.assertIn("Unsupported node type", result["error"])


class NodeProcessorsTestCase(TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
    
    def test_process_text_input(self):
        """Test processing a text input node"""
        data = {"input": {"text": "Sample text"}, "previous_output": {}}
        result = process_text_input(self.mock_client, "Text Input", data, {})
        
        self.assertEqual(result, {"text": "Sample text"})
    
    def test_process_json_input(self):
        """Test processing a JSON input node"""
        data = {"input": {"json": '{"key": "value"}'}, "previous_output": {}}
        result = process_json_input(self.mock_client, "JSON Input", data, {})
        
        self.assertEqual(result, {"json": {"key": "value"}})
    
    def test_process_json_input_invalid(self):
        """Test processing an invalid JSON input"""
        data = {"input": {"json": 'invalid json'}, "previous_output": {}}
        result = process_json_input(self.mock_client, "JSON Input", data, {})
        
        self.assertIn("error", result)
    
    @patch('utils.NodeProcessors.process_file_input.open')
    def test_process_file_input(self, mock_open):
        """Test processing a file input node"""
        # Mock file reading
        mock_file = MagicMock()
        mock_file.read.return_value = b'file content'
        mock_open.return_value.__enter__.return_value = mock_file
        
        # Create a mock file object
        mock_file_obj = MagicMock()
        mock_file_obj.name = 'test.txt'
        mock_file_obj.read.return_value = b'file content'
        
        data = {"input": [mock_file_obj], "previous_output": {}}
        
        with patch('utils.NodeProcessors.process_file_input.extract_text_from_file', return_value='extracted text'):
            result = process_file_input(self.mock_client, "File Input", data, {})
            
            self.assertEqual(result, {'file_content': 'extracted text', 'file_name': 'test.txt'})
    
    @patch('utils.NodeProcessors.process_prompt_field.client.chat.completions.create')
    def test_process_prompt_field(self, mock_create):
        """Test processing a prompt field node"""
        # Mock LLM response
        mock_response = MagicMock()
        mock_response.choices[0].message.content = '{"status": "success", "extracted_data": {"key": "value"}}'
        mock_create.return_value = mock_response
        
        data = {
            "input": {"prompt": "Analyze this"},
            "previous_output": {"node1": {"text": "Sample text"}}
        }
        
        result = process_prompt_field(self.mock_client, "Prompt Node", data, {})
        
        self.assertEqual(result, {"status": "success", "extracted_data": {"key": "value"}})
        mock_create.assert_called_once()
    
    @patch('utils.NodeProcessors.process_prompt_field.client.chat.completions.create')
    def test_process_prompt_field_invalid_json(self, mock_create):
        """Test processing a prompt field with invalid JSON response"""
        # Mock LLM response with invalid JSON
        mock_response = MagicMock()
        mock_response.choices[0].message.content = 'invalid json'
        mock_create.return_value = mock_response
        
        data = {
            "input": {"prompt": "Analyze this"},
            "previous_output": {"node1": {"text": "Sample text"}}
        }
        
        result = process_prompt_field(self.mock_client, "Prompt Node", data, {})
        
        self.assertEqual(result["status"], "error")
        self.assertIn("Failed to decode JSON", result["message"])
    
    def test_process_logic_node_true_condition(self):
        """Test processing a logic node with a true condition"""
        data = {
            "input": {"condition": "true"},
            "previous_output": {"node1": {"value": 10}}
        }
        
        result = process_logic_node(self.mock_client, "Logic Node", data, {})
        
        self.assertTrue(result["condition_met"])
    
    def test_process_logic_node_false_condition(self):
        """Test processing a logic node with a false condition"""
        data = {
            "input": {"condition": "false"},
            "previous_output": {"node1": {"value": 5}}
        }
        
        result = process_logic_node(self.mock_client, "Logic Node", data, {})
        
        self.assertFalse(result["condition_met"])
    
    def test_process_logic_node_complex_condition(self):
        """Test processing a logic node with a complex condition"""
        data = {
            "input": {"condition": "node1.value > 5"},
            "previous_output": {"node1": {"value": 10}}
        }
        
        result = process_logic_node(self.mock_client, "Logic Node", data, {})
        
        self.assertTrue(result["condition_met"])
    
    @patch('utils.NodeProcessors.process_api_node.generate_email_content')
    @patch('utils.NodeProcessors.process_api_node.send_email')
    def test_process_api_node_email(self, mock_send_email, mock_generate_content):
        """Test processing an API node for sending email"""
        # Mock email generation and sending
        mock_generate_content.return_value = "Email content"
        mock_send_email.return_value = {"status": "success", "message": "Email sent successfully"}
        
        data = {
            "input": "email",
            "previous_output": {
                "node1": {
                    "extracted_data": {
                        "email": ["test@example.com"]
                    }
                }
            }
        }
        
        result = process_api_node(self.mock_client, "API Call", data, {})
        
        self.assertEqual(result["status"], "success")
        self.assertEqual(result["message"], "Email sent successfully")
        self.assertEqual(result["recipients"], ["test@example.com"])
        mock_generate_content.assert_called_once()
        mock_send_email.assert_called_once_with(["test@example.com"], "Email content")
    
    def test_process_api_node_no_emails(self):
        """Test processing an API node with no emails"""
        data = {
            "input": "email",
            "previous_output": {
                "node1": {
                    "extracted_data": {}
                }
            }
        }
        
        result = process_api_node(self.mock_client, "API Call", data, {})
        
        self.assertEqual(result["status"], "error")
        self.assertIn("No emails found", result["message"])
    
    def test_process_api_node_not_email(self):
        """Test processing an API node that is not for email"""
        data = {
            "input": "not_email",
            "previous_output": {}
        }
        
        result = process_api_node(self.mock_client, "API Call", data, {})
        
        self.assertEqual(result["status"], "error")
        self.assertEqual(result["message"], "Not an email processing node")
