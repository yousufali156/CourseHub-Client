// src/api/axiosPublic.js
import axios from 'axios';

// ✅ Create a public axios instance
const axiosPublic = axios.create({
  baseURL: 'https://course-hub-server-delta.vercel.app',
  withCredentials: false, // since it's public
});

export default axiosPublic;
