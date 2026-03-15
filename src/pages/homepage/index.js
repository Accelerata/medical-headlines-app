import { SearchBar } from "antd-mobile";
import { UserCircleOutline } from "antd-mobile-icons";
import "./homepage.css";
import ArticleList from "@/components/articlelist";

const labels = [
  "推荐",
  "热门",
  "产业",
  "药企",
  "前沿",
  "科研",
  "临床",
  "科普",
  "辟谣",
  "养生",
  "营养",
  "心理",
  "急救",
  "康复",
  "中医",
  "器械",
];
const Homepage = () => {
  return (
    <>
      <div className="homepage-header">
        <SearchBar placeholder="请输入内容" className="home-search" />
        <div className="AI-block">
          <UserCircleOutline className="AI-icon" />
          <span className="AI-text">AI助手</span>
        </div>
      </div>

      <div className="homepage-label">
        {labels.map((item, index) => {
          return (
            <span key={index} className="homepage-label-text">
              {item}
            </span>
          );
        })}
      </div>

      <ArticleList />
    </>
  );
};

export default Homepage;
