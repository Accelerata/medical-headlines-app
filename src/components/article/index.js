import { getArticleDetailApi } from "@/api";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  LeftOutline,
  LinkOutline,
  MessageOutline,
  HeartOutline,
} from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd-mobile";
import "./article.css";
const Article = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();
  const [showTopAvatar, setShowTopAvatar] = useState(false);
  const bigAvatarRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await getArticleDetailApi(id);
      console.log(res);
      setArticle(res.data);
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!bigAvatarRef.current) {
        return;
      }
      const { top } = bigAvatarRef.current.getBoundingClientRect();
      if (top <= 40) {
        setShowTopAvatar(true);
      } else {
        setShowTopAvatar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formatTime = (time) => {
    const targetTime = new Date(time);
    const now = new Date();

    const diffMs = now - targetTime;

    if (diffMs <= 0) {
      return "刚刚";
    }
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMouths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    if (diffMins < 5) {
      return "刚刚";
    } else if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 30) {
      return `${diffDays}天前`;
    } else if (diffMouths < 12) {
      return `${diffMouths}个月前`;
    } else {
      const year = targetTime.getFullYear();
      const mouth = String(targetTime.getMonth() + 1).padStart(2, "0");
      const day = String(targetTime.getDate()).padStart(2, "0");
      return `${year}-${mouth}-${day}`;
    }
  };
  return (
    <div className="article-page">
      <div className="article-header-container">
        <div className="article-header">
          <LeftOutline onClick={() => navigate(-1)} />
          {showTopAvatar && (
            <img
              className="article-top-avatar"
              src={article?.authorAvatar}
              alt="作者头像"
            />
          )}
          <input
            className="article-search"
            type="text"
            placeholder={article?.title || "请输入搜索内容"}
            onClick={() => navigate(`/search`)}
          />
        </div>
      </div>

      <div className="article-authorinfo">
        <div className="article-authorinfo-left">
          <img
            className="article-authorinfo-left-avatar"
            ref={bigAvatarRef}
            src={article?.authorAvatar}
            alt="作者头像"
          />
          <div className="article-authorinfo-left-info">
            <div className="article-authorinfo-left-info-name">
              {article?.authorname}
            </div>
            <div className="article-authorinfo-left-info-time">
              {formatTime(article?.updatedAt || article?.createdAt)}
            </div>
          </div>
        </div>

        <div className="article-authorinfo-right">
          <Button className="article-authorinfo-right-button" type="primary">
            关注
          </Button>
        </div>
      </div>

      <div className="article-content">
        <div className="article-content-title">{article?.title}</div>
        <div className="article-content-content">
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          {article?.content}
          hhhhhhhhh
        </div>
        <div className="article-content-footer">
          <div>
            <LinkOutline />
            分享
          </div>
          <div>
            <MessageOutline />
            {article?.commentCount}
          </div>
          <div>
            <HeartOutline />
            {article?.likeCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
