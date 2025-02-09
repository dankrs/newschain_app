export const COLORS = {
  primary: "#2563EB",     // blue-600
  background: "#FFFFFF",  // white
  text: "#1F2937",       // gray-800
  textSecondary: "#6B7280", // gray-500
  gray: "#E5E7EB",       // gray-200
  white: "#FFFFFF",
  black: "#000000",
  error: "#DC2626", // red-600
  // Add any other colors you need
};

export const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

export const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

export const STRINGS = {
  welcome: {
    title: "Welcome to NewsChain",
    subtitle: "Your trusted source for decentralized news",
    login: "Login",
    signup: "Sign Up",
    or: "or"
  },
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to continue",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signupLink: "Sign up",
    forgotPassword: "Forgot Password?",
  },
  register: {
    title: "Create Account",
    subtitle: "Sign up to get started",
    nameLabel: "Full Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    registerButton: "Sign Up",
    haveAccount: "Already have an account?",
    loginLink: "Login",
  },
  validation: {
    nameRequired: "Name is required",
    nameLength: "Name must be at least 2 characters",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordLength: "Password must be at least 8 characters",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match",
  },
  errors: {
    generalError: "An error occurred. Please try again.",
    networkError: "Network connection error. Please check your internet connection.",
    invalidEmail: "The email address is invalid or already in use.",
    weakPassword: "Password is too weak. It should be at least 8 characters long.",
    profileCreationFailed: "Failed to create user profile. Please try again.",
  },
  verification: {
    title: "Verify Your Email",
    message: "We've sent a verification link to your email address. Please:\n\n" +
      "1. Open your email inbox\n" +
      "2. Click the verification link\n" +
      "3. Return here and tap 'Back to Login'\n" +
      "4. Sign in with your email and password",
  },
};
