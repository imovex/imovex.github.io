import axios from 'axios';

const API_BASE_URL = 'http://185.113.125.111:8080'; // Ersetzen Sie dies durch Ihre API-URL

export const postUserData = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const postLogData = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/log`, data);
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  };

  export const updateUser = async (data) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error putting new user data:', error);
      throw error;
    }
  };

  export const getUserData = async (data) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  };

  export const getPublicKey = async (data) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/public-key`, data);
      return response.data;
    } catch (error) {
      console.error('Error getting public key:', error);
      throw error;
    }
  };