//格式化时间
export const formatTime = (time) => {
  const targetTime = new Date(time);
  const now = new Date();

  const diffMs = now - targetTime;

  if (diffMs <= 0) {
    return "刚刚";
  }
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMouths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  if (diffMins < 5) {
    return "刚刚";
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else if (diffMouths < 12) {
    return `${diffMouths}个月前`;
  } else {
    const year = targetTime.getFullYear();
    const mouth = String(targetTime.getMonth() + 1).padStart(2, "0");
    const day = String(targetTime.getDate()).padStart(2, "0");
    return `${year}-${mouth}-${day}`;
  }
};
