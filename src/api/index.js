import axios from "axios";

// 创建 axios 实例，统一配置
const request = axios.create({
  baseURL: "http://10.11.95.159:8080", // 基础请求地址
  timeout: 10000, // 超时时间，可按需调整
});

// 请求拦截器（例如统一带上 token，可以后面再补）
request.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器（统一处理错误、只返回 data）
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 可以在这里做统一错误提示
    return Promise.reject(error);
  },
);

// 登录接口：POST /api/login
export const loginApi = (data) => {
  return request.post("/api/login", data);
};

// 获取验证码接口：POST /api/send-verify-code
export const getCodeApi = (data) => {
  return request.post("/api/send-verify-code", data);
};

// 注册接口：POST /api/register
export const registerApi = (data) => {
  return request.post("/api/register", data);
};

export const forgotPasswordApi = (data) => {
  return request.post("/api/reset-password-login", data);
};

export default request;
