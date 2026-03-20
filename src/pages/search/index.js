import "./search.css";
import { useNavigate } from "react-router-dom";
import {
  LeftOutline,
  DownOutline,
  UpOutline,
  DeleteOutline,
} from "antd-mobile-icons";
import { useState } from "react";

// 模拟搜索历史数据
const initialData = [
  "刘文祥涉事门店被查",
  "惠州33所幼儿园停办",
  "李殿勋调研抓创业促李殿勋调研抓创业促",
  "油价暴涨或引发新一李殿勋调研抓创业促",
  "董明珠被拍到乘坐极李殿勋调研抓创业促",
  "今年会超级热吗",
  "永辉喊话山姆",
  "郑建新涉嫌受贿被公诉",
  "个人贷款有新规定",
  "央视财经",
  "央视财经",
  "央视财经",
  "央视财经",
];

const Search = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="search">
      <div className="search-header">
        <div className="search-header-left" onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <input
          type="text"
          placeholder="请输入搜索内容"
          className="search-input"
        />
        <div className="search-header-right">搜索</div>
      </div>
      <div className="search-history">
        <div className="search-history-title">
          <div className="search-history-title-left">搜索历史</div>
          <div
            className="search-history-title-right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div>{isExpanded ? "收起" : "展开"}</div>
            {isExpanded ? <UpOutline /> : <DownOutline />}
            <div>|</div>
            <DeleteOutline />
          </div>
        </div>
        <div
          className={`search-history-list ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          {initialData.map((item) => (
            <div className="search-history-list-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
