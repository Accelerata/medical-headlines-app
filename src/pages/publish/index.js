import { useState, useEffect, useRef } from "react";
import { LeftOutline } from "antd-mobile-icons";
import { Toast, DotLoading } from "antd-mobile";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { useNavigate } from "react-router-dom";
import "@wangeditor/editor/dist/css/style.css"; // 引入 wangeditor css
import "./publish.css";
import { uploadArticleApi, uploadImageApi } from "@/api";
import { LOCAL_getUserInfo } from "@/utils/localstorage";

// 文章类别（与首页一致，不含推荐、热门）
const CATEGORY_OPTIONS = [
  "产业",
  "药企",
  "前沿",
  "科研",
  "临床",
  "科普",
  "辟谣",
  "养生",
  "营养",
  "心理",
  "急救",
  "康复",
  "中医",
  "器械",
];

const Publish = () => {
  const navigate = useNavigate();
  const [editor, setEditor] = useState(null); // editor 实例
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // 文章类别
  const [html, setHtml] = useState(""); // 富文本内容
  const savingRef = useRef(false);
  const publishingRef = useRef(false);

  // 工具栏配置：专为移动端“瘦身”
  const toolbarConfig = {
    excludeKeys: [
      "headerSelect", // 标题选择
      "group-video", // 插入视频
      "insertTable", // 插入表格
      "codeBlock", // 代码块
      "fullScreen", // 全屏
      "insertLink", // 插入链接
      "fontFamily", // 字体
      "fontSize", // 字号
      "color", // 文字颜色
      "bgColor", // 背景色
      "todo", // 待办
      "group-indent", // 缩进
      "clearStyle", // 清除格式
      "blockquote", // 🚨 引用
      "lineHeight", // 🚨 行高
    ],
  };

  // 组件卸载时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const editorConfig = {
    placeholder: "请输入文章内容...",
    MENU_CONF: {
      // 先本地插入图片（base64），发布文章时再统一上传到服务器
      uploadImage: {
        // 在该大小以内的图片会转 base64 插入编辑器内容，不会请求后端
        // 这里设大一些，确保始终走本地插入
        base64LimitSize: 50 * 1024 * 1024, // 50MB
        allowedFileTypes: ["image/*"],
      },
    },
  };

  // 将内容中的 base64 图片上传到服务器，并返回替换后的内容 HTML
  const processContentWithImages = async (originHtml) => {
    let finalContent = originHtml;
    const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/gi;
    const base64Matches = [...finalContent.matchAll(imgRegex)];

    for (const match of base64Matches) {
      const base64Src = match[1]; // data:image/xxx;base64,....
      const arr = base64Src.split(",");
      if (arr.length < 2) continue;

      const mimeMatch = arr[0].match(/data:(.*);base64/);
      const mime = mimeMatch ? mimeMatch[1] : "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "inline-image.png", { type: mime });

      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadImageApi(formData);
      console.log(uploadRes);
      if (!uploadRes || uploadRes.code !== 200) {
        Toast.show({
          content: uploadRes?.msg || "图片上传失败，请稍后重试",
          icon: "fail",
        });
        return null;
      }
      const imageUrl = uploadRes.data;
      if (!imageUrl) continue;

      // 将对应的 src 替换为后端返回的 URL
      finalContent = finalContent.replace(base64Src, imageUrl);
    }

    return finalContent;
  };

  // state: 0 草稿，1 审核中，2 已发布（按后端约定）
  const buildPayload = (state) => {
    // 从本地缓存里取用户信息，组装作者昵称和头像
    let authorname = "";
    let authorAvatar = "";
    const rawUserInfo = LOCAL_getUserInfo();
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(rawUserInfo);
        authorname = parsed?.nickname || "";
        authorAvatar = parsed?.avatar || "";
      } catch (e) {
        // 如果解析失败，就保持默认空字符串
      }
    }

    return {
      title: title.trim(),
      content: html,
      category,
      authorname,
      authorAvatar,
      state,
    };
  };

  const handleSaveDraft = async () => {
    if (savingRef.current) return;

    if (!title.trim()) {
      Toast.show({ content: "请先填写标题" });
      return;
    }
    if (!category) {
      Toast.show({ content: "请选择文章类别" });
      return;
    }
    if (!html || !html.trim() || html === "<p><br></p>") {
      Toast.show({ content: "请先填写内容" });
      return;
    }

    savingRef.current = true;
    try {
      // 草稿也先把图片上传替换成 URL，避免后端存太大的 base64
      const finalContent = await processContentWithImages(html);
      if (finalContent == null) {
        savingRef.current = false;
        return;
      }

      const res = await uploadArticleApi({
        ...buildPayload(0), // 0 = 草稿
        content: finalContent,
      });
      if (!res || res.code !== 200) {
        Toast.show({
          content: res?.msg || "保存草稿失败，请稍后重试",
          icon: "fail",
        });
        return;
      }
      Toast.show({
        content: "草稿已保存",
        icon: "success",
      });
    } catch (e) {
      // 全局拦截器已提示，这里不重复
    } finally {
      savingRef.current = false;
    }
  };

  const handlePublish = async () => {
    if (publishingRef.current) return;
    if (!title.trim()) {
      Toast.show({
        content: "请先填写标题",
      });
      return;
    }
    if (!category) {
      Toast.show({
        content: "请选择文章类别",
      });
      return;
    }
    if (!html || !html.trim() || html === "<p><br></p>") {
      Toast.show({
        content: "请先填写内容",
      });
      return;
    }

    publishingRef.current = true;
    try {
      // 先把内容里的 base64 图片依次上传，替换成真实 URL
      const finalContent = await processContentWithImages(html);
      if (finalContent == null) {
        publishingRef.current = false;
        return;
      }

      const res = await uploadArticleApi({
        ...buildPayload(2), // 2 = 审核中
        content: finalContent,
      });
      if (!res || res.code !== 200) {
        Toast.show({
          content: res?.msg || "发布失败，请稍后重试",
          icon: "fail",
        });
        return;
      }

      Toast.show({
        content: "发布成功",
        icon: "success",
      });
      // 发布成功后清空表单
      setTitle("");
      setCategory("");
      setHtml("");
    } catch (e) {
      // 全局拦截器已提示，这里不重复
    } finally {
      publishingRef.current = false;
    }
  };

  return (
    <div className="publish-page">
      <div className="publish-head">
        <div className="publish-head-left" onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>

        <div className="publish-head-right">
          <span
            className={
              savingRef.current ? "publish-btn disabled" : "publish-btn"
            }
            onClick={savingRef.current ? undefined : handleSaveDraft}
          >
            {savingRef.current ? (
              <>
                <DotLoading /> 保存中
              </>
            ) : (
              "存草稿"
            )}
          </span>
          <span
            className={
              publishingRef.current
                ? "publish-btn primary disabled"
                : "publish-btn primary"
            }
            onClick={publishingRef.current ? undefined : handlePublish}
          >
            {publishingRef.current ? (
              <>
                <DotLoading /> 发布中
              </>
            ) : (
              "发布"
            )}
          </span>
        </div>
      </div>

      <div className="publish-body">
        <input
          className="publish-title-input"
          type="text"
          placeholder="请输入标题（必填）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="publish-category-wrap">
          <label className="publish-category-label">文章类别</label>
          <select
            className="publish-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">请选择类别</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="publish-editor-wrapper">
          <Toolbar
            className="publish-editor-toolbar"
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
          />
          <div className="publish-editor-container">
            <Editor
              defaultConfig={editorConfig}
              value={html}
              onCreated={setEditor}
              onChange={(ed) => setHtml(ed.getHtml())}
              mode="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;
