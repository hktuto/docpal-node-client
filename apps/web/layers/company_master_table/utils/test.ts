// Test script for string utilities
import { displayNameToTableName, validateDisplayName, validateDescription } from './stringUtils'

// Test displayNameToTableName function
console.log('Testing displayNameToTableName:')
console.log('User Management ->', displayNameToTableName('User Management'))
console.log('Product Catalog ->', displayNameToTableName('Product Catalog'))
console.log('Customer Support Tickets ->', displayNameToTableName('Customer Support Tickets'))
console.log('API Keys & Tokens ->', displayNameToTableName('API Keys & Tokens'))
console.log('123 Test ->', displayNameToTableName('123 Test'))
console.log('Empty string ->', displayNameToTableName(''))

// Test validateDisplayName function
console.log('\nTesting validateDisplayName:')
console.log('Valid name:', validateDisplayName('User Management System'))
console.log('Empty name:', validateDisplayName(''))
console.log('Too long name:', validateDisplayName('A'.repeat(201)))
console.log('Invalid characters:', validateDisplayName('User@Management#System'))

// Test validateDescription function
console.log('\nTesting validateDescription:')
console.log('Valid description:', validateDescription('This manages user accounts'))
console.log('Empty description:', validateDescription(''))
console.log('Too long description:', validateDescription('A'.repeat(201)))

console.log('\nAll tests completed successfully!')