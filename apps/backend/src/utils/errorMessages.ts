export const ErrorMessages = {
  Auth: {
    NO_TOKEN_ERROR: {
      message: 'No token provided',
      code: 'NO_TOKEN_ERROR',
    },
    MISSING_CODE_ERROR: {
      message: 'Missing authorization code',
      code: 'MISSING_CODE_ERROR',
    },
    MISSING_CREDENTIALS_ERROR: {
      message: 'Email and password are required',
      code: 'MISSING_CREDENTIALS_ERROR',
    },
    MISSING_SIGNUP_FIELDS_ERROR: {
      message: 'Email, password, full name, and username are required',
      code: 'MISSING_SIGNUP_FIELDS_ERROR',
    },
    MISSING_VERIFICATION_TOKEN_ERROR: {
      message: 'Verification token is required',
      code: 'MISSING_VERIFICATION_TOKEN_ERROR',
    },
    INVALID_CREDENTIALS_ERROR: {
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS_ERROR',
    },
    INVALID_VERIFICATION_TOKEN_ERROR: {
      message: 'Invalid or expired verification token',
      code: 'INVALID_VERIFICATION_TOKEN_ERROR',
    },
    VERIFICATION_TOKEN_ALREADY_USED_ERROR: {
      message: 'This verification link has already been used',
      code: 'VERIFICATION_TOKEN_ALREADY_USED_ERROR',
    },
    EMAIL_ALREADY_IN_USE_ERROR: {
      message: 'Email is already in use',
      code: 'EMAIL_ALREADY_IN_USE_ERROR',
    },
    EMAIL_ALREADY_LINKED_DISCORD_ERROR: {
      message:
        'Email is already linked with a Discord account, to set password go to account settings',
      code: 'EMAIL_ALREADY_LINKED_DISCORD_ERROR',
    },
    EMAIL_ALREADY_LINKED_GOOGLE_ERROR: {
      message:
        'Email is already linked with a Google account, to set password go to account settings',
      code: 'EMAIL_ALREADY_LINKED_GOOGLE_ERROR',
    },
    USERNAME_ALREADY_IN_USE_ERROR: {
      message: 'Username is already in use',
      code: 'USERNAME_ALREADY_IN_USE_ERROR',
    },
    FAILED_CREATE_UPDATE_USER_ERROR: {
      message: 'Failed to create or update user with Discord info',
      code: 'FAILED_CREATE_UPDATE_USER_ERROR',
    },
    INVALID_TOKEN_ERROR: {
      message: 'Authentication failed. Please log in again.',
      code: 'INVALID_TOKEN_ERROR',
    },
    EXPIRED_TOKEN_ERROR: {
      message: 'Your session has expired. Please log in again.',
      code: 'EXPIRED_REFRESH_TOKEN_ERROR',
    },
    USER_AGENT_MISMATCH_ERROR: {
      message: 'Authentication failed. Please log in again.',
      code: 'USER_AGENT_MISMATCH_ERROR',
    },
    USER_NOT_FOUND_ERROR: {
      message: 'User not found',
      code: 'USER_NOT_FOUND_ERROR',
    },
    CURRENT_PASSWORD_REQUIRED: {
      message: 'Current password is required to change password',
      code: 'CURRENT_PASSWORD_REQUIRED',
    },
    INVALID_CURRENT_PASSWORD: {
      message: 'Current password is incorrect',
      code: 'INVALID_CURRENT_PASSWORD',
    },
    NEW_PASSWORD_REQUIRED: {
      message: 'New password is required',
      code: 'NEW_PASSWORD_REQUIRED',
    },
  },
  Google: {
    EMAIL_ALREADY_LINKED_ERROR: {
      message:
        'Email is registered, Please login using your email and password.',
      code: 'EMAIL_ALREADY_LINKED_ERROR',
    },
    EMAIL_ALREADY_LINKED_DISCORD_ERROR: {
      message:
        'Email is already linked with a Discord account, Please login using your discord account.',
      code: 'EMAIL_ALREADY_LINKED_DISCORD_ERROR',
    },
    INVALID_EMAIL_FORMAT_ERROR: {
      message: 'Invalid email format',
      code: 'INVALID_EMAIL_FORMAT_ERROR',
    },
    MISSING_GOOGLE_ID_OR_EMAIL_ERROR: {
      message: 'Google ID and email are required',
      code: 'MISSING_GOOGLE_ID_OR_EMAIL_ERROR',
    },
    MISSING_CODE_ERROR: {
      message: 'Missing authorization code',
      code: 'MISSING_CODE_ERROR',
    },
    FAILED_TOKEN_EXCHANGE_ERROR: {
      message: 'Failed to exchange Google code for token',
      code: 'FAILED_TOKEN_EXCHANGE_ERROR',
    },
    FAILED_FETCH_USER_INFO_ERROR: {
      message: 'Failed to fetch Google user info',
      code: 'FAILED_FETCH_USER_INFO_ERROR',
    },
    TOKEN_FETCH_ERROR: {
      message: 'Error retrieving Google token',
      code: 'TOKEN_FETCH_ERROR',
    },
  },
  Discord: {
    EMAIL_ALREADY_LINKED_ERROR: {
      message:
        'Email is registered, to interact with Discord please link your account from settings',
      code: 'EMAIL_ALREADY_LINKED_ERROR',
    },
    EMAIL_ALREADY_LINKED_GOOGLE_ERROR: {
      message:
        'Email is already linked with a Google account, to interact with Discord please link your account from settings',
      code: 'EMAIL_ALREADY_LINKED_GOOGLE_ERROR',
    },
    EMAIL_MISMATCH_ERROR: {
      message:
        'Discord account email does not match your account email. Please use a Discord account with the same email address.',
      code: 'DISCORD_EMAIL_MISMATCH_ERROR',
    },
    FAILED_TOKEN_EXCHANGE_ERROR: {
      message: 'Failed to exchange Discord code for token',
      code: 'FAILED_TOKEN_EXCHANGE_ERROR',
    },
    FAILED_FETCH_USER_INFO_ERROR: {
      message: 'Failed to fetch Discord user info',
      code: 'FAILED_FETCH_USER_INFO_ERROR',
    },
    TOKEN_CREATION_ERROR: {
      message: 'Error creating discord token',
      code: 'TOKEN_CREATION_ERROR',
    },
    TOKEN_FETCH_ERROR: {
      message: 'Error retrieving discord token',
      code: 'TOKEN_FETCH_ERROR',
    },
    TOKEN_NOT_FOUND_ERROR: {
      message: 'Discord token not found',
      code: 'TOKEN_NOT_FOUND_ERROR',
    },
    TOKEN_UPDATE_ERROR: {
      message: 'Error updating discord token',
      code: 'TOKEN_UPDATE_ERROR',
    },
    TOKEN_DELETE_ERROR: {
      message: 'Error deleting discord token',
      code: 'TOKEN_DELETE_ERROR',
    },
    ACCOUNT_NOT_FOUND_ERROR: {
      message: 'Account not found. Please login first.',
      code: 'ACCOUNT_NOT_FOUND_ERROR',
    },
    ALREADY_LINKED_ERROR: {
      message: 'Discord account is already linked to this account',
      code: 'DISCORD_ALREADY_LINKED',
    },
    LINKED_TO_ANOTHER_ACCOUNT_ERROR: {
      message: 'This Discord account is already linked to another account',
      code: 'DISCORD_LINKED_TO_ANOTHER_ACCOUNT',
    },
  },
  Avatar: {
    CREATION_ERROR: {
      message: 'Error creating avatar',
      code: 'CREATION_ERROR',
    },
    UPLOAD_NOT_MULTIPART_ERROR: {
      message: 'Request is not multipart',
      code: 'UPLOAD_NOT_MULTIPART_ERROR',
    },
    UPLOAD_ERROR: { message: 'Error uploading avatar', code: 'UPLOAD_ERROR' },
    NOT_FOUND_ERROR: { message: 'Avatar not found', code: 'NOT_FOUND_ERROR' },
    FETCH_ERROR: { message: 'Error fetching avatar', code: 'FETCH_ERROR' },
    UPDATE_ERROR: { message: 'Error updating avatar', code: 'UPDATE_ERROR' },
    DELETE_ERROR: { message: 'Error deleting avatar', code: 'DELETE_ERROR' },
    USERNAME_MISSING_ERROR: {
      message: 'Username field is missing',
      code: 'USERNAME_MISSING_ERROR',
    },
  },
  MessageTemplate: {
    CREATION_ERROR: {
      message: 'Error creating message template',
      code: 'CREATION_ERROR',
    },
    FETCH_ERROR: {
      message: 'Error getting message template',
      code: 'FETCH_ERROR',
    },
    NOT_FOUND_ERROR: {
      message: 'Message Template not found',
      code: 'NOT_FOUND_ERROR',
    },
    UPDATE_ERROR: {
      message: 'Error updating message template',
      code: 'UPDATE_ERROR',
    },
    DELETE_ERROR: {
      message: 'Error deleting message template',
      code: 'DELETE_ERROR',
    },
  },
  User: {
    NOT_FOUND_ERROR: { message: 'User not found', code: 'NOT_FOUND_ERROR' },
    ID_REQUIRED_ERROR: {
      message: 'User ID is required',
      code: 'ID_REQUIRED_ERROR',
    },
    UPDATE_ERROR: { message: 'Error updating user', code: 'UPDATE_ERROR' },
    DELETE_ERROR: { message: 'Error deleting user', code: 'DELETE_ERROR' },
    CREATION_ERROR: { message: 'Error creating user', code: 'CREATION_ERROR' },
    FETCH_ERROR: { message: 'Error retrieving user', code: 'FETCH_ERROR' },
    NOT_FOUND_FOR_USAGE_LIMITS_ERROR: {
      message: 'User not found for usage and limits check.',
      code: 'NOT_FOUND_FOR_USAGE_LIMITS_ERROR',
    },
  },
  Webhook: {
    CREATION_ERROR: {
      message: 'Error creating webhook',
      code: 'CREATION_ERROR',
    },
    FETCH_ERROR: { message: 'Error getting webhooks', code: 'FETCH_ERROR' },
    NOT_FOUND_ERROR: { message: 'Webhook not found', code: 'NOT_FOUND_ERROR' },
    UPDATE_ERROR: { message: 'Error updating webhook', code: 'UPDATE_ERROR' },
    DELETE_ERROR: { message: 'Error deleting webhook', code: 'DELETE_ERROR' },
    TEST_ERROR: { message: 'Error testing webhook', code: 'TEST_ERROR' },
    SEND_ERROR: { message: 'Error sending message', code: 'SEND_ERROR' },
    IDS_REQUIRED_ERROR: {
      message: 'Webhook IDs are required and cannot be empty',
      code: 'IDS_REQUIRED_ERROR',
    },
    SEND_FAILED_ALL_ERROR: {
      message: 'Failed to send message to any webhook',
      code: 'SEND_FAILED_ALL_ERROR',
    },
    NOT_FOUND_OR_AUTHORIZED_ERROR: {
      message: 'Webhook not found or not authorized',
      code: 'NOT_FOUND_OR_AUTHORIZED_ERROR',
    },
  },
  Cloudinary: {
    UPLOAD_ERROR: { message: 'Failed to upload media.', code: 'UPLOAD_ERROR' },
    DELETE_ERROR: { message: 'Failed to delete media.', code: 'DELETE_ERROR' },
  },
  MessageHistory: {
    SAVE_ERROR: { message: 'Error saving message history', code: 'SAVE_ERROR' },
  },
  UserUsage: {
    FETCH_CREATE_ERROR: {
      message: 'Failed to retrieve or create user usage record.',
      code: 'FETCH_CREATE_ERROR',
    },
    UPDATE_ERROR: {
      message: 'Failed to update user usage record.',
      code: 'UPDATE_ERROR',
    },
    NOT_FOUND_ERROR: {
      message: 'User usage record not found',
      code: 'NOT_FOUND_ERROR',
    },
  },
  Generic: {
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    UNAUTHORIZED_ERROR: {
      message: 'Unauthorized: User not authenticated.',
      code: 'UNAUTHORIZED_ERROR',
    },
    NO_FILE_DATA_ERROR: {
      message: 'No file data received',
      code: 'NO_FILE_DATA_ERROR',
    },
    NO_FILE_UPLOADED_ERROR: {
      message: 'No file uploaded',
      code: 'NO_FILE_UPLOADED_ERROR',
    },
    FILE_PROCESSING_ERROR: {
      message: 'Error processing file',
      code: 'FILE_PROCESSING_ERROR',
    },
    USAGE_LIMIT_EXCEEDED_ERROR: {
      message: 'Usage limit exceeded.',
      code: 'USAGE_LIMIT_EXCEEDED_ERROR',
    },
    INVALID_INPUT_ERROR: {
      message: 'Invalid input.',
      code: 'INVALID_INPUT_ERROR',
    },
    AUTHENTICATION_ERROR: {
      message: 'Authentication failed.',
      code: 'AUTHENTICATION_ERROR',
    },
    NOT_FOUND_ERROR: {
      message: 'Resource not found.',
      code: 'NOT_FOUND_ERROR',
    },
    SOMETHING_WENT_WENT_ERROR: {
      message: 'Something went wrong',
      code: 'SOMETHING_WENT_WENT_ERROR',
    },
    EXTERNAL_API_ERROR: {
      message: 'External API error.',
      code: 'EXTERNAL_API_ERROR',
    },
  },
};
