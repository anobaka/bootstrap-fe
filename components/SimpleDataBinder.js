import dataBinder from '@icedesign/data-binder';
import { Message } from '@alifd/next';
import appConfig from '../../src/appConfig';
import { buildLoginRedirectPath } from '../helpers/router';

function SimpleDataBinder(dataKey, axoisOptions) {
  const options = {};
  const dataSourceOptions = {
    success: (body, defaultCallback, originResponse) => {
      // console.log(originResponse, body)
      if (body.status !== 'SUCCESS') {
        Message.error(body.message);
        // 后端返回的状态码错误
        if (body.data.code === 401) {
          const loginPath = appConfig.getLoginPath();
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
    // error: (originResponse, defaultCallback, err) => {
    //   console.log(originResponse);
    // },
    responseFormatter: (responseHandler, res, originResponse) => {
      // 做一些数据转换
      const newRes = {
        status: res.code === 0 ? 'SUCCESS' : 'ERROR',
        message: res.message,
        data: {
          currentPage: res.pageIndex,
          pageSize: res.pageSize,
          total: res.totalCount,
          data: res.data,
          list: res.data,
          code: res.code,
        },
      };
      console.log(newRes);
      // 回传给处理函数
      // 不做回传处理会导致数据更新逻辑中断
      responseHandler(newRes, originResponse);
    },
    defaultBindingData: {
      currentPage: 0,
      pageSize: 20,
      total: 0,
      data: null,
      list: [],
    },
  };
  // console.log(axoisConfig);
  options[dataKey] = {
    ...axoisOptions,
    ...dataSourceOptions,
  };
  // console.log('SimpleDataBinder', options);
  return dataBinder(options);
}

export default SimpleDataBinder;
