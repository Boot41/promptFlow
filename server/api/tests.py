from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from unittest.mock import patch, MagicMock

class WorkflowViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.workflow_url = reverse('run-workflow')
        
    def test_workflow_get(self):
        """Test the GET method of the WorkflowView"""
        response = self.client.get(self.workflow_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Welcome to the Workflow API"})
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_success(self, mock_execute_workflow):
        """Test successful workflow execution"""
        # Mock the execute_workflow function to return a successful result
        mock_execute_workflow.return_value = {"node1": {"output": "test output"}}
        
        # Create test data
        data = {
            "nodes": json.dumps([{"id": "node1", "type": "textInput", "data": {"label": "Text Input"}}]),
            "edges": json.dumps([]),
            "nodeValues_node1": json.dumps({"text": "test input"})
        }
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Workflow executed successfully!")
        mock_execute_workflow.assert_called_once()
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_with_files(self, mock_execute_workflow):
        """Test workflow execution with file uploads"""
        # Mock the execute_workflow function
        mock_execute_workflow.return_value = {"node1": {"output": "file processed"}}
        
        # Create test data with a file
        with open('test_file.txt', 'w') as f:
            f.write('test content')
        
        with open('test_file.txt', 'rb') as f:
            data = {
                "nodes": json.dumps([{"id": "node1", "type": "fileInput", "data": {"label": "File Input"}}]),
                "edges": json.dumps([]),
                "files_node_node1_0": f
            }
            response = self.client.post(self.workflow_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_execute_workflow.assert_called_once()
        
        # Clean up
        import os
        if os.path.exists('test_file.txt'):
            os.remove('test_file.txt')
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_with_json_input(self, mock_execute_workflow):
        """Test workflow execution with JSON input"""
        # Mock the execute_workflow function
        mock_execute_workflow.return_value = {"node1": {"output": "json processed"}}
        
        # Create test data with JSON
        data = {
            "nodes": json.dumps([{"id": "node1", "type": "jsonInput", "data": {"label": "JSON Input"}}]),
            "edges": json.dumps([]),
            "nodeValues_node1": json.dumps({"key": "value"})
        }
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_execute_workflow.assert_called_once()
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_with_edges(self, mock_execute_workflow):
        """Test workflow execution with connected nodes"""
        # Mock the execute_workflow function
        mock_execute_workflow.return_value = {
            "node1": {"output": "first output"},
            "node2": {"output": "second output"}
        }
        
        # Create test data with connected nodes
        data = {
            "nodes": json.dumps([
                {"id": "node1", "type": "textInput", "data": {"label": "Text Input"}},
                {"id": "node2", "type": "promptNode", "data": {"label": "Prompt Node"}}
            ]),
            "edges": json.dumps([{"source": "node1", "target": "node2"}]),
            "nodeValues_node1": json.dumps({"text": "test input"}),
            "nodeValues_node2": json.dumps({"prompt": "analyze this"})
        }
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_execute_workflow.assert_called_once()
    
    def test_workflow_post_invalid_data(self):
        """Test workflow execution with invalid data"""
        # Create invalid test data (missing required fields)
        data = {}
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_exception(self, mock_execute_workflow):
        """Test workflow execution when an exception occurs"""
        # Mock the execute_workflow function to raise an exception
        mock_execute_workflow.side_effect = Exception("Test exception")
        
        # Create test data
        data = {
            "nodes": json.dumps([{"id": "node1", "type": "textInput", "data": {"label": "Text Input"}}]),
            "edges": json.dumps([]),
            "nodeValues_node1": json.dumps({"text": "test input"})
        }
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        mock_execute_workflow.assert_called_once()
    
    @patch('api.views.execute_workflow')
    def test_workflow_post_with_complex_workflow(self, mock_execute_workflow):
        """Test workflow execution with a complex workflow"""
        # Mock the execute_workflow function
        mock_execute_workflow.return_value = {
            "node1": {"output": "text input"},
            "node2": {"output": "file input"},
            "node3": {"output": "processed by prompt"},
            "node4": {"output": "logic applied"},
            "node5": {"output": "API call result"}
        }
        
        # Create test data with a complex workflow
        data = {
            "nodes": json.dumps([
                {"id": "node1", "type": "textInput", "data": {"label": "Text Input"}},
                {"id": "node2", "type": "fileInput", "data": {"label": "File Input"}},
                {"id": "node3", "type": "promptNode", "data": {"label": "Prompt Node"}},
                {"id": "node4", "type": "logicNode", "data": {"label": "Logic Node"}},
                {"id": "node5", "type": "apiCall", "data": {"label": "API Call"}}
            ]),
            "edges": json.dumps([
                {"source": "node1", "target": "node3"},
                {"source": "node2", "target": "node3"},
                {"source": "node3", "target": "node4"},
                {"source": "node4", "target": "node5"}
            ]),
            "nodeValues_node1": json.dumps({"text": "test input"}),
            "nodeValues_node3": json.dumps({"prompt": "analyze this"}),
            "nodeValues_node4": json.dumps({"condition": "true"}),
            "nodeValues_node5": json.dumps({"email": "test@example.com"})
        }
        
        response = self.client.post(self.workflow_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_execute_workflow.assert_called_once()
