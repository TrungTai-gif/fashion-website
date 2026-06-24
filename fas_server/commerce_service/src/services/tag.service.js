import Tag from '../models/tag.model.js';
import ApiResponse from "../utils/apiResponse.js";
import ApiError from '../utils/ApiError.js';

const createTag = async (data) => {
  try {
    console.log('Creating tag with data:', data);

    const tagData = {
      name: data.name?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate required fields
    if (!tagData.name) {
      throw new Error('Tag name is required');
    }

    // Check if tag with same name already exists
    const existingTag = await Tag.findOne({ 
      name: tagData.name 
    });
    
    if (existingTag) {
      throw new Error(`Tag with name "${tagData.name}" already exists`);
    }

    const tag = await Tag.create(tagData);
    
    console.log('Tag created successfully:', tag._id);
    
    return tag;
    
  } catch (error) {
    console.error('Error in createTag service:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      if (error.keyPattern?.slug) {
        throw new Error('Tag with this name already exists (slug conflict)');
      }
      if (error.keyPattern?.name) {
        throw new Error('Tag with this name already exists');
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    
    throw error;
  }
};

const getTags = async () => {
  const tags = await Tag.find();
  return new ApiResponse({
    status: 200,
    data: tags,
    message: 'Tags retrieved successfully',
  });
};

const updateTag = async (id, data) => {
  const tag = await Tag.findByIdAndUpdate(id, data, { new: true });
  if (!tag) throw new ApiError(404, 'Tag not found');

  return new ApiResponse({
    status: 200,
    data: tag,
    message: 'Tag updated successfully',
  });
};

const deleteTag = async (id) => {
  const tag = await Tag.findByIdAndDelete(id);
  if (!tag) throw new ApiError(404, 'Tag not found');

  return new ApiResponse({
    status: 200,
    data: tag,
    message: 'Tag deleted successfully',
  });
};

export default {
  createTag,
  getTags,
  updateTag,
  deleteTag,
};