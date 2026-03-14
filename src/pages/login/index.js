import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Button, Input, Toast } from "antd-mobile";
import { loginApi, getCodeApi, registerApi, forgotPasswordApi } from "@/api";

const Login = () => {
  const navigate = useNavigate();
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
      Toast.show({ content: "请输入正确的邮箱", icon: "fail" });
      return;
    }
    const res = await getCodeApi({ email });
    console.log(res);
    if (res.code === 200) {
      Toast.show({ content: "验证码发送成功", icon: "success" });
      setCode(res.data);
    } else {
      Toast.show({ content: "验证码发送失败", icon: "fail" });
      return;
    }
  };

  const handlebutton = async () => {
    const emailReg = /^[^\s@]+@[^\s@]+$/; // 简单校验：包含 @，前后都要有内容
    if (!emailReg.test(email)) {
      Toast.show({ content: "请输入正确的邮箱", icon: "fail" });
      return;
    }
    const codeReg = /^\d{6}$/; // 6 位数字
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (isLogin) {
      if (!passwordReg.test(password)) {
        Toast.show({
          content: "请输入带大小写字母和数字的8位密码",
          icon: "fail",
        });
        return;
      }
      const res = await loginApi({ email, password });
      console.log(res);
      if (res.code === 200) {
        Toast.show({ content: "登录成功", icon: "success" });
        clearForm();
        // 存储用户信息
        navigate("/");
      } else {
        Toast.show({ content: res.msg || "登录失败", icon: "fail" });
      }
    } else if (isRegister) {
      if (!codeReg.test(code)) {
        Toast.show({ content: "请输入正确的验证码", icon: "fail" });
        return;
      }
      if (!passwordReg.test(password)) {
        Toast.show({ content: "请输入正确的密码", icon: "fail" });
        return;
      }
      const res = await registerApi({ email, code, password });
      console.log(res);
      if (res.code === 200) {
        Toast.show({ content: "注册成功", icon: "success" });
        setMode("login");
      } else {
        Toast.show({ content: res.msg || "注册失败", icon: "fail" });
      }
    } else {
      if (!codeReg.test(code)) {
        Toast.show({ content: "请输入正确的验证码", icon: "fail" });
        return;
      }
      if (!passwordReg.test(password)) {
        Toast.show({ content: "请输入正确格式的密码", icon: "fail" });
        return;
      }
      const res = await forgotPasswordApi({
        email,
        code,
        newPassword: password,
      });
      if (res.code === 200) {
        Toast.show({ content: "找回密码成功", icon: "success" });
        setMode("login");
      } else {
        Toast.show({ content: res.msg || "找回密码失败", icon: "fail" });
      }
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
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-item">
            <label>邮箱</label>
            <Input
              value={email}
              onChange={(val) => setEmail((val || "").trim())}
              placeholder="请输入邮箱"
            />
          </div>
          {usePassword && (
            <div className="form-item">
              <label>密码</label>
              <Input
                type="password"
                value={password}
                onChange={(val) => setPassword((val || "").trim())}
                placeholder="请输入密码"
              />
            </div>
          )}
          {useCode && (
            <>
              <div className="form-item">
                <label>密码</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(val) => setPassword((val || "").trim())}
                  placeholder="请输入新密码"
                />
              </div>
              <div className="form-item">
                <label>验证码</label>
                <div className="code-row">
                  <Input
                    value={code}
                    onChange={(val) => setCode((val || "").trim())}
                    placeholder="请输入验证码"
                  />
                  <Button
                    style={{ width: "100px", height: "40px", fontSize: "14px" }}
                    color="primary"
                    onClick={handleGetCode}
                  >
                    获取验证码
                  </Button>
                </div>
              </div>
            </>
          )}
        </form>
        <div className="login-button">
          <Button
            block
            color="primary"
            className="login-submit-btn"
            onClick={handlebutton}
          >
            {isLogin && "登录"}
            {isRegister && "注册"}
            {isForgot && "找回密码"}
          </Button>
          <div className="login-links">
            {isLogin && (
              <>
                <span className="login-link" onClick={goRegister}>
                  没有账号？去注册
                </span>
                <span className="login-link" onClick={goForgot}>
                  忘记密码？
                </span>
              </>
            )}
            {(isRegister || isForgot) && (
              <span className="login-link" onClick={goLogin}>
                已有账号？去登录
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
