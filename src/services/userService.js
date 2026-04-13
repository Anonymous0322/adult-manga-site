import { userApi } from '../utils/api';

export const userService = {
  async getProfile(userId) {
    try {
      const response = await userApi.getProfile(userId);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      const response = await userApi.updateProfile(data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async getActivity(userId) {
    try {
      const response = await userApi.getActivity(userId);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  async getLibrary() {
    try {
      const response = await userApi.getLibrary();
      return response.data;
    } catch (error) {
      console.error('Error fetching library:', error);
      throw error;
    }
  },

  async addToLibrary(contentId) {
    try {
      const response = await userApi.addToLibrary(contentId);
      return response.data;
    } catch (error) {
      console.error('Error adding to library:', error);
      throw error;
    }
  },

  async removeFromLibrary(contentId) {
    try {
      const response = await userApi.removeFromLibrary(contentId);
      return response.data;
    } catch (error) {
      console.error('Error removing from library:', error);
      throw error;
    }
  }
};