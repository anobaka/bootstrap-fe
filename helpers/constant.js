import { cloneArr } from './object';

export const initializeConstants = function (getAllConstants, callback) {
  getAllConstants().invoke((t) => {
    global.bizOptions = global.bizOptions || {};
    global.bizOptions.constants = t.data;
    console.log(`constants loaded: ${Object.keys(t.data).length}`, t.data);
    if (callback) {
      callback();
    }
  });
};
export const getConstantName = function (type, value) {
  const values = global.bizOptions.constants[type] || [];
  let name = null;
  if (values) {
    const item = values.find((json) => {
      return json.value == parseInt(value);
    });
    name = item && item.label;
  }
  if (!name) {
    name = `${type}.${value}`;
  }
  return name;
};

export const getConstantValueByName = function (type, name) {
  const values = global.bizOptions.constants[type] || [];
  const e = values.find(t => t.label == name);
  if (e) {
    return e.value;
  }
  return null;
};

export const getConstants = function (type) {
  const values = global.bizOptions.constants[type] || [];
  return values;
};

export const buildSelectDataSource = function (
  type,
  appendItemAll,
  labelForItemAll
) {
  const values = cloneArr(global.bizOptions.constants[type] || []);
  appendItemAll = appendItemAll == undefined ? true : appendItemAll;
  if (appendItemAll) {
    values.splice(0, 0, {
      value: '',
      label: labelForItemAll || '全部',
    });
  }
  return values;
};
