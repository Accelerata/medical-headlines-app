import "./person.css";
//引入文章列表组件
import ArticleList from "@/components/articlelist";

const Person = () => {
  return (
    <div>
      <div className="person-header">
        <div className="person-header-left">
          <img
            className="person-header-left-avatar"
            src="https://picsum.photos/id/68/150/150"
            alt="avatar"
          />
        </div>
        <div className="person-header-right">
          <div className="person-header-right-username">用户名</div>
        </div>
      </div>

      <div className="person-follow">
        <div>0关注</div>
        <div>0粉丝</div>
      </div>

      <div className="person-bio">
        用户简介用户简介用户简介用户简介用户简介用户简介用户简介用户简介用户简介用户简介用户简介
      </div>
      <div className="person-history">观看历史</div>
      <ArticleList />
    </div>
  );
};

export default Person;
