import qs from "qs";
export const appendQueryParameter = (url, key, value, needEscape = true) => {
  if (url.indexOf("?") === -1) {
    url += "?";
  } else {
    url += "&";
  }
  if (needEscape) {
    url += `${encodeURI(key)}=${encodeURI(value)}`;
  } else {
    url += `${key}=${value}`;
  }
  return url;
};

export const getHashQueryParameters = () => {
  const index = location.href.lastIndexOf("?");
  if (index > -1) {
    return qs.parse(location.href.substring(index + 1));
  }
  return {};
};
