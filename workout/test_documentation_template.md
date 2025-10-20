# Test Documentation: Calculator Module

This document outlines the test suite for the `calculator` module.

## Overview

The tests are designed to verify the correctness of the basic arithmetic operations: addition, subtraction, multiplication, and division. The test suite uses Python's built-in `unittest` framework.

## Testing Framework

- **Framework:** Python `unittest`
- **Test File:** `sample_test.py`

## How to Run Tests

To execute the test suite, run the following command from your terminal in the same directory as the file:

```bash
python -m unittest sample_test.py
```

## Test Suite: `TestCalculator`

This suite contains all tests for the `calculator` module.

### Test Cases

| Test Case | Description |
| --- | --- |
| `test_add` | Verifies the correct summation of integers, including positive and negative numbers. |
| `test_subtract` | Verifies the correct subtraction of integers. |
| `test_multiply` | Verifies the correct multiplication of integers. |
| `test_divide` | Verifies the correct division of integers and ensures a `ZeroDivisionError` is raised when dividing by zero. |