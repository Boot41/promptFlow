#!/usr/bin/env python
"""
LLM Evaluation Test Runner

This script runs the LLM evaluation tests and generates a report of the results.
It can be configured to run different test suites and output formats.

Usage:
    python run_llm_evals.py [--mock-only] [--verbose]

Options:
    --mock-only    Run only the mock tests (no actual API calls)
    --verbose      Show detailed test output
"""

import unittest
import argparse
import sys
import json
import os
from datetime import datetime

# Import the test cases
from utils.llm_evals import (
    LLMPromptEvalTestCase,
    LLMEdgeCaseEvalTestCase,
    LLMPerformanceEvalTestCase,
    MockLLMEvalTestCase
)

report_dir = "llm_reports"
os.makedirs(report_dir, exist_ok=True)


def run_evals(mock_only=False, verbose=False):
    """Run the LLM evaluation tests and return the results"""
    # Create test suite
    suite = unittest.TestSuite()
    
    # Add test cases based on configuration
    if not mock_only:
        # Add real API call tests
        suite.addTest(unittest.makeSuite(LLMPromptEvalTestCase))
        suite.addTest(unittest.makeSuite(LLMEdgeCaseEvalTestCase))
        suite.addTest(unittest.makeSuite(LLMPerformanceEvalTestCase))
    
    # Always add mock tests
    suite.addTest(unittest.makeSuite(MockLLMEvalTestCase))
    
    # Configure the test runner
    runner = unittest.TextTestRunner(verbosity=2 if verbose else 1)
    
    # Run the tests
    result = runner.run(suite)
    
    return result


def generate_report(result):
    """Generate a report of the test results"""
    # Convert test results to serializable format
    failures = []
    for test, err in result.failures:
        failures.append({
            "test": str(test),
            "message": str(err)
        })
    
    errors = []
    for test, err in result.errors:
        errors.append({
            "test": str(test),
            "message": str(err)
        })
    
    skipped = []
    for test, reason in result.skipped:
        skipped.append({
            "test": str(test),
            "reason": str(reason)
        })
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": result.testsRun,
        "failures": len(result.failures),
        "errors": len(result.errors),
        "skipped": len(result.skipped),
        "success_rate": (result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun if result.testsRun > 0 else 0,
        "details": {
            "failures": failures,
            "errors": errors,
            "skipped": skipped
        }
    }
    
    # Print summary
    print("\n=== LLM Evaluation Report ===")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total Tests: {report['total_tests']}")
    print(f"Success Rate: {report['success_rate'] * 100:.2f}%")
    print(f"Failures: {report['failures']}")
    print(f"Errors: {report['errors']}")
    print(f"Skipped: {report['skipped']}")
    
    # Save report to file
    report_file = os.path.join(report_dir, f"llm_eval_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\nDetailed report saved to: {report_file}")
    
    return report


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Run LLM evaluation tests")
    parser.add_argument("--mock-only", action="store_true", help="Run only mock tests (no API calls)")
    parser.add_argument("--verbose", action="store_true", help="Show detailed test output")
    args = parser.parse_args()
    
    # Run the tests
    print(f"Running LLM evaluations {'(mock only)' if args.mock_only else '(including API calls)'}")
    result = run_evals(mock_only=args.mock_only, verbose=args.verbose)
    
    # Generate report
    report = generate_report(result)
    
    # Set exit code based on test results
    sys.exit(1 if report["failures"] > 0 or report["errors"] > 0 else 0)
