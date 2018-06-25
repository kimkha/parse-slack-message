
export const getUrl = (url) => {
  let req = new Request(url);
  return fetch(req).then(res => res.json());
};
