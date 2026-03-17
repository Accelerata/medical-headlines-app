import { useState, useEffect } from "react";

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    // 兼容性判断：如果浏览器不支持 visualViewport，直接返回
    if (!visualViewport) return;

    // 记录初始屏幕高度
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = visualViewport.height;
      // 初始高度减去当前可视高度，得出被挤压的高度（即键盘高度）
      const heightDiff = initialHeight - currentHeight;

      // 设置一个阈值（比如 150px），防止因为浏览器的地址栏收缩触发误判
      if (heightDiff > 150) {
        setKeyboardHeight(heightDiff);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    visualViewport.addEventListener("resize", handleResize);

    // 清理副作用
    return () => {
      visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  return { keyboardHeight, isKeyboardOpen };
}
