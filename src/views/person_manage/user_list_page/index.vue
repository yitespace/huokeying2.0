<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" :icon="Plus" @click="handleCreate()"
          >新增</el-button
        >
      </div>
      <div class="handle-box">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="手机号码：">
            <el-input
              v-model="query.phone"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="query.status" class="m-2" clearable placeholder="请选择">
              <el-option
                v-for="item in statusData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="uid"
          label="用户ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "正常" : "失效" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="15"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <dialogForm
      v-model:visible="editVisible"
      @refreshTable="getData"
      :data="form.val"
    />
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, nextTick, getCurrentInstance, watch, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search, Plus } from "@element-plus/icons-vue";

import dialogForm from "./dialog_form.vue";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

interface TableItem {
  id: number;
  name: string;
  money: string;
  state: string;
  date: string;
  address: string;
}

const query = reactive({
  // username: "",
  phone: "",
  // user_status: "",
  status: "",
  page: 1,
  pageSize: 10,
});

const statusData = [
  {
    value: 1,
    label: "正常",
  },
  {
    value: 0,
    label: "失效",
  },
  {
    value: 2,
    label: "注销",
  },
  {
    value: "",
    label: "全部",
  },
];

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.getUserList, query).then((res) => {
    tableData.value = res.data;
    pageTotal.value = res.pagination.total;
  });
};
getData();

// 查询操作
const handleSearch = () => {
  query.page = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.uid).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
};

const form = reactive({
  val: {
    head_img_url: "",
    username: "",
    nickname: "",
    password: "",
    phone: "",
    gender: "",
    birthday: "",
    address: "",
    status: "",
    remark: "",
  },
});
// 获取用户详情
const getDetail = async (uid: string) => {
  await rq.fetchGet(apiUrl.user_info, { uid }).then((res) => {
    if (res.status_code == 200) {
      const resData = res.data;
      form.val = resData;
      console.log("form", form);
    }
  });
};

// 重置数据相关
let _form = toRaw({
  ...form.val
})
watch(
  () => editVisible.value,
  (val) => {

    if(val == false){
      form.val = { ..._form }// 将属性值还原为默认值
      console.log(form, "form.value")
    }

  }
);
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.handle-input {
  width: 200px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
