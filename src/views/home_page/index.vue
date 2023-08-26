<template>
  <div>
    <div class="container">首页</div>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search, Plus } from "@element-plus/icons-vue";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

// const tableData = ref([]);
// const pageTotal = ref(0);
// // 获取表格数据
// const getData = () => {
//   // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
//   rq.fetchGet(apiUrl.GET_ADMIN_ROLE_LIST, {}).then((res) => {
//     tableData.value = res.data;
//     pageTotal.value = res.pagination.total;
//   });
// };
// getData();
</script>
