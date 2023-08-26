import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "../views/home.vue";
import { getToken } from "../utils/common";
import { ElMessage } from "element-plus";

const routes: RouteRecordRaw[] = [
  //   {
  //     path: "/",
  //     redirect: "/dashboard",
  //   },
  {
    path: "/",
    redirect: "/home_page",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/table",
        name: "basetable",
        meta: {
          title: "表格",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/table.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/charts.vue"),
      },
      {
        path: "/form",
        name: "baseform",
        meta: {
          title: "表单",
          permiss: "5",
        },
        component: () =>
          import(/* webpackChunkName: "form" */ "../views/form.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "tab标签",
          permiss: "3",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },
      {
        path: "/donate",
        name: "donate",
        meta: {
          title: "鼓励作者",
          permiss: "14",
        },
        component: () =>
          import(/* webpackChunkName: "donate" */ "../views/donate.vue"),
      },
      {
        path: "/permission",
        name: "permission",
        meta: {
          title: "权限管理",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/permission.vue"
          ),
      },
      {
        path: "/upload",
        name: "upload",
        meta: {
          title: "上传插件",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/upload.vue"),
      },
      {
        path: "/icon",
        name: "icon",
        meta: {
          title: "自定义图标",
          permiss: "10",
        },
        component: () =>
          import(/* webpackChunkName: "icon" */ "../views/icon.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user.vue"),
      },
      {
        path: "/editor",
        name: "editor",
        meta: {
          title: "富文本编辑器",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "editor" */ "../views/editor.vue"),
      },
      {
        path: "/markdown",
        name: "markdown",
        meta: {
          title: "markdown编辑器",
          permiss: "9",
        },
        component: () =>
          import(/* webpackChunkName: "markdown" */ "../views/markdown.vue"),
      },
      {
        path: "/export",
        name: "export",
        meta: {
          title: "导出Excel",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "export" */ "../views/export.vue"),
      },
      {
        path: "/import",
        name: "import",
        meta: {
          title: "导入Excel",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "import" */ "../views/import.vue"),
      },

      /* ===================== 2.0路由 ====================== */
      // -------------首页-------------
      {
        path: "/home_page",
        name: "home_page",
        meta: {
          title: "首页",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "import" */ "../views/home_page/index.vue"),
      },
      // -------------人员管理-------------
      {
        path: "/user_list_page",
        name: "user_list_page",
        meta: {
          title: "用户列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/person_manage/user_list_page/index.vue"
          ),
      },
      {
        path: "/coach_list_page",
        name: "coach_list_page",
        meta: {
          title: "教练列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/person_manage/coach_list_page/index.vue"
          ),
      },
      {
        path: "/novice_list_page",
        name: "novice_list_page",
        meta: {
          title: "出行人管理",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/person_manage/novice_list_page/index.vue"
          ),
      },
      // -------------订单管理-------------
      {
        path: "/order_list_page",
        name: "order_list_page",
        meta: {
          title: "订单列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/order_manage/order_list_page/index.vue"
          ),
      },
      {
        path: "/order_verify_page",
        name: "order_verify_page",
        meta: {
          title: "订单核销",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/order_manage/order_verify_page/index.vue"
          ),
      },
      // -------------线路管理-------------
      {
        path: "/line_list_page",
        name: "line_list_page",
        meta: {
          title: "线路列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/line_manage/line_list_page/index.vue"
          ),
      },
      // -------------优惠管理-------------
      {
        path: "/coupon_list_page",
        name: "coupon_list_page",
        meta: {
          title: "优惠券列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/coupon_manage/coupon_list_page/index.vue"
          ),
      },
      // -------------运营管理-------------
      {
        path: "/banner_list_page",
        name: "banner_list_page",
        meta: {
          title: "banner管理",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/banner_list_page/index.vue"
          ),
      },
      {
        path: "/subject_list_page",
        name: "subject_list_page",
        meta: {
          title: "金刚区管理",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/subject_list_page/index.vue"
          ),
      },
      {
        path: "/activity_review_list_page",
        name: "activity_review_list_page",
        meta: {
          title: "活动回顾",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/activity_review_list_page/index.vue"
          ),
      },
      {
        path: "/recommend_list_page",
        name: "recommend_list_page",
        meta: {
          title: "推荐专区管理",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/recommend_list_page/index.vue"
          ),
      },
      {
        path: "/signed_coach_list_page",
        name: "signed_coach_list_page",
        meta: {
          title: "签约教练",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/signed_coach_list_page/index.vue"
          ),
      },
      {
        path: "/line_type_list_page",
        name: "line_type_list_page",
        meta: {
          title: "线路分类",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/operate_manage/line_type_list_page/index.vue"
          ),
      },
      // -------------系统管理-------------
      {
        path: "/administrator_list_page",
        name: "administrator_list_page",
        meta: {
          title: "管理员列表",
          permiss: "2",
        },
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../views/sys_manage/administrator_list_page/index.vue"
          ),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | vue-manage-system`;
document.title = `${to.meta.title} | 后台管理系统`;
  // const role = localStorage.getItem('ms_username');
  const permiss = usePermissStore();
  const token = getToken();
  // if (!role && to.path !== '/login') {
  if (!token && to.path !== "/login") {
    ElMessage.error("登录信息失效，请重新登录！");
    next("/login");
  } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next("/403");
  } else {
    next();
  }
});

export default router;
