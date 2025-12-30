// Test file for error utilities
import { getErrorMessage } from './error-utils';

// Test FastAPI validation error with object structure
const testValidationError = {
  detail: {
    type: 'value_error',
    loc: ['body', 'exam_name'],
    msg: 'field required',
    input: {}
  }
};

// Test FastAPI validation error with array
const testArrayValidationError = {
  detail: [
    {
      type: 'value_error',
      loc: ['body', 'start_date'],
      msg: 'field required',
      input: {}
    },
    {
      type: 'value_error',
      loc: ['body', 'exam_level'],
      msg: 'field required',
      input: {}
    }
  ]
};

// Test string error
const testStringError = {
  detail: 'Invalid credentials'
};

// Test axios error
const testAxiosError = {
  response: {
    data: {
      detail: 'Exam not found'
    }
  }
};

console.log('Testing error handling:');
console.log('Validation error:', getErrorMessage(testValidationError));
console.log('Array validation error:', getErrorMessage(testArrayValidationError));
console.log('String error:', getErrorMessage(testStringError));
console.log('Axios error:', getErrorMessage(testAxiosError));
