/**
 * Validate university email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidUniversityEmail = (email) => {
  // Common university email patterns
  const universityEmailPatterns = [
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.[a-z]{2,})$/i,
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+university/i,
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+uni/i,
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+college/i
  ];

  return universityEmailPatterns.some(pattern => pattern.test(email));
};

/**
 * Generate a 6-digit verification code
 * @returns {string}
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true, message: 'Password is valid' };
};

module.exports = {
  isValidUniversityEmail,
  generateVerificationCode,
  validatePassword
};


