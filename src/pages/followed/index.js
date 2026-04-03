import "react-virtualized/styles.css";
import "./followed.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterOutline, CheckOutline, LeftOutline } from "antd-mobile-icons";
import { useState } from "react";
import { Popup, List, Image, Button } from "antd-mobile";
import { List as VirtualizedList, AutoSizer } from "react-virtualized"; // 引入虚拟列表组件
import {
  getFollowingListApi,
  getFollowersListApi,
  followApi,
  unfollowApi,
} from "@/api";
import { useEffect } from "react";

const SORT_OPTIONS = ["最近关注", "最早关注", "最多粉丝量"];

const Followed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "following";
  const userId = searchParams.get("userId");
  const title = mode === "followers" ? "粉丝" : "关注";
  const [filtermode, setFiltermode] = useState("最近关注");
  const [popupVisible, setPopupVisible] = useState(false);
  const [followList, setFollowList] = useState([]);

  useEffect(() => {
    const fetchFollowList = async () => {
      if (mode === "following") {
        const res = await getFollowingListApi(userId);
        console.log(res);
        const list = Array.isArray(res?.data) ? res.data : [];
        setFollowList(list);
      } else {
        const res = await getFollowersListApi(userId);
        console.log(res);
        const list = Array.isArray(res?.data) ? res.data : [];
        setFollowList(list);
      }
    };
    fetchFollowList();
  }, [userId, mode]);

  useEffect(() => {
    if (filtermode === "最近关注") {
      setFollowList(
        followList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } else if (filtermode === "最早关注") {
      setFollowList(
        followList.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      );
    } else if (filtermode === "最多粉丝量") {
      setFollowList(
        followList.sort((a, b) => b.follower_count - a.follower_count),
      );
    }
  }, [filtermode]);

  // 虚拟列表的行渲染函数
  const rowRenderer = ({ index, key, style }) => {
    const item = followList[index];
    if (!item) return null;

    const isFollowing =
      typeof item.isFollowing === "boolean" ? item.isFollowing : true;

    const toggleFollowing = async () => {
      if (isFollowing) {
        const res = await unfollowApi(item.userid);
        console.log(res);
      } else {
        const res = await followApi(item.userid);
        console.log(res);
      }
      setFollowList((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, isFollowing: !isFollowing } : row,
        ),
      );
    };

    return (
      <div
        key={key}
        className="followed-row"
        style={style}
        onClick={() => navigate(`/personto/${item.userid}`)}
      >
        <Image
          src={item.avatar}
          style={{ borderRadius: 20, flexShrink: 0 }}
          fit="cover"
          width={40}
          height={40}
        />
        <div className="followed-row-main">
          <div className="followed-row-name">{item.nickname}</div>
          {item.bio ? <div className="followed-row-bio">{item.bio}</div> : null}
        </div>
        {mode === "following" ? (
          <div className="followed-row-end">
            {isFollowing ? (
              <Button
                className="followed-row-end-isFollowed-button"
                onClick={toggleFollowing}
              >
                已关注
              </Button>
            ) : (
              <Button
                className="followed-row-end-notFollowed-button"
                onClick={toggleFollowing}
              >
                关注
              </Button>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="followed-page">
      <div className="followed-header">
        <div
          className="followed-header-left"
          onClick={() => navigate("/person")}
        >
          <LeftOutline />
        </div>
        <div className="followed-header-title">
          <span>{title}</span>
        </div>
      </div>
      {mode === "following" ? (
        <div className="followed-filter" onClick={() => setPopupVisible(true)}>
          <FilterOutline />
          <span>{filtermode}</span>
        </div>
      ) : null}
      {/* 列表主体部分 */}
      <div className="followed-body" data-user-id={userId || undefined}>
        {followList.length > 0 ? (
          <div className="followed-virtual-list-host">
            <AutoSizer>
              {({ width, height }) => (
                <VirtualizedList
                  rowCount={followList.length}
                  rowRenderer={rowRenderer}
                  width={width}
                  height={height}
                  rowHeight={72}
                  overscanRowCount={8}
                />
              )}
            </AutoSizer>
          </div>
        ) : (
          <div className="followed-empty-state">暂无数据</div>
        )}
      </div>
      <Popup
        visible={popupVisible}
        showCloseButton
        onMaskClick={() => {
          setPopupVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "20vh",
        }}
        className="followed-popup"
        onClose={() => {
          setPopupVisible(false);
        }}
      >
        <List header="选择排序" className="filter-sort-list">
          {SORT_OPTIONS.map((label) => {
            const selected = filtermode === label;
            return (
              <List.Item
                key={label}
                arrow={false}
                className={
                  selected
                    ? "filter-sort-item filter-sort-item--selected"
                    : "filter-sort-item"
                }
                onClick={() => {
                  setFiltermode(label);
                  setPopupVisible(false);
                }}
              >
                <div className="filter-content">
                  <div>{label}</div>
                  <div>{selected ? <CheckOutline /> : null}</div>
                </div>
              </List.Item>
            );
          })}
        </List>
      </Popup>
    </div>
  );
};

export default Followed;
