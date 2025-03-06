#!/usr/bin/env python
"""
Full Project Coverage Runner

This script runs tests for all Django apps with coverage and generates a report.

Usage:
    python run_full_coverage.py [--html] [--apps APP1,APP2,...]

Options:
    --html       Generate HTML coverage report
    --apps       Comma-separated list of apps to test (default: all apps)
"""

import os
import sys
import argparse
import subprocess
from datetime import datetime

# Directory for coverage reports
COVERAGE_DIR = "coverage_reports"
os.makedirs(COVERAGE_DIR, exist_ok=True)

# List of Django apps in the project
DEFAULT_APPS = ["api", "authentication"]  # Add more apps as needed

def run_coverage(apps=None, html=False):
    """Run tests with coverage for specified apps"""
    
    if apps is None:
        apps = DEFAULT_APPS
    
    print(f"Running coverage for apps: {', '.join(apps)}")
    
    # Clear previous coverage data
    subprocess.run(["coverage", "erase"], check=True)
    
    # Run the tests with coverage
    app_args = " ".join(apps)
    result = subprocess.run([
        "coverage", "run", 
        "--source=" + ",".join(apps),
        "manage.py", "test"
    ] + apps, check=False)
    
    # Generate coverage report
    print("\nGenerating coverage report...")
    subprocess.run(["coverage", "report", "-m"], check=True)
    
    # Save the report to a file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = os.path.join(COVERAGE_DIR, f"full_coverage_report_{timestamp}.txt")
    
    with open(report_file, "w") as f:
        subprocess.run(["coverage", "report", "-m"], stdout=f, check=True)
    
    print(f"\nCoverage report saved to: {report_file}")
    
    # Generate HTML report if requested
    if html:
        html_dir = os.path.join(COVERAGE_DIR, f"html_full_{timestamp}")
        subprocess.run(["coverage", "html", "-d", html_dir], check=True)
        print(f"\nHTML coverage report generated in: {html_dir}")
        print(f"Open {html_dir}/index.html in your browser to view the report")
    
    return result.returncode

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Run tests with coverage")
    parser.add_argument("--html", action="store_true", help="Generate HTML coverage report")
    parser.add_argument("--apps", help="Comma-separated list of apps to test")
    args = parser.parse_args()
    
    # Parse apps argument
    apps_to_test = None
    if args.apps:
        apps_to_test = args.apps.split(",")
    
    # Run the coverage
    exit_code = run_coverage(apps=apps_to_test, html=args.html)
    
    # Exit with the same code as the test run
    sys.exit(exit_code)
