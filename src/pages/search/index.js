import "./search.css";
import { useNavigate } from "react-router-dom";
import {
  LeftOutline,
  DownOutline,
  UpOutline,
  DeleteOutline,
  CloseOutline,
} from "antd-mobile-icons";
import { Toast, Dialog } from "antd-mobile";
import { useState } from "react";
import {
  LOCAL_getSearchHistory,
  LOCAL_setSearchHistory,
  LOCAL_clearSearchHistory,
} from "@/utils/localstorage";

const Search = () => {
  const [searchHistory, setSearchHistory] = useState(() => {
    const history = LOCAL_getSearchHistory();
    return Array.isArray(history) ? history : [];
  });
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyword, setKeyword] = useState("");

  //删除搜索历史
  const clearSearchHistory = async () => {
    const confirmed = await Dialog.confirm({
      content: "确认删除所有搜索历史吗？",
      confirmText: <span style={{ color: "red" }}>删除</span>,
      cancelText: "取消",
    });

    if (confirmed) {
      LOCAL_clearSearchHistory();
      setSearchHistory([]);
    }
  };

  //回车搜索
  const entersearch = (e) => {
    if (e.key === "Enter") {
      if (searchHistory.includes(keyword)) {
        searchto(keyword);
        return;
      }
      if (keyword.trim()) {
        navigate(`/searchto/${keyword}`);
        LOCAL_setSearchHistory([keyword, ...searchHistory]);
        setSearchHistory([keyword, ...searchHistory]);
      } else {
        Toast.show({
          content: "请输入搜索内容",
          icon: "fail",
        });
      }
    }
  };

  //搜索按钮
  const search = () => {
    if (keyword.trim()) {
      if (searchHistory.includes(keyword)) {
        searchto(keyword);
        return;
      }
      LOCAL_setSearchHistory([keyword, ...searchHistory]);
      setSearchHistory([keyword, ...searchHistory]);
      navigate(`/searchto/${keyword}`);
    } else {
      Toast.show({
        content: "请输入搜索内容",
        icon: "fail",
      });
    }
  };

  //点击历史搜索记录
  const searchto = (item) => {
    //把item提到数组最前面
    const newSearchHistory = [
      item,
      ...searchHistory.filter((history) => history !== item),
    ];
    setSearchHistory(newSearchHistory);
    LOCAL_setSearchHistory(newSearchHistory);
    navigate(`/searchto/${item}`);
  };

  //删除单个历史搜索记录
  const handleDeleteSearchHistory = (item) => {
    const newSearchHistory = searchHistory.filter(
      (history) => history !== item,
    );
    setSearchHistory(newSearchHistory);
    LOCAL_setSearchHistory(newSearchHistory);
  };

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
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => entersearch(e)}
        />
        <div className="search-header-right" onClick={() => search()}>
          搜索
        </div>
      </div>
      <div className="search-history">
        <div className="search-history-title">
          <div className="search-history-title-left">搜索历史</div>
          <div className="search-history-title-right">
            <div onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "收起" : "展开"}
            </div>
            {isExpanded ? <UpOutline /> : <DownOutline />}
            <div>|</div>
            <DeleteOutline onClick={() => clearSearchHistory()} />
          </div>
        </div>
        <div
          className={`search-history-list ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          {searchHistory.map((item) => (
            <div className="search-history-list-item" key={item}>
              <div onClick={() => searchto(item)}>{item}</div>
              <CloseOutline onClick={() => handleDeleteSearchHistory(item)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
