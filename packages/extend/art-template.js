const template = requirejs("art-template");
import dayjs from 'dayjs';
// 注册 dateFormat 函数
template.defaults.imports.dateFormat = function (date, format) {
  if (!date) {
    return "";
  }
  // 如果传入的是一个 Date 对象，转换为 dayjs 对象
  if (
    date instanceof Date ||
    typeof date === "string" ||
    typeof date === "number"
  ) {
    date = dayjs(date);
  } else {
    return "";
  }
  return date.format(format);
};

template.defaults.imports.truncate = (str, length = 10) => {
  return str.length > length ? str.slice(0, length) + "..." : str;
};

// 注册安全序列化方法
template.defaults.imports.safeStringify = (obj) => {
  return JSON.stringify(obj, null, 2);
};
