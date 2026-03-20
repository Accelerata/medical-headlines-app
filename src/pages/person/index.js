import "./person.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserInfoApi } from "@/api";
//引入文章列表组件
import ArticleList from "@/components/articlelist";

const Person = () => {
  const [userInfo, setUserInfo] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");
  useEffect(() => {
    getUserInfoApi().then((res) => {
      console.log(res);
      setUserInfo(res.data);
      setAvatarUrl(res.data.avatar);
    });
  }, []);

  return (
    <div>
      <div className="person-header">
        <div className="person-header-left">
          <img
            className="person-header-left-avatar"
            src={avatarUrl}
            alt="avatar"
          />
        </div>
        <div className="person-header-right">
          <div className="person-header-right-username">
            {userInfo.nickname}
          </div>
          <Link to="/editorperson">
            <div className="person-header-right-button">编辑资料</div>
          </Link>
        </div>
      </div>

      <div className="person-follow">
        <div>0关注</div>
        <div>0粉丝</div>
      </div>

      <div className="person-bio">{userInfo.bio}</div>
      <div className="person-history">观看历史</div>
      <ArticleList activeLabel="推荐" />
    </div>
  );
};

export default Person;
