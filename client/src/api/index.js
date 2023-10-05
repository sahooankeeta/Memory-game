import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});
API.interceptors.response.use(
    function (response) {
      
      return response.data;
    },
    function (error) {
      console.log("erorr",error.response.data)
      return error.response.data
    }
  );
export const signIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const resetPassword = (formData) => API.post('/user/reset-password', formData);