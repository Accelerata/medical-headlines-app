import "./articlelist.css";
import { HeartOutline } from "antd-mobile-icons";
import { useState } from "react";
import {
  getArticleListApi,
  getArticleListByUserIdApi,
  searchArticleApi,
  getArticleListByMineApi,
} from "@/api";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageOutline } from "antd-mobile-icons";
import { formatTime } from "@/utils/utils";

const ArticleList = ({
  articleType,
  activeLabel = "推荐",
  keyword = "",
  userId = "",
}) => {
  const [articleList, setArticleList] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchArticleList() {
      if (articleType === "homepage") {
        const res = await getArticleListApi(page, size, { signal });
        console.log(res);
        let list = res.data;
        if (activeLabel !== "推荐" && activeLabel !== "热门") {
          list = res.data.filter((item) => item.category === activeLabel);
        }
        setArticleList(list);
      } else if (articleType === "person") {
        const res = await getArticleListByMineApi({ signal });
        console.log(res);
        let list = res.data;
        setArticleList(list);
      } else if (articleType === "searchto") {
        const res = await searchArticleApi(keyword, { signal });
        console.log(res);
        let list = res.data;
        setArticleList(list);
      } else if (articleType === "personto") {
        const res = await getArticleListByUserIdApi(userId, { signal });
        console.log(res);
        let list = res.data;
        setArticleList(list);
      }
    }
    fetchArticleList();
    return () => controller.abort();
  }, [activeLabel, page, size, articleType]);

  return (
    <>
      <div>
        {articleList.map((item, index) => {
          return (
            <div key={item.postid} className="article-list">
              <Link className="article-link" to={`/article/${item.postid}`}>
                <div className="article-body">
                  <div className="article-title">{item.title}</div>
                  {item.images && (
                    <img
                      className="article-image"
                      alt={`${item.title}的封面`}
                      src={item.images[0]}
                    ></img>
                  )}
                </div>
                <div className="article-footer">
                  <div className="article-footer-left">
                    <img
                      className="article-footer-left-avatar"
                      alt="作者头像"
                      src={item.authorAvatar}
                    ></img>
                    <div>{item.authorname}</div>
                    <div>{item.date}</div>
                    <div>{formatTime(item.publishTime)}</div>
                  </div>
                  <div className="article-footer-right">
                    <HeartOutline />
                    <div>{item.like_count}</div>
                    <MessageOutline />
                    <div>{item.comment_count}</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/*  */}
    </>
  );
};

export default ArticleList;
