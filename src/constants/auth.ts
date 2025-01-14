export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  INVALID_NAME: 'Name must be at least 2 characters',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ADDRESS: 'Please enter a valid address',
  SIGN_IN_FAILED: 'Failed to sign in',
  SIGN_UP_FAILED: 'Failed to create account'
} as const;

export const AUTH_MESSAGES = {
  PROCESSING: 'Processing...',
  SIGNING_IN: 'Signing in...',
  CREATING_ACCOUNT: 'Creating account...'
} as const;