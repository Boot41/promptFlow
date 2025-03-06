import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.workflow_processor import execute_workflow
import base64

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # Handle bytes objects by base64 encoding
        if isinstance(obj, bytes):
            return base64.b64encode(obj).decode('utf-8')
        
        # Handle file-like objects
        if hasattr(obj, 'read'):
            try:
                content = obj.read()
                obj.seek(0)  # Reset file pointer
                return base64.b64encode(content).decode('utf-8')
            except Exception:
                return str(obj)
        
        # Let the base class default method raise the TypeError
        return super().default(obj)

class WorkflowView(APIView):
    def get(self, request):
        return Response({"message": "Welcome to the Workflow API"}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            # Extract JSON data
            raw_nodes = request.data.get("nodes", "[]")  # Default to an empty JSON list
            raw_edges = request.data.get("edges", "[]")
            
            # Ensure `nodes` and `edges` are parsed correctly
            nodes = json.loads(raw_nodes) if isinstance(raw_nodes, str) else raw_nodes
            edges = json.loads(raw_edges) if isinstance(raw_edges, str) else raw_edges

            # Validate that nodes and edges are provided and are valid lists
            if not isinstance(nodes, list) or not isinstance(edges, list):
                return Response(
                    {"error": "Invalid data format. 'nodes' and 'edges' must be valid lists."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Validate that at least one node is provided
            if len(nodes) == 0:
                return Response(
                    {"error": "At least one node must be provided."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Extract nodeValues from form data (handle JSON-encoded text values)
            node_values = {}
            for key, value in request.data.items():
                if key.startswith("nodeValues_"):  # Identify text-based node values
                    node_id = key.replace("nodeValues_", "")  # Extract nodeId
                    try:
                        node_values[node_id] = json.loads(value)  # Decode JSON values
                    except json.JSONDecodeError:
                        node_values[node_id] = value  # If not JSON, store raw text
            
            # Extract uploaded files
            uploaded_files = request.FILES
            file_nodes = {}

            for key, file in uploaded_files.items():
                # Extract node ID from key pattern: "files_node_{nodeId}_{index}"
                parts = key.split("_", 2)
                if len(parts) == 3 and parts[0] == "files" and parts[1] == "node":
                    node_id = f"node_{parts[2].rsplit('_', 1)[0]}"
                    if node_id not in file_nodes:
                        file_nodes[node_id] = []
                    file_nodes[node_id].append(file)

            # Merge file_nodes into node_values
            for node_id, files in file_nodes.items():
                node_values[node_id] = files  # Store files under the corresponding node_id

            # Call execute_workflow function
            workflow_result = execute_workflow(nodes, edges, node_values)

            # Use custom JSON encoder to handle serialization
            return Response(
                {
                    "message": "Workflow executed successfully!", 
                    "results": json.loads(json.dumps(workflow_result, cls=CustomJSONEncoder))
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
