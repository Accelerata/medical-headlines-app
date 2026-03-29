import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi, updateUserAvatarApi, updateUserInfoApi } from "@/api";
import { useState, useEffect, useRef } from "react";
import { Form, Input } from "antd-mobile";
import { Button, Toast } from "antd-mobile";
import "./editorperson.css";
import { LOCAL_setUserInfo } from "@/utils/localstorage";

const EditorPerson = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [form] = Form.useForm();
  const avatarInputRef = useRef(null);
  const updatingAvatarRef = useRef(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  useEffect(() => {
    getUserInfoApi().then((res) => {
      console.log(res);
      setUserInfo(res.data);
      setAvatarUrl(res.data.avatar);
      // console.log(avatarUrl);
      const createTime = res.data.createdAt;
      const [year, month, day] = createTime.slice(0, 10).split("-");
      const createTimeStr = `${year}年${month}月${day}日`;

      form.setFieldsValue({
        nickname: res.data.nickname,
        bio: res.data.bio || "",
        createTime: createTimeStr,
      });
    });
  }, [form]);

  const updateAvatar = () => {
    if (updatingAvatarRef.current) return;
    avatarInputRef.current?.click();
  };

  const onAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    // 允许重复选择同一张图
    e.target.value = "";
    if (!file) return;

    updatingAvatarRef.current = true;
    try {
      const formData = new FormData();
      // 后端一般使用 file 字段接收
      formData.append("file", file);
      const res = await updateUserAvatarApi(formData);
      console.log(res.data);
      if (res.code === 413) {
        Toast.show({ content: "图片大小过大", icon: "fail" });
        return;
      }
      if (!res || res.code !== 200) {
        Toast.show({ content: res?.msg || "头像更新失败", icon: "fail" });
        return;
      }

      // 兼容：后端可能把头像 url 放在 data 或 data.url
      const avatarUrl = res.data?.url || res.data;
      if (!avatarUrl) {
        Toast.show({ content: "更新成功但未返回头像地址", icon: "fail" });
        return;
      }

      const nextUserInfo = { ...userInfo, avatar: avatarUrl };
      setUserInfo(nextUserInfo);
      setAvatarUrl(avatarUrl);
      // 同步到本地缓存，方便其他页面直接展示
      LOCAL_setUserInfo(nextUserInfo);
      Toast.show({ content: "头像已更新", icon: "success" });
    } finally {
      updatingAvatarRef.current = false;
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  const clickfinish = async (values) => {
    const data = {
      nickname: values.nickname,
      bio: values.bio,
    };
    const res = await updateUserInfoApi(data);
    if (res.code === 200) {
      Toast.show({ content: "更新成功", icon: "success" });
      const nextUserInfo = { ...userInfo, ...data };
      setUserInfo(nextUserInfo);
      // 同步到本地缓存，方便其他页面直接展示
      LOCAL_setUserInfo(nextUserInfo);
    } else {
      Toast.show({ content: res.message, icon: "fail" });
    }
  };
  return (
    <div>
      <div className="editorperson-header">
        <div onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <div className="editorperson-header-title">编辑资料</div>
      </div>

      <div className="editorperson-avatar">
        <div className="editorperson-avatar-img" onClick={updateAvatar}>
          <img
            src={avatarUrl || ""}
            alt="avatar"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onAvatarFileChange}
        />
        <div className="editorperson-avatar-upload">点击上传头像</div>
      </div>

      <div className="editorperson-form">
        <Form
          requiredMarkStyle="text-required"
          form={form}
          onFinish={(values) => {
            clickfinish(values);
          }}
          onFinishFailed={(errorInfo) => {
            Toast.show({
              content: errorInfo.errorFields[0].errors[0],
              icon: "fail",
            });
          }}
        >
          <Form.Header>用户信息</Form.Header>
          <Form.Item
            name="nickname"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="bio" label="个人简介">
            <Input placeholder="请输入个人简介" />
          </Form.Item>
          <Form.Item name="createTime" label="创建时间">
            <Input disabled />
          </Form.Item>
        </Form>
      </div>

      <div className="editorperson-button">
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{
            background: "#1677ff",
            borderColor: "#1677ff",
            color: "#fff",
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default EditorPerson;
