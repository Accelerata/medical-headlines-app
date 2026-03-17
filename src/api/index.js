import axios from "axios";
import { Toast } from "antd-mobile";
import { LOCAL_getToken } from "@/utils/localstorage";

// 创建 axios 实例，统一配置
const request = axios.create({
  baseURL: "http://172.20.10.3:8081", // 本地后端基础请求地址
  timeout: 10000, // 超时时间，可按需调整
});

// 请求拦截器：统一带 token；FormData 时不要改 Content-Type，由浏览器自动带 boundary
request.interceptors.request.use(
  (config) => {
    const token = LOCAL_getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 上传 FormData 时不要手动设 Content-Type，否则会丢掉 boundary，后端收不到文件
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器（统一处理错误、只返回 data）
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数，说明请求成功
    return response.data; // 通常直接返回 data 部分
  },
  function (error) {
    // 超出 2xx 范围的状态码（比如你遇到的 400, 401, 500）都会触发这个函数
    console.error("全局拦截到错误:", error);

    // 统一提取后端的错误提示
    const errorMsg =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "服务器开小差了";

    // 全局统一弹窗！
    Toast.show({ content: errorMsg, icon: "fail" });

    return Promise.resolve({
      code: error.response?.status || 500, // 把 HTTP 状态码当做业务 code 返回
      msg: errorMsg,
    });
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

// 忘记密码接口：POST /api/reset-password-login
export const forgotPasswordApi = (data) => {
  return request.post("/api/reset-password-login", data);
};

// 获取文章列表接口：/api/article/page
export const getArticleListApi = () => {
  return request.get("/api/article/page");
};

// 图片上传接口 POST /api/article/upload-image
export const uploadImageApi = (data) => {
  return request.post("/api/article/upload-image", data);
};

//文章上传接口 POST /api/article
export const uploadArticleApi = (data) => {
  return request.post("/api/article", data);
};
export default request;
