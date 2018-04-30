
export const getUrl = (url, callback) => {
  let req = new Request(url);
  fetch(req).then(res => callback(res.json()));
};
