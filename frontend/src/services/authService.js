import axios from "axios";

export const registerUser = (userData) => {
  return axios.post("http://localhost:3001/api/user/register", userData);
};

export const loginUser = (userData) => {
  return axios.post("http://localhost:3001/api/user/login", userData);
};

