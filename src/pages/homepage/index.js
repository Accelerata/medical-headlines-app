import { UserCircleOutline } from "antd-mobile-icons";
import "./homepage.css";
import ArticleList from "@/components/articlelist";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const navigate = useNavigate();
  const [activeLabel, setActiveLabel] = useState("推荐");
  return (
    <div className="homepage-wrap">
      <div className="homepage-fixed">
        <div className="homepage-header">
          <input
            type="text"
            placeholder="请输入内容"
            className="home-search"
            onClick={() => navigate("/search")}
          />
          <div className="AI-block">
            <UserCircleOutline className="AI-icon" />
            <span className="AI-text">AI助手</span>
          </div>
        </div>

        <div className="homepage-label">
          {labels.map((item, index) => {
            return (
              <span
                key={index}
                className={
                  item === activeLabel
                    ? "homepage-label-text homepage-label-text--active"
                    : "homepage-label-text"
                }
                onClick={() => {
                  setActiveLabel(item);
                  // console.log(activeLabel);
                }}
                role="button"
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      <div className="homepage-content">
        <ArticleList articleType="homepage" activeLabel={activeLabel} />
      </div>
    </div>
  );
};

export default Homepage;
