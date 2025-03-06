# LLM Evaluation Framework

This directory contains the evaluation framework for testing the LLM (Large Language Model) functionality in our application. These tests help ensure that our LLM integration remains robust and reliable as models evolve and as we make changes to our codebase.

## Overview

LLMs are probabilistic by nature, and the underlying models can change over time. This evaluation framework provides a way to:

1. Test the quality and reliability of LLM responses
2. Ensure our prompts continue to work as expected
3. Detect regressions in LLM performance
4. Validate edge case handling

## Test Categories

The evaluation framework includes several categories of tests:

### 1. Prompt Quality Tests (`LLMPromptEvalTestCase`)
These tests evaluate how well the LLM responds to different types of prompts, including:
- Text summarization
- Information extraction
- Sentiment analysis
- Error handling

### 2. Edge Case Tests (`LLMEdgeCaseEvalTestCase`)
These tests validate the LLM's ability to handle challenging inputs, such as:
- Very long inputs
- Special characters
- Code snippets

### 3. Performance Tests (`LLMPerformanceEvalTestCase`)
These tests measure the consistency and reliability of LLM responses.

### 4. Mock Tests (`MockLLMEvalTestCase`)
These tests use mocked responses to validate the application's handling of LLM outputs without making actual API calls. These are suitable for CI/CD pipelines.

## Running the Tests

You can run the evaluation tests using the provided script:

```bash
# Run all tests (including those that make API calls)
python run_llm_evals.py

# Run only mock tests (no API calls)
python run_llm_evals.py --mock-only

# Run with verbose output
python run_llm_evals.py --verbose
```

## Test Reports

After running the tests, a JSON report will be generated with details about the test results. This report includes:
- Overall success rate
- Number of tests run
- Failures and errors
- Skipped tests

## Extending the Tests

To add new evaluation tests:

1. Add new test cases to the appropriate test class in `utils/llm_evals.py`
2. For parameterized tests, add new test cases to the `parameterized.expand` list
3. For complex validation logic, create custom validation functions

## Best Practices

- Run these tests regularly, especially after making changes to prompts or LLM-related code
- Include both positive and negative test cases
- Test with a variety of inputs to ensure robustness
- Keep mock tests up-to-date with the actual LLM behavior

## Future Improvements

Potential enhancements to the evaluation framework:
- Integration with more sophisticated evaluation libraries (e.g., DeepEval)
- Automated comparison of different LLM models
- Benchmarking against human-evaluated responses
- Continuous monitoring of LLM performance over time
