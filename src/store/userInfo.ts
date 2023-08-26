// import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  setToken,
  getMenuList,
} from "../utils/common";

import rq from '../api/index';
import apiUrl from "../api/apiUrl";

// // 网络请求
// const { proxy } = getCurrentInstance();
// const rq = proxy.$rq; // 请求方法
// const apiUrl = proxy.$apiUrl; // api地址

const router = useRouter();

interface ObjectList {
  [key: string]: string[];
}

interface DataObject {
  uid:string,
  token:string,
}

export const useUserInfoStore = defineStore("userInfoStore", {
  state: () => {
    // const keys = localStorage.getItem('ms_keys');
    return {
      // key: keys ? JSON.parse(keys) : <string[]>[],
      // defaultList: <ObjectList>{
      // 	admin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
      // 	user: ['1', '2', '3', '11', '13', '14', '15']
      // }
      user_id: <string>"",
      phone: <string>"",
      token: <string>"",
      // canVisitedSchool: [],
      // allUsers: [],
      // selected_school: [],
      // organization_list: [],
    };
  },
  actions: {
    handleLogin(
      // data: object,
      data: DataObject,
      phone: string,
      password: string,
      token_key: string
    ) {
      this.user_id = data.uid;
      this.phone = phone;
      this.token = data.token;
      setToken(data.token);
      getMenuList(data.token,apiUrl.GET_MENU_LIST+'?menu_status=1');  // 获取菜单列表

      localStorage.setItem("userInfo", JSON.stringify(data)); // 储存用户信息

      // // 储存用户可访问机构列表
      // localStorage.setItem(
      //   "canVisitedSchool",
      //   JSON.stringify(data.school_list)
      // );
      // let selected_school = data.school_list.filter((i) => {
      //   return i.selection == 1;
      // });
      // // 储存用户选中的校区
      // localStorage.setItem("selected_school", JSON.stringify(selected_school));
      // console.log("selected_school", selected_school.length);

      // if (!selected_school.length) {
      //   return ElMessage.error("登陆失败，请联系管理员添加机构");
      // }
      // ElMessage.success("登陆成功！即将跳转到主页！");

    //   setTimeout(() => {
    //     router.push("/");
    //   }, 1500);
    },
  },
});
