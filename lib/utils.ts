import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format school/centre number to uppercase
 * @param centreNumber - The centre number to format
 * @returns Uppercase centre number
 */
export function formatCentreNumber(centreNumber: string): string {
  return centreNumber.toUpperCase();
}

/**
 * Format GPA value to 4 decimal places
 * For secondary school (CSEE/ACSEE), GPA should be displayed with 4 decimal places
 * For O-level (PSLE), average should be displayed with 2 decimal places
 * @param value - The GPA value to format
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted GPA string
 */
export function formatGPA(value: number | null | undefined, decimals: number = 4): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return value.toFixed(decimals);
}

/**
 * Format average value to 2 decimal places
 * Used for O-level results
 * @param value - The average value to format
 * @returns Formatted average string
 */
export function formatAverage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return value.toFixed(2);
}

/**
 * Format a number with specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return value.toFixed(decimals);
}

/**
 * Format percentage value
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string with % symbol
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Build pagination query string from page and limit
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Query parameters object
 */
export function buildPaginationParams(page: number = 1, limit: number = 20) {
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)), // Cap at 100 items per page
  };
}

/**
 * Parse pagination info from API response
 * @param pagination - Pagination object from API
 * @returns Parsed pagination info with helper properties
 */
export function parsePaginationInfo(pagination: {
  current: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}) {
  return {
    currentPage: pagination.current,
    totalPages: pagination.total_pages,
    totalItems: pagination.total_items,
    hasNext: pagination.next !== null,
    hasPrevious: pagination.previous !== null,
    isFirstPage: pagination.current === 1,
    isLastPage: pagination.current === pagination.total_pages,
  };
}
