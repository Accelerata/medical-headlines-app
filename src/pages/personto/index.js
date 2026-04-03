import "./personto.css";
import { Button } from "antd-mobile";
import { LeftOutline } from "antd-mobile-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfoByIdApi,
  getUserLikesTotalApi,
  followApi,
  unfollowApi,
  isFollowedApi,
} from "@/api";
import ArticleList from "@/components/articlelist";
import { useParams } from "react-router-dom";

const Personto = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [likesTotal, setLikesTotal] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserInfoByIdApi(userId);
      console.log(res);
      if (res.code === 200) {
        setUserInfo(res.data);
      }
    };
    getUserInfo();
  }, [userId]);

  useEffect(() => {
    const getIsFollowed = async () => {
      const res = await isFollowedApi(userId);
      console.log(res);
      if (res.code === 200) {
        setIsFollowed(res.data.followed);
      }
    };
    getIsFollowed();
  }, [userId]);

  useEffect(() => {
    const userid = userInfo?.userid;
    if (!userid) return;

    const getUserLikesTotal = async () => {
      const res = await getUserLikesTotalApi(userid);
      console.log(res);
      if (res.code === 200) {
        setLikesTotal(res.data.total_like_count);
      }
    };

    getUserLikesTotal();
  }, [userInfo.userid]);

  const handleFollow = async () => {
    if (isFollowed) {
      await unfollowApi(userId);
      setIsFollowed(false);
    } else {
      await followApi(userId);
      setIsFollowed(true);
    }
  };
  //   const onBackgroundFileChange = async (e) => {
  //     const file = e.target.files?.[0];
  //     e.target.value = "";
  //     if (!file) return;
  //     isUploadingBackgroundRef.current = true;

  //     try {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       const res = await updateUserBackgroundApi(formData);
  //       if (res.code === 200) {
  //         Toast.show({ content: "更新背景图成功", icon: "success" });
  //         setUserInfo({ ...userInfo, user_bcg: res.data });
  //       } else {
  //         Toast.show({ content: "更新背景图失败", icon: "fail" });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       isUploadingBackgroundRef.current = false;
  //     }
  //   };
  return (
    <div className="person-page">
      <div
        className="person-header"
        style={{
          backgroundColor: "#f0f0f0",
          backgroundImage: `url(${userInfo.user_bcg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="person-header-back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutline />
        </div>
        <div className="person-header-name">{userInfo.nickname}</div>
        <div className="person-header-avatar">
          <img
            src={userInfo.avatar}
            alt="avatar"
            className="person-header-avatar-img"
          />
        </div>
      </div>
      <div className="person-content">
        <div className="person-content-header">
          <div
            className="person-content-header-item"
            onClick={() => {
              navigate(`/followed?mode=following&userId=${userInfo.userid}`);
            }}
          >
            <span className="person-content-header-item-number">
              {userInfo.followingCount}
            </span>
            <span className="person-content-header-item-text">关注</span>
          </div>
          <div
            className="person-content-header-item"
            onClick={() => {
              navigate(`/followed?mode=followers&userId=${userInfo.userid}`);
            }}
          >
            <span className="person-content-header-item-number">
              {userInfo.followerCount}
            </span>
            <span className="person-content-header-item-text">粉丝</span>
          </div>

          <div className="person-content-header-item">
            <span className="person-content-header-item-number">
              {likesTotal}
            </span>
            <span className="person-content-header-item-text">获赞</span>
          </div>

          <div
            className="person-content-header-item"
            onClick={() => {
              navigate(`/editorperson`);
            }}
            style={{ marginLeft: "auto" }}
          ></div>
        </div>
        <div className="person-content-bio">{userInfo.bio}</div>
        <div className="person-content-buttons">
          <Button
            type="primary"
            className={
              isFollowed
                ? "person-content-buttons-button-followed"
                : "person-content-buttons-button-unfollowed"
            }
            onClick={() => {
              handleFollow();
            }}
          >
            {isFollowed ? "已关注" : "关注"}
          </Button>
        </div>
      </div>
      <ArticleList articleType="personto" userId={userId} />
    </div>
  );
};

export default Personto;
