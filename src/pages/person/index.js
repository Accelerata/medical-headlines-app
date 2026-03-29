import "./person.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserInfoApi } from "@/api";
import { useNavigate } from "react-router-dom";
//引入文章列表组件
import ArticleList from "@/components/articlelist";

const Person = () => {
  const [userInfo, setUserInfo] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();

  const goFollowPage = (mode) => {
    const userId = userInfo.userid;
    const params = new URLSearchParams({ mode });
    if (userId != null && userId !== "") {
      params.set("userId", String(userId));
    }
    navigate(`/followed?${params.toString()}`);
  };

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
        <div onClick={() => goFollowPage("following")}>
          {userInfo.followingCount}关注
        </div>
        <div onClick={() => goFollowPage("followers")}>
          {userInfo.followerCount}粉丝
        </div>
      </div>

      <div className="person-bio">{userInfo.bio}</div>
      <div className="person-history">观看历史</div>
      <ArticleList activeLabel="推荐" />
    </div>
  );
};

export default Person;
