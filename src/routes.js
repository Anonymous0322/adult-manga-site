import React from 'react';

const routes = {
  home: '/',
  catalog: '/catalog',
  catalogCategory: (category) => `/catalog/${category}`,
  forum: '/forum',
  admin: '/admin',
  adminUpload: '/admin/upload',
  adminAnalytics: '/admin/analytics',
  adminUsers: '/admin/users',
  content: (id) => `/content/${id}`,
  profile: '/profile',
  login: '/login',
  register: '/register',
  settings: '/settings',
  library: '/library'
};

export const protectedRoutes = [
  '/admin',
  '/admin/*',
  '/profile',
  '/settings',
  '/library'
];

export const adminRoutes = [
  '/admin',
  '/admin/*'
];

export default routes;