


import fetch from "../utils/request";

class rq {
  static fetchGet(url:string, data = {}) {
    return new Promise((resolve, reject) => {
      fetch({
        url,
        method: "get",
        params: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static fetchPost(url:string, data = {}) {
    return new Promise((resolve, reject) => {
      fetch({
        url,
        method: "post",
        data: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static fetchPut(url:string, data = {}) {
    return new Promise((resolve, reject) => {
      fetch({
        url,
        method: "put",
        data: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static fetchDelete(url:string, params = {}) {
    return new Promise((resolve, reject) => {
      fetch({
        url,
        method: "delete",
        params: params,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static fetchUpload(url:string, data = {}) {
    return new Promise((resolve, reject) => {
      fetch({
        url,
        method: "post",
        data: data,
        headers:{
          'content-type':'multipart/form-data'
        }
      })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
    });
  }
}
export default rq;














