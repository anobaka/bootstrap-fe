export const appendQueryParameter = (url, key, value, needEscape = true) => {
  if (url.indexOf('?') === -1) {
    url += '?';
  }
  if (needEscape) {
    url += `${encodeURI(key)}=${encodeURI(value)}`;
  } else {
    url += `${key}=${value}`;
  }
  return url;
}