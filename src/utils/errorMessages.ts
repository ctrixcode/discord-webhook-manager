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
    FAILED_CREATE_UPDATE_USER_ERROR: {
      message: 'Failed to create or update user with Discord info',
      code: 'FAILED_CREATE_UPDATE_USER_ERROR',
    },
    INVALID_REFRESH_TOKEN_ERROR: {
      message: 'Authentication failed. Please log in again.',
      code: 'INVALID_REFRESH_TOKEN_ERROR',
    },
    EXPIRED_REFRESH_TOKEN_ERROR: {
      message: 'Your session has expired. Please log in again.',
      code: 'EXPIRED_REFRESH_TOKEN_ERROR',
    },
    USER_AGENT_MISMATCH_ERROR: {
      message: 'Authentication failed. Please log in again.',
      code: 'USER_AGENT_MISMATCH_ERROR',
    },
  },
  Discord: {
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
