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
            raw_nodes = request.data.get("nodes", [])
            raw_edges = request.data.get("edges", [])
            node_values = request.data.get("nodesValues", {})

            # Ensure `nodes` and `edges` are valid JSON lists
            if isinstance(raw_nodes, str):
                try:
                    nodes = json.loads(raw_nodes)
                except json.JSONDecodeError:
                    return Response({"error": "Invalid JSON format for 'nodes'"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                nodes = raw_nodes

            if isinstance(raw_edges, str):
                try:
                    edges = json.loads(raw_edges)
                except json.JSONDecodeError:
                    return Response({"error": "Invalid JSON format for 'edges'"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                edges = raw_edges

            uploaded_files = request.FILES
            file_nodes = {}

            for key, file in uploaded_files.items():
                # Extract node ID from key pattern: "files_node_{nodeId}_{index}"
                parts = key.split("_", 2)  # Split only into three parts: ["files", "node", "{nodeId}_{index}"]
                
                if len(parts) == 3 and parts[0] == "files" and parts[1] == "node":
                    node_id = f"node_{parts[2].rsplit('_', 1)[0]}"  # Remove the trailing _{index}
                    
                    if node_id not in file_nodes:
                        file_nodes[node_id] = []
                    file_nodes[node_id].append(file)

            # Merge file_nodes into node_values
            for node_id, files in file_nodes.items():
                node_values[node_id] = files  # Store files under the corresponding node_id

            # Call execute_workflow function
            workflow_result = execute_workflow(nodes, edges, node_values)

            # Use custom JSON encoder to handle potential serialization issues
            return Response(
                {
                    "message": "Workflow executed successfully!", 
                    "results": json.loads(json.dumps(workflow_result, cls=CustomJSONEncoder))
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)