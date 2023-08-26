<template>
  <div class="sidebar">
    <!-- <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        > -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#122335"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <!-- <template v-for="item in sidebar.items"> -->
      <template v-for="item in items">
        <template v-if="item.children">
          <!-- <el-sub-menu :index="item.name" :key="item.name" v-permiss="item.permiss"> -->
          <el-sub-menu :index="item.name" :key="item.name">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <!-- <el-sub-menu
                                v-if="subItem.children"
                                :index="subItem.name"
                                :key="subItem.name"
                                v-permiss="item.permiss"
                            > -->
              <el-sub-menu
                v-if="subItem.children"
                :index="subItem.name"
                :key="subItem.name"
              >
                <template #title>{{ subItem.meta.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="threeItem.name"
                >
                  {{ threeItem.meta.title }}
                </el-menu-item>
              </el-sub-menu>
              <!-- <el-menu-item v-else :index="subItem.name" v-permiss="item.permiss"> -->
              <el-menu-item v-else :index="subItem.name">
                {{ subItem.meta.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <!-- <el-menu-item :index="item.name" :key="item.name" v-permiss="item.permiss"> -->
          <el-menu-item :index="item.name" :key="item.name">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.meta.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";

// const items = [
//     {
//         icon: 'Odometer',
//         index: '/dashboard',
//         title: '系统首页',
//         permiss: '1',
//     },
//     {
//         icon: 'Calendar',
//         index: '1',
//         title: '表格相关',
//         permiss: '2',
//         subs: [
//             {
//                 index: '/table',
//                 title: '常用表格',
//                 permiss: '2',
//             },
//             {
//                 index: '/import',
//                 title: '导入Excel',
//                 permiss: '2',
//             },
//             {
//                 index: '/export',
//                 title: '导出Excel',
//                 permiss: '2',
//             },
//         ],
//     },
//     {
//         icon: 'DocumentCopy',
//         index: '/tabs',
//         title: 'tab选项卡',
//         permiss: '3',
//     },
//     {
//         icon: 'Edit',
//         index: '3',
//         title: '表单相关',
//         permiss: '4',
//         subs: [
//             {
//                 index: '/form',
//                 title: '基本表单',
//                 permiss: '5',
//             },
//             {
//                 index: '/upload',
//                 title: '文件上传',
//                 permiss: '6',
//             },
//             {
//                 index: '4',
//                 title: '三级菜单',
//                 permiss: '7',
//                 subs: [
//                     {
//                         index: '/editor',
//                         title: '富文本编辑器',
//                         permiss: '8',
//                     },
//                     {
//                         index: '/markdown',
//                         title: 'markdown编辑器',
//                         permiss: '9',
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         icon: 'Setting',
//         index: '/icon',
//         title: '自定义图标',
//         permiss: '10',
//     },
//     {
//         icon: 'PieChart',
//         index: '/charts',
//         title: 'schart图表',
//         permiss: '11',
//     },
//     {
//         icon: 'Warning',
//         index: '/permission',
//         title: '权限管理',
//         permiss: '13',
//     },
//     {
//         icon: 'CoffeeCup',
//         index: '/donate',
//         title: '支持作者',
//         permiss: '14',
//     },
//     {
//         icon: 'Calendar',
//         index: '1',
//         title: '用户管理',
//         permiss: '15',
//         subs: [
//             {
//                 index: '/parent',
//                 title: '家长管理',
//                 permiss: '15',
//             },
//         ],
//     },
// ];



const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();

const menu = localStorage.getItem("menu");
const items: any = JSON.parse(menu);
// sidebar.handleSetMenu(items);

</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
