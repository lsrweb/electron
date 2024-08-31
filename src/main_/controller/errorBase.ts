export function errorToast(msg: string) {
  return {
    title: msg,
    type: "error",
    duration: 3000,
  };
}

export function successToast(msg: string) {
  return {
    title: "成功提示",
    message: msg,
    type: "success",
    duration: 3000,
  };
}
