import "react-virtualized/styles.css";
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
import { List as VirtualizedList, AutoSizer } from "react-virtualized";

const ArticleList = ({
  articleType,
  activeLabel = "推荐",
  keyword = "",
  userId = "",
}) => {
  const [articleList, setArticleList] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const safeToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [];
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchArticleList() {
      setLoading(true);

      if (articleType === "homepage") {
        const res = await getArticleListApi(page, size, { signal });
        // console.log(res);
        let list = safeToArray(res?.data);
        if (activeLabel !== "推荐" && activeLabel !== "热门") {
          list = list.filter((item) => item.category === activeLabel);
        }
        setArticleList((prev) => (page === 1 ? list : [...prev, ...list]));
        setHasMore(list.length >= size);
      } else if (articleType === "person") {
        const res = await getArticleListByMineApi(page, size, { signal });
        console.log(res);
        const list = safeToArray(res?.data);
        setArticleList((prev) => (page === 1 ? list : [...prev, ...list]));
        setHasMore(list.length >= size);
      } else if (articleType === "searchto") {
        const res = await searchArticleApi(keyword, page, size, { signal });
        console.log(res);
        const list = safeToArray(res?.data);
        setArticleList((prev) => (page === 1 ? list : [...prev, ...list]));
        setHasMore(list.length >= size);
      } else if (articleType === "personto") {
        const res = await getArticleListByUserIdApi(userId, page, size, {
          signal,
        });
        console.log(res);
        const list = safeToArray(res?.data);
        setArticleList((prev) => (page === 1 ? list : [...prev, ...list]));
        setHasMore(list.length >= size);
      }

      setLoading(false);
    }
    fetchArticleList();
    return () => controller.abort();
  }, [activeLabel, page, size, articleType, userId, keyword]);

  // 当筛选条件或文章来源变化时，重置列表与分页
  useEffect(() => {
    setArticleList([]);
    setPage(1);
    setHasMore(true);
  }, [articleType, activeLabel, keyword, userId]);

  // 虚拟列表行渲染函数
  const rowRenderer = ({ index, key, style }) => {
    const item = articleList[index];
    if (!item) return null;

    return (
      <div key={key} style={style}>
        <div className="article-list">
          <Link className="article-link" to={`/article/${item.postid}`}>
            <div className="article-body">
              <div className="article-title">{item.title}</div>
              {item.images && item.images.length > 0 && (
                <img
                  className="article-image"
                  alt={`${item.title}的封面`}
                  src={item.images[0]}
                />
              )}
            </div>
            <div className="article-footer">
              <div className="article-footer-left">
                <img
                  className="article-footer-left-avatar"
                  alt="作者头像"
                  src={item.authorAvatar}
                />
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
      </div>
    );
  };

  const handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const nearBottom = scrollHeight - scrollTop - clientHeight < 200;
    if (nearBottom && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="articlelist-virtual-host">
        {articleList.length > 0 ? (
          <AutoSizer>
            {({ width, height }) => (
              <VirtualizedList
                width={width}
                height={height}
                rowCount={articleList.length}
                rowHeight={130}
                rowRenderer={rowRenderer}
                overscanRowCount={8}
                onScroll={handleScroll}
              />
            )}
          </AutoSizer>
        ) : (
          <div className="articlelist-empty">暂无数据</div>
        )}
      </div>

      {/*  */}
    </>
  );
};

export default ArticleList;
