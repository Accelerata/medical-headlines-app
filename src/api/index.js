import axios from "axios";
import { Toast } from "antd-mobile";
import {
  LOCAL_clearToken,
  LOCAL_clearUserInfo,
  LOCAL_getToken,
} from "@/utils/localstorage";

// 创建 axios 实例，统一配置
const request = axios.create({
  baseURL: "http://172.20.10.3:8082", // 本地后端基础请求地址
  timeout: 10000, // 超时时间，可按需调整
});

let isRedirectingToLogin = false;

const redirectToLogin = () => {
  if (isRedirectingToLogin) return;
  isRedirectingToLogin = true;
  LOCAL_clearToken();
  LOCAL_clearUserInfo();
  const currentPath = window.location.pathname + window.location.search;
  const target = `/login?redirect=${encodeURIComponent(currentPath)}`;
  window.location.replace(target);
};

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

    const status = error.response?.status;
    if (status === 401) {
      Toast.show({ content: "登录已过期，请重新登录", icon: "fail" });
      redirectToLogin();
      return Promise.resolve({
        code: 401,
        msg: "登录已过期，请重新登录",
      });
    }

    // 全局统一弹窗
    Toast.show({ content: errorMsg, icon: "fail" });

    return Promise.resolve({
      code: status || 500, // 把 HTTP 状态码当做业务 code 返回
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
export const getArticleListApi = (page = 1, size = 50, config = {}) => {
  return request.get("/api/article/page", {
    ...config,
    params: {
      page,
      size,
    },
  });
};

// 图片上传接口 POST /api/article/upload-image
export const uploadImageApi = (data) => {
  return request.post("/api/article/upload-image", data);
};

//文章上传接口 POST /api/article
export const uploadArticleApi = (data) => {
  return request.post("/api/article", data);
};

//获取用户信息api GET /api/user/info
export const getUserInfoApi = () => {
  return request.get("/api/user/info");
};

//更新用户信息api PUT /api/user/info
export const updateUserInfoApi = (data) => {
  return request.put("/api/user/info", data);
};

//更新用户头像POST /api/user/avatar
export const updateUserAvatarApi = (data) => {
  return request.post("/api/user/avatar", data);
};

//获取文章详情api GET /api/article/{id}
export const getArticleDetailApi = (id) => {
  return request.get(`/api/article/${id}`);
};

//文章点赞接口 /api/article/{id}/like
export const likeArticleApi = (id) => {
  return request.post(`/api/article/${id}/like`);
};

//文章取消点赞接口 /api/article/{id}/like
export const unlikeArticleApi = (id) => {
  return request.delete(`/api/article/${id}/like`);
};

//根据用户id查询用户是否点赞 GET /api/posts/{postId}/liked
export const isLikedArticleApi = (postId) => {
  return request.get(`/api/posts/${postId}/liked`);
};

//获取评论列表接口/api/posts/{postId}/comments GET
export const getCommentListApi = (postId) => {
  return request.get(`/api/posts/${postId}/comments`);
};

//发布评论/api/posts/{postId}/comments POST
export const publishCommentApi = (postId, { content }) => {
  return request.post(`/api/posts/${postId}/comments`, { content });
};

//评论点赞接口 /api/comments/{commentId}/like
export const likeCommentApi = (commentId) => {
  return request.post(`/api/comments/${commentId}/like`);
};

//评论取消点赞接口 /api/comments/{commentId}/like
export const unlikeCommentApi = (commentId) => {
  return request.delete(`/api/comments/${commentId}/like`);
};

//获取回复评论列表接口 /api/comments/{commentId}/replies
export const getReplyCommentListApi = (commentId) => {
  return request.get(`/api/comments/${commentId}/replies`);
};

//发布回复评论接口 /api/comments/{commentId}/replies POST
export const publishReplyCommentApi = (commentId, { content }) => {
  return request.post(`/api/comments/${commentId}/replies`, { content });
};

//回复评论点赞接口 /api/replies/{replyId}/like
export const likeReplyCommentApi = (replyId) => {
  return request.post(`/api/replies/${replyId}/like`);
};

//回复评论取消点赞接口 /api/replies/{replyId}/like
export const unlikeReplyCommentApi = (replyId) => {
  return request.delete(`/api/replies/${replyId}/like`);
};

//根据用户id查询用户是否关注 /api/users/{targetUserId}/followed GET
export const isFollowedApi = (targetUserId) => {
  return request.get(`/api/users/${targetUserId}/followed`);
};

//关注接口 /api/users/{targetUserId}/follow（部分后端要求 JSON body，空对象即可）
export const followApi = (targetUserId) => {
  return request.post(`/api/users/${targetUserId}/follow`, {});
};

//取消关注接口 /api/users/{targetUserId}/follow
export const unfollowApi = (targetUserId) => {
  return request.delete(`/api/users/${targetUserId}/follow`);
};

//获取关注列表接口 /api/users/{userId}/following
export const getFollowingListApi = (userId) => {
  return request.get(`/api/users/${userId}/following`);
};

//获取粉丝列表接口 /api/users/{userId}/followers
export const getFollowersListApi = (userId) => {
  return request.get(`/api/users/${userId}/followers`);
};

//更新用户背景图接口 POST /api/user/background
export const updateUserBackgroundApi = (data) => {
  return request.post("/api/user/background", data);
};

//获取用户获赞数接口/api/article/user/{userId}/likes-total
export const getUserLikesTotalApi = (userId) => {
  return request.get(`/api/article/user/${userId}/likes-total`);
};

//根据用户id查询文章 api/article/user/{userId}
export const getArticleListByUserIdApi = (userId, page = 1, size = 10) => {
  return request.get(`/api/article/user/${userId}`, { params: { page, size } });
};

//模糊搜索接口 /api/article/search
export const searchArticleApi = (q, page = 1, size = 10) => {
  return request.get(`/api/article/search`, { params: { q, page, size } });
};

//个人文章列表接口 /api/article/mine
export const getArticleListByMineApi = (page = 1, size = 10) => {
  return request.get(`/api/article/mine`, { params: { page, size } });
};

//根据用户id查询用户信息 /api/users/{userId}
export const getUserInfoByIdApi = (userId, page = 1, size = 10) => {
  return request.get(`/api/users/${userId}`, { params: { page, size } });
};
export default request;
