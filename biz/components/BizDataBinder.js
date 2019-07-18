import { Message } from "@alifd/next";
import { buildLoginRedirectPath } from "../../helpers/router";
import SimpleDataBinder from "../../components/SimpleDataBinder";

function BizDataBinder(dataKey, axoisOptions, bizOptions) {
  const { loginPathBuilder } = bizOptions;
  if (typeof loginPathBuilder !== 'function') {
    throw 'bizOptions.loginPathBuilder must be a function'
  }
  return SimpleDataBinder(dataKey, axoisOptions, {
    success: (body, defaultCallback, originResponse) => {
      // console.log(originResponse, body)
      if (body.status !== "SUCCESS") {
        Message.error(body.message);
        // 后端返回的状态码错误
        if (body.data.code === 401) {
          const loginPath = loginPathBuilder;
          // 只允许一次请求跳转到session
          if (location.hash.indexOf(loginPath) < 0) {
            location.hash = buildLoginRedirectPath(loginPath);
          }
        }
      } else {
        // // 成功不弹 toast，可以什么都不走
        // console.log('success');
      }
    },
    error: (originResponse, defaultCallback, err) => {
      console.log(originResponse);
    }
  });
}

export default SimpleDataBinder;
