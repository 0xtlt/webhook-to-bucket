import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

// Custom error messages
const messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'string.minLength': 'The {{ field }} must be at least {{ min }} characters long',
  'requiredIfMissing': 'The {{ field }} field is required when {{ otherField }} is not provided',
  'path.required': 'A valid path is required for storing the data',
  'dataString.string': 'The dataString must be a valid string',
  'dataFile.file': 'The dataFile must be a valid file'
})

/**
 * Validates webhook request for storing data to S3 bucket
 */
export const setWebhookValidator = vine.compile(
  vine.object({
    path: vine
      .string()
      .trim()
      .minLength(1),
    dataString: vine
      .string()
      .trim()
      .optional()
      .requiredIfMissing('dataFile'),
    dataFile: vine
      .file({
        size: '50mb', // Maximum file size
        extnames: ['*'], // Allow all file extensions
      })
      .optional()
      .requiredIfMissing('dataString')
  })
)

// Set the messages provider for this validator
setWebhookValidator.messagesProvider = messagesProvider
