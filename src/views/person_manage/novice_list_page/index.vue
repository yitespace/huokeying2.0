<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="出行人ID：">
            <el-input
              v-model="query.uid"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="query.user_type" class="m-2" clearable placeholder="请选择">
              <el-option
                v-for="item in typeData"
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
          label="出行人ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="user_name"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.sex === 1 ? 'success' : 'danger'">
              {{ scope.row.sex === 1 ? "男" : "女" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.user_type === 1 ? 'success' : 'danger'">
              {{ scope.row.user_type === 1 ? "成人" : "儿童" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="id_card"
          label="身份证号"
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
              查看
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
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from "vue";
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
  uid: "",
  // gender: "",
  // phone: "",
  user_type: "",
  page: 1,
  pageSize: 10,
});

const genderData = [
  {
    value: 1,
    label: "男",
  },
  {
    value: 2,
    label: "女",
  }
];

const typeData = [
  {
    value: 1,
    label: "成人",
  },
  {
    value: 2,
    label: "儿童",
  }
];

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  rq.fetchGet(apiUrl.GET_TRAVEL_USER_LIST, query).then((res) => {
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
  form.val = row;
  editVisible.value = true;
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
