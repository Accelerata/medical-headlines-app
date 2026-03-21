import { useParams } from "react-router-dom";
import { LeftOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import "./searchto.css";
import { useState } from "react";
import ArticleList from "@/components/articlelist";
const SearchTo = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [searchword, setsearchword] = useState("");
  return (
    <div className="searchto-page">
      {/* 只固定顶栏；列表放在外面，才能参与 layout-content 的 overflow 滚动 */}
      <div className="searchto-header-container">
        <div className="searchto-header">
          <LeftOutline onClick={() => navigate(-1)} />
          <input
            className="searchto-search"
            type="text"
            placeholder={keyword || "请输入搜索内容"}
            value={searchword}
            onChange={(e) => setsearchword(e.target.value)}
          />
          <div
            className="searchto-header-right"
            onClick={() => navigate(`/searchto/${searchword}`)}
          >
            搜索
          </div>
        </div>
      </div>
      <div className="searchto-content">
        <ArticleList activeLabel="推荐" />
      </div>
    </div>
  );
};

export default SearchTo;
