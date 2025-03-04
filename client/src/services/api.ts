const API_BASE_URL = "http://localhost:8000/api";

export async function runWorkflow(nodes: any[], edges: any[], nodesValues: Record<string, any>) {
    const formData = new FormData();
    
    // Attach JSON data
    formData.append("nodes", JSON.stringify(nodes));
    formData.append("edges", JSON.stringify(edges));

    // Process node values (handle files separately)
    Object.entries(nodesValues).forEach(([nodeId, value]) => {
        if (Array.isArray(value) && value[0] instanceof File) {
            // If value is an array of files, append them
            value.forEach((file, index) => {
                formData.append(`files_${nodeId}_${index}`, file);
            });
        } else {
            // Append other node values as JSON
            formData.append(`nodeValues_${nodeId}`, JSON.stringify(value));
        }
    });

    try {
        const response = await fetch(
            `${API_BASE_URL}/run-workflow/`,
            {
                method: "POST",
                body: formData // Send as multipart/form-data
            }
        );

        if (!response.ok) {
            throw new Error("Failed to run workflow");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error running workflow:", error);
        throw error;
    }
}

