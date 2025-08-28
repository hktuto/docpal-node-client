/**
 * Convert display name to table name slug
 * Rules:
 * - Convert to lowercase
 * - Replace spaces with underscores
 * - Remove special characters except underscores and hyphens
 * - Ensure it starts with a letter
 * - Limit to 50 characters for database compatibility
 */
export function displayNameToTableName(displayName: string): string {
  if (!displayName || typeof displayName !== 'string') {
    return ''
  }

  // Convert to lowercase and trim
  let tableName = displayName.trim().toLowerCase()
  
  // Replace spaces with underscores
  tableName = tableName.replace(/\s+/g, '_')
  
  // Remove special characters except underscores and hyphens
  tableName = tableName.replace(/[^a-z0-9_-]/g, '')
  
  // Ensure it starts with a letter by prepending 'table_' if needed
  if (!/^[a-z]/.test(tableName)) {
    tableName = 'table_' + tableName
  }
  
  // Remove multiple consecutive underscores
  tableName = tableName.replace(/_+/g, '_')
  
  // Remove leading/trailing underscores
  tableName = tableName.replace(/^_+|_+$/g, '')
  
  // Limit length to 50 characters
  if (tableName.length > 50) {
    tableName = tableName.substring(0, 50)
    // Ensure we don't end with an underscore
    tableName = tableName.replace(/_+$/, '')
  }
  
  return tableName
}

/**
 * Validate display name according to requirements
 * - Maximum 200 characters
 * - Can have spaces
 * - No special characters except common punctuation
 */
export function validateDisplayName(displayName: string): { isValid: boolean; error?: string } {
  if (!displayName || typeof displayName !== 'string') {
    return { isValid: false, error: 'Display name is required' }
  }

  const trimmed = displayName.trim()
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Display name cannot be empty' }
  }

  if (trimmed.length > 200) {
    return { isValid: false, error: 'Display name must be 200 characters or less' }
  }

  // Allow letters, numbers, spaces, and basic punctuation
  const allowedPattern = /^[a-zA-Z0-9\s\-_.,()]+$/
  if (!allowedPattern.test(trimmed)) {
    return { isValid: false, error: 'Display name contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed' }
  }

  return { isValid: true }
}

/**
 * Validate description according to requirements
 * - Maximum 200 characters
 */
export function validateDescription(description: string): { isValid: boolean; error?: string } {
  if (!description || typeof description !== 'string') {
    // Description is optional, so empty is valid
    return { isValid: true }
  }

  const trimmed = description.trim()
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Description must be 200 characters or less' }
  }

  return { isValid: true }
}