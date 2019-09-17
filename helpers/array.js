export const groupBy = function(xs, selectKey) {
  return xs.reduce(function(rv, x) {
    (rv[selectKey(x)] = rv[selectKey(x)] || []).push(x);
    return rv;
  }, {});
};

export const distinct = function(arr) {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
}