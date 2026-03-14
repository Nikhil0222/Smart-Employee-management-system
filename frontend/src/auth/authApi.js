import api from "../api/axios";

export const login = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};
