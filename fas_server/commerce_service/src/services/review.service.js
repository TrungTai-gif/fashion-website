import Review from '../models/review.model.js';
import ApiResponse from "../utils/apiResponse.js";
import ApiError from '../utils/ApiError.js';
import Product from "../models/product.model.js";

const createReview = async (data) => {
  try {
    console.log('Creating review with data:', data);

    const reviewData = {
      product: data.product,
      user: data.user || null,
      username: data.username?.trim(),
      comment: data.comment?.trim(),
      rating: data.rating,
      isVerified: data.isVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate required fields
    if (!reviewData.product) {
      throw new Error('Product reference is required');
    }
    if (!reviewData.username) {
      throw new Error('Username is required');
    }
    if (!reviewData.comment) {
      throw new Error('Comment is required');
    }
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Valid rating between 1-5 is required');
    }

    // Check if product exists
    const productExists = await Product.findById(reviewData.product);
    if (!productExists) {
      throw new Error('Product not found');
    }

    // Check for duplicate review (if user is provided)
    if (reviewData.user) {
      const existingReview = await Review.findOne({
        product: reviewData.product,
        user: reviewData.user
      });
      
      if (existingReview) {
        throw new Error('You have already reviewed this product');
      }
    }

    const review = await Review.create(reviewData);
    
    console.log('Review created successfully:', review._id);
    
    return review;
  } catch (error) {
    console.error('Error in createReview service:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      throw new Error('You have already reviewed this product');
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    
    throw error;
  }
};

const getReviewsByProduct = async (productId) => {
  const reviews = await Review.find({ product: productId });

  return new ApiResponse({
    status: 200,
    data: reviews,
    message: 'Reviews retrieved successfully',
  });
};

const updateReview = async (id, data) => {
  const review = await Review.findByIdAndUpdate(id, data, { new: true });
  if (!review) throw new ApiError(404, 'Review not found');

  return new ApiResponse({
    status: 200,
    data: review,
    message: 'Review updated successfully',
  });
};

const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new ApiError(404, 'Review not found');

  return new ApiResponse({
    status: 200,
    data: review,
    message: 'Review deleted successfully',
  });
};

export default {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};