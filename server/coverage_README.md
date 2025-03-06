# Test Coverage

This directory contains tools for measuring and reporting test coverage for the Django project.

## Overview

The coverage tools help you:
- Measure how much of your code is being tested
- Identify untested parts of your code
- Generate reports to visualize coverage

## Setup

The required packages are already in requirements.txt:
- coverage
- django-coverage-plugin

If you need to install them manually:
```bash
pip install coverage django-coverage-plugin
```

## Running Coverage Tests

### Basic Usage

To run tests with coverage for all apps:

```bash
python run_full_coverage.py
```

This will:
1. Run all tests in the project
2. Generate a text coverage report
3. Save the report to `coverage_reports/full_coverage_report_TIMESTAMP.txt`

### Testing Specific Apps

To run coverage for specific apps:

```bash
python3 run_full_coverage.py --apps api,authentication
```

### HTML Report

To generate an HTML coverage report:

```bash
python3 run_full_coverage.py --html
```

This will:
1. Run all tests in the project
2. Generate a text coverage report
3. Save the report to `coverage_reports/full_coverage_report_TIMESTAMP.txt`
4. Generate an HTML report in `coverage_reports/html_full_TIMESTAMP/`
5. You can view the HTML report by opening `coverage_reports/html_full_TIMESTAMP/index.html` in a browser

## Configuration

The coverage configuration is in `.coveragerc`. This file controls:
- Which files to include/exclude from coverage
- Which lines to exclude (e.g., `if __name__ == "__main__":`)
- Where to save HTML reports

## Interpreting Results

The coverage report shows:
- `Stmts`: Number of statements in the file
- `Miss`: Number of statements not executed during tests
- `Cover`: Percentage of statements covered
- `Missing`: Line numbers of statements not covered

## Improving Coverage

To improve coverage:
1. Look at the "Missing" lines in the report
2. Write tests that execute those lines
3. Run coverage again to verify improvement

## Integration with CI/CD

You can integrate coverage testing into your CI/CD pipeline by:
1. Adding a step to run `python run_full_coverage.py`
2. Setting a minimum coverage threshold
3. Failing the build if coverage falls below the threshold

## Related Documentation

- [Coverage.py Documentation](https://coverage.readthedocs.io/)
- [Django Test Coverage](https://docs.djangoproject.com/en/5.0/topics/testing/advanced/#integration-with-coverage-py)
