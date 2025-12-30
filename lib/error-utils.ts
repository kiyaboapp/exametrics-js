// Utility functions for handling errors

export function getErrorMessage(error: any): string {
  // Handle FastAPI validation errors
  if (error?.detail) {
    if (Array.isArray(error.detail)) {
      // FastAPI validation error with multiple fields
      return error.detail.map((err: any) => 
        `${err.loc?.join('.')} ${err.msg}`.trim()
      ).join(', ');
    }
    
    if (typeof error.detail === 'object' && error.detail.msg) {
      // Single validation error object with structure {type, loc, msg, input}
      const err = error.detail;
      return `${err.loc?.join('.')} ${err.msg}`.trim() || err.msg || 'Validation error';
    }
    
    // String error message
    if (typeof error.detail === 'string') {
      return error.detail;
    }
  }
  
  // Handle axios errors
  if (error?.response?.data) {
    return getErrorMessage(error.response.data);
  }
  
  // Handle error message property
  if (error?.message) {
    return error.message;
  }
  
  // Handle error with msg property
  if (error?.msg) {
    return error.msg;
  }
  
  // Handle network errors
  if (error?.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  if (error?.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection.';
  }
  
  // Fallback
  return 'An error occurred';
}

export function isValidationError(error: any): boolean {
  return error?.detail && (Array.isArray(error.detail) || typeof error.detail === 'object');
}
