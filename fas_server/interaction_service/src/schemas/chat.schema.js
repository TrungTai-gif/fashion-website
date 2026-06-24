import Joi from "joi";

// Schema cho tạo conversation
export const createConversationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),
  participantId: Joi.string().required().messages({
    "string.empty": "Participant ID is required",
    "any.required": "Participant ID is required",
  }),
});

// Schema cho mark as read
export const markAsReadSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),
});

// Schema cho send message (cho API endpoint nếu có)
export const sendMessageSchema = Joi.object({
  conversationId: Joi.string().optional(),
  receiverId: Joi.string().required().messages({
    "string.empty": "Receiver ID is required",
    "any.required": "Receiver ID is required",
  }),
  content: Joi.string().required().min(1).max(1000).messages({
    "string.empty": "Message content is required",
    "string.min": "Message content cannot be empty",
    "string.max": "Message content cannot exceed 1000 characters",
    "any.required": "Message content is required",
  }),
  messageType: Joi.string().valid("text", "image", "file").default("text"),
});

// Schema cho pagination query
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
});

// Schema cho user ID param
export const userIdParamSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),
});

// Schema cho conversation ID param
export const conversationIdParamSchema = Joi.object({
  conversationId: Joi.string().required().messages({
    "string.empty": "Conversation ID is required",
    "any.required": "Conversation ID is required",
  }),
});
