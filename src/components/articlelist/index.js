import "./articlelist.css";
import { HeartOutline } from "antd-mobile-icons";
import { useState } from "react";
import { getArticleListApi } from "@/api";
import { useEffect } from "react";

// const articlelist = [
//   {
//     title: "科技前沿：AI的未来",
//     content:
//       "探索未来人工智能的发展趋势与潜在应用场景，了解AI如何改变我们的生活方式。",
//     authorname: "张三",
//     date: "2026-03-10 09:15",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 100,
//   },
//   {
//     title: "健康饮食指南",
//     content: "每日营养搭配指南，教你如何在忙碌的工作中保持均衡的饮食习惯。",
//     authorname: "李四",
//     date: "2026-03-11 14:30",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 101,
//   },
//   {
//     title: "探索阿尔卑斯",
//     content: "记录在阿尔卑斯山的难忘时光，分享徒步路线与沿途绝美的自然风光。",
//     authorname: "王五",
//     date: "2026-03-12 10:45",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 102,
//   },
//   {
//     title: "JavaScript高级技巧",
//     content:
//       "深入解析闭包原理与异步编程，帮助前端开发者提升代码质量与执行效率。",
//     authorname: "赵六",
//     date: "2026-03-13 16:20",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 103,
//   },
//   {
//     title: "寻找内心的宁静",
//     content: "分享如何在喧嚣的现代都市生活中，通过冥想和阅读寻找片刻的宁静。",
//     authorname: "陈七",
//     date: "2026-03-14 08:00",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 104,
//   },
//   {
//     title: "风光摄影入门",
//     content: "新手必看的风光摄影入门指南，从构图到光线运用，教你拍出大片感。",
//     authorname: "刘八",
//     date: "2026-03-15 11:30",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 105,
//   },
//   {
//     title: "古埃及未解之谜",
//     content: "揭开古埃及金字塔的神秘面纱，探讨古代文明的建筑奇迹与历史背景。",
//     authorname: "周九",
//     date: "2026-03-16 19:45",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 106,
//   },
//   {
//     title: "克服职场焦虑",
//     content:
//       "实用放松技巧分享，帮助职场人有效管理压力，保持积极健康的心理状态。",
//     authorname: "吴十",
//     date: "2026-03-17 13:10",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 107,
//   },
//   {
//     title: "高效时间管理",
//     content:
//       "介绍番茄工作法与四象限法则，教你如何告别拖延症，全面提高工作效率。",
//     authorname: "郑一",
//     date: "2026-03-18 07:55",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 108,
//   },
//   {
//     title: "黑洞的奥秘",
//     content:
//       "通俗易懂地解释黑洞的形成与演化过程，带你领略宇宙深处的奇妙物理现象。",
//     authorname: "王二",
//     date: "2026-03-19 21:05",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 109,
//   },
//   {
//     title: "《百年孤独》赏析",
//     content: "重温经典名著，探讨马尔克斯笔下的魔幻现实主义与家族命运的轮回。",
//     authorname: "张伟",
//     date: "2026-03-20 15:40",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 110,
//   },
//   {
//     title: "年度科幻佳作",
//     content: "深度解析本年度必看的科幻电影巨作，从特效技术到剧本立意全面评测。",
//     authorname: "李娜",
//     date: "2026-03-21 10:25",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 111,
//   },
//   {
//     title: "极简居家收纳",
//     content:
//       "极简主义者的日常整理法则，教你如何断舍离，打造清爽舒适的居住空间。",
//     authorname: "王芳",
//     date: "2026-03-22 18:50",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 112,
//   },
//   {
//     title: "年轻人的理财课",
//     content:
//       "给年轻人的第一堂个人理财课，涵盖储蓄、基金定投及风险防范基础知识。",
//     authorname: "赵强",
//     date: "2026-03-23 09:35",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 113,
//   },
//   {
//     title: "家庭自重训练",
//     content: "零基础也能轻松上手的家庭自重训练计划，每天20分钟塑造完美体型。",
//     authorname: "孙丽",
//     date: "2026-03-24 22:15",
//     authoravatar:
//       "https://img.52tiemo.com/uploads/allimg/2023052011/nsgi1x25d0t.jpg",
//     image:
//       "https://image.jianke.com/upload/prodimage/201606wm/2016620143552411.jpg",
//     likecount: 114,
//   },
// ];

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    getArticleListApi().then((res) => {
      setArticleList(res.data);
    });
  }, []);

  return (
    <>
      <div className="article-list">
        {articleList.map((item, index) => {
          return (
            <div className="article-list">
              <div className="article-body">
                <div className="article-title">{item.title}</div>
                <img
                  className="article-image"
                  alt={`${item.title}的封面`}
                  src={item.image}
                ></img>
              </div>
              <div className="article-footer">
                <div className="article-footer-left">
                  <img
                    className="article-footer-left-avatar"
                    alt="作者头像"
                    src={item.authoravatar}
                  ></img>
                  <div>{item.authorname}</div>
                  <div>{item.date}</div>
                </div>
                <div className="article-footer-right">
                  <HeartOutline />
                  <div>{item.likecount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*  */}
    </>
  );
};

export default ArticleList;
