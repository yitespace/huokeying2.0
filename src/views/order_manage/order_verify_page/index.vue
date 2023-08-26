<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" :icon="Plus" @click="handleCreate()"
          >新建旅行团</el-button
        >
      </div>
      <div class="handle-box">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="旅行团名称：">
            <el-input
              v-model="query.team_name"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
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
          prop="verify_team_no"
          label="旅行团ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="team_name"
          label="旅行团名称"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "正常" : "失效" }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" align="center" width="200">
          <template #default="scope">
            <el-tag class="ml-2" :type="formatStatusType(scope.row.status)">{{ formatStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="最新编辑时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
            v-if="scope.row.status == 0"
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="15"
            >
              编辑
            </el-button>
            <el-button
            v-else
              text
              :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="15"
            >
              查看
            </el-button>
            <el-button
            v-if="scope.row.status == 0"
              text
              :icon="Delete"
              class="red"
              @click="handleClose(scope.row.verify_team_no)"
              v-permiss="16"
            >
              关闭
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
  team_name: "",
  page: 1,
  pageSize: 10,
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.GET_VERIFY_TEAM_LIST, query).then((res) => {
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

// 关闭操作
const handleCloseTour = (index: number) => {
  ElMessageBox.confirm(
    "关闭会使关联订单取消成团，您是否要关闭该旅行团",
    "关闭确认",
    {
      type: "warning",
    }
  )
    .then(() => {
      ElMessage.success("关闭成功");
      // tableData.value.splice(index, 1);
    })
    .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.verify_team_no).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
  console.log('form',form)
};


const form = reactive({
  val: {
    team_name: "",
    retail_goods_no: "",
    order_list: [],
    order_relations: [],
    status: 0,
  },
});
// 获取详情
const getDetail = async (verify_team_no: string) => {
  await rq.fetchGet(apiUrl.GET_VERIFY_TEAM_DETAIL, { verify_team_no }).then((res) => {
    if (res.status_code == 200) {
      const resData = res.data;
      form.val = resData;
      console.log("form", form);
    }
  });
};


const statusData = [
  {
    value: 0,
    label: "待核销",
    type: "warning",
  },
  {
    value: 1,
    label: "已完成",
    type: "success",
  },
  {
    value: 2,
    label: "已关闭",
    type: "primary",
  },
];
// 格式化状态文字
const formatStatusText = (order_status: number) => {
  let statusName = ""
  statusData.forEach((item)=>{
    if(item.value == order_status){
      statusName = item.label
    }
  })
  return statusName
};
// 格式化状态标签类型
const formatStatusType = (order_status: number) => {
  let type = ""
  statusData.forEach((item)=>{
    if(item.value == order_status){
      type = item.type
    }
  })
  return type
};

// 操作关闭
const handleClose = (verify_team_no: string) => {
  ElMessageBox.confirm(`关闭会使关联订单取消成团，您是否要关闭该旅行团`, "提示", {
    type: "warning",
  }).then(() => {
    rq.fetchPut(apiUrl.CLOSE_VERIFY_TEAM, {
      verify_team_no,
    }).then((res) => {
      if (res.status_code == 201 || res.status_code == 204) {
        ElMessage.success("操作成功");
        getData();
      }
    });
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
