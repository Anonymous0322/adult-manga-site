import { adminApi } from '../utils/api';

export const adminService = {
  async getStats() {
    try {
      // Mock data for now
      return {
        totalUsers: 24589,
        totalContent: 1808,
        activeUsers: 1245,
        newUsersToday: 89,
        totalViews: 5200000,
        totalComments: 12450,
        averageTime: '24:18'
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  async getUsers(page = 1) {
    try {
      // Mock data for now
      const users = [
        { id: 1, username: 'DarkLord', email: 'darklord@mail.com', level: 5, points: 12500, role: 'user', status: 'active', joinDate: '2023-01-15' },
        { id: 2, username: 'MangaMaster', email: 'master@mail.com', level: 5, points: 9800, role: 'moderator', status: 'active', joinDate: '2023-02-20' },
        { id: 3, username: 'WeebQueen', email: 'queen@mail.com', level: 4, points: 7200, role: 'user', status: 'active', joinDate: '2023-03-10' },
        { id: 4, username: 'AnimeLover', email: 'lover@mail.com', level: 4, points: 6500, role: 'user', status: 'suspended', joinDate: '2023-03-25' },
        { id: 5, username: 'KawaiiChan', email: 'kawaii@mail.com', level: 3, points: 4200, role: 'user', status: 'active', joinDate: '2023-04-05' }
      ];
      
      return {
        users,
        totalPages: 5,
        currentPage: page,
        totalUsers: 24589
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUser(userId, data) {
    try {
      console.log('Updating user:', userId, data);
      // Mock update
      return { success: true, user: { id: userId, ...data } };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      console.log('Deleting user:', userId);
      // Mock delete
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getContent(page = 1) {
    try {
      // Mock data for now
      return {
        content: [],
        totalPages: 1,
        currentPage: page,
        totalContent: 0
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }
};