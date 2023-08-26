import Cookies from "js-cookie";
// import { useUserInfoStore } from "../store/userInfo";
import axios from "axios";

// const userInfoStore = useUserInfoStore();

import rq from '../api/index';
import apiUrl from "../api/apiUrl";


// 获取token
let getToken = () => {
    // console.log('Cookies.get("TOKEN")',Cookies.get("TOKEN"))
    // console.log('userStore.token',userInfoStore.token)

    // let TOKEN_KEY = Cookies.get("TOKEN") || userInfoStore.token;
    let TOKEN_KEY = Cookies.get("TOKEN");
    if (TOKEN_KEY) {
        return TOKEN_KEY;
    } else {
        return false;
    }
};

// 存储token
const setToken = (token:string) => {
    if (token) {
        Cookies.set("TOKEN", token, {
            expires: 3,
        });
    } else {
        return;
    }
};

// 获取菜单列表
const getMenuList = (token:string,url:string) => {
    // axios({
    //     method: "get",
    //     url,
    //     headers: {
    //         Authorization: token,
    //     },
    // }).then((res) => {
    //     localStorage.setItem("menu", JSON.stringify(res.data.data));
    // });

    rq.fetchGet(apiUrl.GET_MENU_LIST, {
        menu_status: 1,
      }).then((res) => {
        if (res.status_code == 200) {
            localStorage.setItem("menu", JSON.stringify(res.data));
        }
      })
};

export {
    getToken,
    setToken,
    getMenuList,
};