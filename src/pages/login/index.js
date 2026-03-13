import React, { useState } from "react";
import "./login.css";
import { Button, Form, Input, message } from "antd";
import { loginApi, getCodeApi, registerApi } from "@/api";

const Login = () => {
  // mode: 'login' 密码登录 | 'register' 验证码注册 | 'forgot' 忘记密码
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const usePassword = isLogin;
  const useCode = isRegister || isForgot;

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setCode("");
  };

  const goRegister = () => {
    clearForm();
    setMode("register");
  };
  const goLogin = () => {
    clearForm();
    setMode("login");
  };
  const goForgot = () => {
    clearForm();
    setMode("forgot");
  };

  const handleGetCode = async () => {
    const emailReg = /^[^\s@]+@[^\s@]+$/; // 简单校验：包含 @，前后都要有内容
    if (!emailReg.test(email)) {
      message.error("请输入正确的邮箱");
      return;
    }
    const res = await getCodeApi({ email });
    if (res.code === 200) {
      message.success("验证码发送成功");
      setCode(res.data);
    } else {
      message.error("验证码发送失败");
      return;
    }
  };

  const handlebutton = async () => {
    const emailReg = /^[^\s@]+@[^\s@]+$/; // 简单校验：包含 @，前后都要有内容
    if (!emailReg.test(email)) {
      message.error("请输入正确的邮箱");
      return;
    }
    const codeReg = /^\d{6}$/; // 6 位数字
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (isLogin) {
      if (!passwordReg.test(password)) {
        message.error("请输入正确的密码");
        return;
      }
      const res = await loginApi({ email, password });
      if (res.code === 200) {
        message.success("登录成功");
      }
    } else if (isRegister) {
      if (!codeReg.test(code)) {
        message.error("请输入正确的验证码");
        return;
      }
      if (!passwordReg.test(password)) {
        message.error("请输入正确的密码");
        return;
      }
      const res = await registerApi({ email, code, password });
      if (res.code === 200) {
        message.success("注册成功");
      } else {
        message.error(res.message);
      }
    } else {
      // 忘记密码：验证码校验通过后的逻辑（如跳转设置新密码页），此处可后续对接找回密码接口
      if (!codeReg.test(code)) {
        message.error("请输入正确的验证码");
        return;
      }
      message.info("验证码校验通过，找回密码接口待对接");
    }
  };

  return (
    <div>
      <div className="login-header">
        {isLogin && "登录你的头条 精彩永不丢失"}
        {isRegister && "注册你的头条 开启精彩世界"}
        {isForgot && "找回密码"}
      </div>
      <div className="login-content">
        <Form className="login-form">
          <Form.Item name="username" label="邮箱">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </Form.Item>
          {usePassword && (
            <Form.Item name="password" label="密码">
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                placeholder="请输入密码"
              />
            </Form.Item>
          )}
          {useCode && (
            <div>
              <Form.Item name="password" label="密码">
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  placeholder="请输入新密码"
                />
              </Form.Item>
              <Form.Item name="code" label="验证码">
                <div className="code-row">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                    placeholder="请输入验证码"
                  />
                  <Button type="primary" onClick={handleGetCode}>
                    获取验证码
                  </Button>
                </div>
              </Form.Item>
            </div>
          )}
        </Form>
        <div className="login-button">
          <Button type="primary" htmlType="submit" onClick={handlebutton}>
            {isLogin && "登录"}
            {isRegister && "注册"}
            {isForgot && "找回密码"}
          </Button>
          <div className="login-links">
            {isLogin && (
              <>
                <Button type="link" onClick={goRegister}>
                  没有账号？去注册
                </Button>
                <Button type="link" onClick={goForgot}>
                  忘记密码？
                </Button>
              </>
            )}
            {(isRegister || isForgot) && (
              <Button type="link" onClick={goLogin}>
                已有账号？去登录
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
