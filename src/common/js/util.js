export function urlParse() {
  let url = window.location.search;// 从问号 (?) 开始的 URL（查询部分）
  let obj = {};
  let arr = url.substring(1).split('&');
  if (arr) {
    arr.forEach((item) => {
      let key = decodeURIComponent(item.split('=')[0]);
      obj[key] = item.split('=')[1];
    });
  }
  return obj;
}
