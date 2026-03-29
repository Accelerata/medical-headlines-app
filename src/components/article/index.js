import { getArticleDetailApi } from "@/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import {
  LeftOutline,
  LinkOutline,
  MessageOutline,
  HeartOutline,
  HeartFill,
} from "antd-mobile-icons";
import { Popup, TextArea, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "antd-mobile";
import "./article.css";
import {
  isLikedArticleApi,
  likeArticleApi,
  unlikeArticleApi,
  getCommentListApi,
  publishCommentApi,
  likeCommentApi,
  unlikeCommentApi,
  getReplyCommentListApi,
  publishReplyCommentApi,
  likeReplyCommentApi,
  unlikeReplyCommentApi,
  isFollowedApi,
  followApi,
  unfollowApi,
} from "@/api";
import { LOCAL_getUserInfo } from "@/utils/localstorage";

const getCurrentUserId = () => {
  const raw = LOCAL_getUserInfo();
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    return u?.id ?? u?.userId ?? u?.user_id ?? null;
  } catch {
    return null;
  }
};

const Article = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();
  const [showTopAvatar, setShowTopAvatar] = useState(false);
  const bigAvatarRef = useRef(false);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [commentshow, setCommentshow] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [keyboardshow, setKeyboardshow] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const commentInputWrapRef = useRef(null);
  const [replypopupshow, setReplypopupshow] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [mode, setMode] = useState(null);
  const [replyCommentList, setReplyCommentList] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const refreshCommentList = useCallback(async () => {
    const commentListres = await getCommentListApi(id);
    console.log(commentListres);
    if (commentListres?.code === 200) {
      setCommentList(commentListres.data || []);
    }
  }, [id]);

  const refreshReplyCommentList = useCallback(async () => {
    if (!currentComment) {
      return;
    }
    const replyCommentListres = await getReplyCommentListApi(
      currentComment.commentId,
    );
    console.log(replyCommentListres);
    if (replyCommentListres?.code === 200) {
      setReplyCommentList(replyCommentListres.data || []);
    }
  }, [currentComment]);

  //查询文章详情
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await getArticleDetailApi(id);
      console.log(res);
      setArticle(res.data);
      await refreshCommentList();
    };
    fetchArticle();
  }, [id, refreshCommentList]);

  // 文章加载完成后再查是否关注作者；后端多为 authorId，需兼容 authorid
  const authorIdForFollow =
    article?.authorId ?? article?.authorid ?? article?.author_id;

  useEffect(() => {
    if (authorIdForFollow == null || authorIdForFollow === "") return;

    const fetchIsFollowed = async () => {
      const res = await isFollowedApi(authorIdForFollow);
      console.log(res);
      if (res?.data?.followed) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    };
    fetchIsFollowed();
  }, [authorIdForFollow]);

  //滚动显示顶部头像
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

  //查询用户是否点赞
  useEffect(() => {
    const fetchIsLiked = async () => {
      const res = await isLikedArticleApi(id);
      console.log(res);
      if (res.data.liked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };

    fetchIsLiked();
  }, [id]);

  const openCommentInput = () => {
    flushSync(() => {
      setKeyboardshow(true);
    });
    const textarea = commentInputWrapRef.current?.querySelector("textarea");
    textarea?.focus();
  };

  //格式化时间
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

  //文章点赞
  const handleLike = async () => {
    const nextLiked = !isLiked;
    if (isLiked) {
      await unlikeArticleApi(id);
    } else {
      await likeArticleApi(id);
    }
    setIsLiked(nextLiked);
    setArticle((prev) => {
      if (!prev) return prev;
      const currentLikeCount = Number(prev.likeCount) || 0;
      return {
        ...prev,
        likeCount: nextLiked
          ? currentLikeCount + 1
          : Math.max(currentLikeCount - 1, 0),
      };
    });
  };

  //发表评论
  const sendComment = async () => {
    if (!commentValue.trim()) {
      Toast.show({
        content: "请输入评论内容",
        icon: "fail",
      });
      return;
    }
    const res = await publishCommentApi(id, { content: commentValue });
    console.log(res);
    if (!res || res.code !== 200) return;

    Toast.show({ content: "评论成功", icon: "success" });
    setCommentValue("");
    setKeyboardshow(false);
    await refreshCommentList();
    setArticle((prev) => {
      if (!prev) return prev;
      const currentCount = Number(prev.commentCount) || 0;
      return { ...prev, commentCount: currentCount + 1 };
    });
  };

  // 发布回复评论
  const sendReplyComment = async () => {
    if (!commentValue.trim()) {
      Toast.show({
        content: "请输入回复内容",
        icon: "fail",
      });
      return;
    }
    if (!currentComment) {
      return;
    }
    const res = await publishReplyCommentApi(currentComment.commentId, {
      content: commentValue,
    });
    if (res.code !== 200) {
      Toast.show({
        content: "发布回复评论失败",
        icon: "fail",
      });
      return;
    }
    Toast.show({ content: "发布回复评论成功", icon: "success" });
    setCommentValue("");
    setKeyboardshow(false);
    await refreshCommentList();
    await refreshReplyCommentList();
  };

  //评论点赞与取消点赞
  const handleCommentLike = async (commentId, isLiked) => {
    if (isLiked) {
      await unlikeCommentApi(commentId);
    } else {
      await likeCommentApi(commentId);
    }
    await refreshCommentList();
  };

  const toggleReplyPopup = async (comment) => {
    const res = await getReplyCommentListApi(comment.commentId);
    console.log(res);

    if (res.code === 200) {
      setReplypopupshow(true);
      setCurrentComment(comment);
      setMode("reply");
      setReplyCommentList(res.data);
    }
  };

  //回复评论点赞与取消点赞
  const handleReplyCommentLike = async (replyId, isLiked) => {
    if (isLiked) {
      await unlikeReplyCommentApi(replyId);
    } else {
      await likeReplyCommentApi(replyId);
    }
    await refreshReplyCommentList();
  };

  //关注与取消关注
  const handleFollow = async () => {
    if (authorIdForFollow == null || authorIdForFollow === "") {
      Toast.show({ content: "无法获取作者信息", icon: "fail" });
      return;
    }
    const nextIsFollowed = !isFollowed;
    if (!isFollowed) {
      const me = getCurrentUserId();
      if (me != null && String(me) === String(authorIdForFollow)) {
        Toast.show({ content: "不能关注自己", icon: "fail" });
        return;
      }
    }
    const res = nextIsFollowed
      ? await followApi(authorIdForFollow)
      : await unfollowApi(authorIdForFollow);
    if (!res || res.code !== 200) {
      return;
    }
    setIsFollowed(nextIsFollowed);
    Toast.show({
      content: nextIsFollowed ? "关注成功" : "取消关注成功",
      icon: "success",
    });
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
          <Button
            className="article-authorinfo-right-button"
            type="primary"
            onClick={handleFollow}
          >
            {isFollowed ? "已关注" : "关注"}
          </Button>
        </div>
      </div>

      <div className="article-content">
        <div className="article-content-title">{article?.title}</div>
        <div
          className="article-content-content"
          dangerouslySetInnerHTML={{ __html: article?.content || "" }}
        />
        <div className="article-content-footer">
          <div>
            <LinkOutline />
            分享
          </div>
          <div>
            <MessageOutline
              onClick={() => {
                setCommentshow(true);
                setMode("comment");
              }}
            />
            <Popup
              visible={commentshow}
              showCloseButton
              onMaskClick={() => {
                setCommentshow(false);
                setKeyboardshow(false);
              }}
              onClose={() => {
                setCommentshow(false);
                setKeyboardshow(false);
              }}
              bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div className="comment-list-popup-root">
                <div className="comment-list-title">评论</div>

                <div className="comment-list-body">
                  {commentList.length === 0 ? (
                    <div className="comment-list-empty">
                      暂无评论,快来抢占沙发
                    </div>
                  ) : (
                    commentList.map((item) => (
                      <div key={item.commentId}>
                        <div className="comment-list-body-item">
                          <img
                            alt="评论者头像"
                            src={article?.authorAvatar}
                            className="comment-list-body-item-left"
                          ></img>
                          <div className="comment-list-body-item-right">
                            <div className="comment-list-body-item-right-header">
                              <div>{item.nickname}</div>
                              <div>{formatTime(item.createdAt)}</div>
                            </div>
                            <div className="comment-list-body-item-right-content">
                              {item.content}
                            </div>
                            <div className="comment-list-body-item-right-footer">
                              <Button
                                className="comment-list-body-item-right-footer-button"
                                onClick={() => toggleReplyPopup(item)}
                              >
                                {item.replyCount === 0
                                  ? "回复"
                                  : `${item.replyCount}条回复`}
                              </Button>
                              <div
                                onClick={() =>
                                  handleCommentLike(
                                    item.commentId,
                                    item.isLiked,
                                  )
                                }
                              >
                                {item.isLiked ? (
                                  <HeartFill style={{ color: "red" }} />
                                ) : (
                                  <HeartOutline />
                                )}
                                {item.likeCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="comment-list-footer">
                  <div
                    className="comment-list-footer-text"
                    onClick={() => {
                      setKeyboardshow(true);
                      openCommentInput();
                    }}
                  >
                    掐指一算，今日宜发评...
                  </div>
                </div>
              </div>
            </Popup>

            <Popup
              visible={replypopupshow}
              showCloseButton
              onMaskClick={() => {
                setReplypopupshow(false);
                setMode("comment");
              }}
              onClose={() => {
                setReplypopupshow(false);
                setMode("comment");
              }}
              bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div className="comment-list-popup-root">
                <div className="comment-list-title">回复</div>
                <div className="comment-list-body">
                  {currentComment ? (
                    <div key={currentComment.commentId}>
                      <div className="comment-list-body-item">
                        <img
                          alt="评论者头像"
                          src={article?.authorAvatar}
                          className="comment-list-body-item-left"
                        ></img>
                        <div className="comment-list-body-item-right">
                          <div className="comment-list-body-item-right-header">
                            <div>{currentComment.nickname}</div>
                            <div>{formatTime(currentComment.createdAt)}</div>
                          </div>
                          <div className="comment-list-body-item-right-content">
                            {currentComment.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="comment-list-body-all">全部回复</div>
                  <div className="comment-list-body-all-list">
                    {replyCommentList.length === 0 ? (
                      <div className="comment-list-empty">
                        暂无回复,快来抢占沙发
                      </div>
                    ) : (
                      replyCommentList.map((item) => (
                        <div key={item.commentId}>
                          <div className="comment-list-body-item">
                            <img
                              alt="评论者头像"
                              src={article?.authorAvatar}
                              className="comment-list-body-item-left"
                            ></img>
                            <div className="comment-list-body-item-right">
                              <div className="comment-list-body-item-right-header">
                                <div>{item.nickname}</div>
                                <div>{formatTime(item.createdAt)}</div>
                              </div>
                              <div className="comment-list-body-item-right-content">
                                {item.content}
                              </div>
                              <div className="comment-list-body-item-right-footer">
                                <div
                                  onClick={() =>
                                    handleReplyCommentLike(
                                      item.replyId,
                                      item.isLiked,
                                    )
                                  }
                                >
                                  {item.isLiked ? (
                                    <HeartFill style={{ color: "red" }} />
                                  ) : (
                                    <HeartOutline />
                                  )}
                                  {item.likeCount}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="comment-list-footer">
                  <div
                    className="comment-list-footer-text"
                    onClick={() => {
                      setKeyboardshow(true);
                      openCommentInput();
                    }}
                  >
                    掐指一算，今日宜发评...
                  </div>
                </div>
              </div>
            </Popup>

            <Popup
              visible={keyboardshow}
              onMaskClick={() => {
                setKeyboardshow(false);
              }}
              bodyStyle={{ height: "80px" }}
            >
              <div className="comment-list-footer2" ref={commentInputWrapRef}>
                <TextArea
                  placeholder="掐指一算，今日宜发评..."
                  onChange={(val) => {
                    setCommentValue(val);
                  }}
                  value={commentValue}
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  autoFocus // 弹窗时自动拉起键盘
                  className="comment-list-footer2-input"
                />
                <Button
                  className="comment-list-footer2-button"
                  type="primary"
                  onClick={() => {
                    if (mode === "comment") {
                      sendComment();
                    } else if (mode === "reply") {
                      sendReplyComment();
                    }
                  }}
                >
                  发送
                </Button>
              </div>
            </Popup>

            {article?.commentCount}
          </div>
          <div onClick={handleLike}>
            {isLiked ? (
              <HeartFill style={{ color: "red" }} />
            ) : (
              <HeartOutline />
            )}
            {article?.likeCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
