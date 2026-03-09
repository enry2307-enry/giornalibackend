export const AUTH_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 12, // Standard raccomandato per contrastare il brute-force moderno
    MAX_LENGTH: 64,
    // Regex: Almeno una maiuscola, una minuscola, un numero e un carattere speciale
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
    ERROR_MESSAGE: 'Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
  },
  TOKEN: {
    ACCESS_EXPIRY: '15m',
    REFRESH_EXPIRY: '7d',
  },
  REGISTER: {
    GENERIC_MESSAGE: 'If this email is not registered, you will receive a confirmation shortly.'
  },
  LOGIN: {
    ERROR_MESSAGE: 'Invalid credentials or unverified email. Please check your inbox or request a new verification email.'
  },
  BCRYPT_SALT: 10
};