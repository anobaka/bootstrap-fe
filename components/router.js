import qs from 'qs';

export const buildLoginRedirectPath = function (loginPath, redirectPath) {
  redirectPath = redirectPath || location.hash;
  return `${loginPath}?redirect=${encodeURI(redirectPath)}`;
};

export const redirect = function (hashOrUri) {
  if (!hashOrUri.startsWith('#')) {
    if (!hashOrUri.startsWith('/')) {
      hashOrUri = `/${hashOrUri}`;
    }
  }
  location.hash = hashOrUri;
};

export const getQueryParams = function (props) {
  return qs.parse(props.location.search.substring(1));
};