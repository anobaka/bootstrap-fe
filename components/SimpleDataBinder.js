import dataBinder from '@icedesign/data-binder';

function SimpleDataBinder(dataKey, axoisOptions) {
  const options = {};
  const dataSourceOptions = {
    responseFormatter: (responseHandler, res, originResponse) => {
      // console.log(res);
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
        }
      };
      // 回传给处理函数
      // 不做回传处理会导致数据更新逻辑中断
      responseHandler(newRes, originResponse);
    },
    defaultBindingData: {
      currentPage: 0,
      pageSize: 20,
      total: 0,
      data: null,
      list: []
    }
  };
  // console.log(axoisConfig);
  options[dataKey] = {
    ...axoisOptions,
    ...dataSourceOptions
  };
  // console.log('SimpleDataBinder', options);
  return dataBinder(options);
}

export default SimpleDataBinder;
