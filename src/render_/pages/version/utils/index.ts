// 生成随机测试应用包名
export const generateRandomPackageName = () => {
  return `com.test.${Math.random().toString(36).substr(2, 6)}`;
};
