export const isInWechatBrowser = () => {
  return (
    navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1 ||
    typeof navigator.wxuserAgent !== "undefined"
  );
};
