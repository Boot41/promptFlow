import unittest
import json
import re
from parameterized import parameterized
from unittest.mock import patch, MagicMock
import os
from dotenv import load_dotenv
from groq import Groq

# Import the actual LLM functions we want to test
from .NodeProcessors.process_prompt_field import process_prompt_field

# Load environment variables
load_dotenv()

# Initialize Groq client (for actual LLM calls)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


class LLMPromptEvalTestCase(unittest.TestCase):
    """
    Evaluation tests for LLM prompt processing.
    These tests evaluate the quality and reliability of LLM responses
    for different types of prompts and inputs.
    """

    def setUp(self):
        """Set up test environment"""
        self.client = client
        # Skip tests if no API key is available
        if not GROQ_API_KEY:
            self.skipTest("GROQ_API_KEY not available")

    @parameterized.expand([
        # Test case format: (test_name, input_data, expected_pattern)
        (
            "text_summarization", 
            {
                "input": {"prompt": "Summarize this text into 3 key points"},
                "previous_output": {"node1": {"text": "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It's free and open source."}}
            },
            r"status.*success.*key_points|points|summary"
        ),
        (
            "json_extraction", 
            {
                "input": {"prompt": "Extract the name, age and occupation from this text"},
                "previous_output": {"node1": {"text": "John Smith is a 35-year-old software engineer working at Tech Solutions Inc."}}
            },
            r"name.*John Smith.*age.*35.*occupation.*software engineer"
        ),
        (
            "sentiment_analysis", 
            {
                "input": {"prompt": "Analyze the sentiment of this text"},
                "previous_output": {"node1": {"text": "I absolutely love this product! It has exceeded all my expectations and I would highly recommend it to everyone."}}
            },
            r"positive|Positive"
        ),
        (
            "error_handling", 
            {
                "input": {"prompt": "Extract structured data from this"},
                "previous_output": {"node1": {"text": ""}}
            },
            r"status"
        ),
    ])
    def test_prompt_field_quality(self, name, input_data, expected_pattern):
        """Test the quality of LLM responses for different prompt types"""
        # Call the actual LLM
        result = process_prompt_field(self.client, f"Test {name}", input_data, {})
        
        # Convert result to string for pattern matching
        result_str = json.dumps(result)
        print(f"\nTest: {name}")
        print(f"Input: {input_data}")
        print(f"Output: {result_str}")
        print(f"Expected pattern: {expected_pattern}")
        
        # Assert that the output contains expected pattern
        self.assertTrue(
            re.search(expected_pattern, result_str, re.IGNORECASE),
            f"Output does not match expected pattern for {name}"
        )
        
        # Assert that we got a valid JSON response
        self.assertIn("status", result)


class LLMEdgeCaseEvalTestCase(unittest.TestCase):
    """
    Tests for edge cases and error handling in LLM processing.
    """
    
    def setUp(self):
        """Set up test environment"""
        self.client = client
        # Skip tests if no API key is available
        if not GROQ_API_KEY:
            self.skipTest("GROQ_API_KEY not available")

    @parameterized.expand([
        # Test case format: (test_name, input_data, validation_function)
        (
            "very_long_input", 
            {
                "input": {"prompt": "Summarize this text in one sentence"},
                "previous_output": {"node1": {"text": "Lorem ipsum " * 500}}  # Very long input
            },
            lambda result: "status" in result and len(json.dumps(result)) < 1000  # Output should be reasonably sized
        ),
        (
            "special_characters", 
            {
                "input": {"prompt": "Extract meaningful information"},
                "previous_output": {"node1": {"text": "!@#$%^&*()_+<>?:\"{}|~`±§ with some actual text"}}
            },
            lambda result: "status" in result and "success" in result.get("status", "")
        ),
        (
            "code_in_prompt", 
            {
                "input": {"prompt": "Explain what this code does"},
                "previous_output": {"node1": {"text": "def fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)"}}
            },
            lambda result: "status" in result  # Just check for a valid response structure
        ),
    ])
    def test_edge_cases(self, name, input_data, validation_function):
        """Test LLM handling of edge cases"""
        # Call the actual LLM
        result = process_prompt_field(self.client, f"Edge case {name}", input_data, {})
        
        print(f"\nEdge Case Test: {name}")
        print(f"Input: {input_data}")
        print(f"Output: {json.dumps(result)}")
        
        # Use the custom validation function
        self.assertTrue(
            validation_function(result),
            f"Validation failed for edge case {name}"
        )


class LLMPerformanceEvalTestCase(unittest.TestCase):
    """
    Tests for LLM performance metrics like response time and consistency.
    """
    
    def setUp(self):
        """Set up test environment"""
        self.client = client
        # Skip tests if no API key is available
        if not GROQ_API_KEY:
            self.skipTest("GROQ_API_KEY not available")
            
    def test_response_consistency(self):
        """Test that similar prompts produce consistent responses"""
        # Define similar prompts
        prompts = [
            "Summarize this text in 3 points",
            "Give me 3 key points from this text",
            "What are the 3 main ideas in this text?"
        ]
        
        input_text = "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence displayed by humans or other animals. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals."
        
        results = []
        
        # Get responses for each prompt
        for prompt in prompts:
            input_data = {
                "input": {"prompt": prompt},
                "previous_output": {"node1": {"text": input_text}}
            }
            result = process_prompt_field(self.client, "Consistency test", input_data, {})
            results.append(result)
            print(f"\nPrompt: {prompt}")
            print(f"Result: {json.dumps(result)}")
        
        # Check that all results have the same structure
        self.assertTrue(all("status" in r for r in results))
        
        # Check that results have similar length (within 50% of each other)
        lengths = [len(json.dumps(r)) for r in results]
        avg_length = sum(lengths) / len(lengths)
        self.assertTrue(all(abs(l - avg_length) / avg_length < 0.5 for l in lengths))


# Mock version for CI/CD pipelines where actual API calls are not desired
class MockLLMEvalTestCase(unittest.TestCase):
    """
    Mock tests for LLM functionality that don't require actual API calls.
    These tests are suitable for CI/CD pipelines.
    """
    
    def test_mock_prompt_field(self):
        """Test processing a prompt field with mocked LLM response"""
        # Create a mock client
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message = MagicMock()
        mock_response.choices[0].message.content = '{"status": "success", "extracted_data": {"key": "value"}}'
        mock_client.chat.completions.create.return_value = mock_response
        
        data = {
            "input": {"prompt": "Extract data"},
            "previous_output": {"node1": {"text": "Sample text with key:value"}}
        }
        
        result = process_prompt_field(mock_client, "Mock Test", data, {})
        
        self.assertEqual(result, {"status": "success", "extracted_data": {"key": "value"}})
        mock_client.chat.completions.create.assert_called_once()


if __name__ == '__main__':
    unittest.main()
