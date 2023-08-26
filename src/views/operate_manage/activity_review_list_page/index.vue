<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" :icon="Plus" @click="handleCreate()"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="title" label="图文标题" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">
              {{ scope.row.status == 1 ? "上架" : "下架" }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button
              text
              :icon="Edit"
              @click="handleOpenCommentList(scope.row)"
              v-permiss="15"
            >
              查看评论
            </el-button>
            <el-button
              text
              :icon="Switch"
              @click="handleStatus(scope.row.active_id, scope.row.status)"
              v-permiss="16"
            >
              {{ scope.row.status == 1 ? "下架" : "上架" }}
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

    <!-- 评论列表 -->
    <commentList
      v-model:visible="commentVisible"
      @refreshTable="getData"
      :data="form.val"
    />
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search, Plus, Switch } from "@element-plus/icons-vue";
import type { Action } from "element-plus";

import dialogForm from "./dialog_form.vue";
import commentList from "./comment_list.vue";

import clipboard3 from "vue-clipboard3";

const { toClipboard } = clipboard3();

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
  page: 1,
  pageSize: 10,
});

const statusData = [
  {
    value: 1,
    label: "是",
  },
  {
    value: 0,
    label: "否",
  },
  {
    value: "",
    label: "全部",
  },
];

const couponTypeData = [
  {
    value: "ZK",
    label: "折扣",
  },
  {
    value: "MJ",
    label: "满减",
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
  rq.fetchGet(apiUrl.GET_ACTIVE_REVIEW_LIST, query).then((res) => {
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

// 操作上下架
const handleStatus = (active_id: string, status: number) => {
  let tip = status == 1 ? "下架" : "上架";
  ElMessageBox.confirm(`您确定要${tip}该活动回顾图文？`, "提示", {
    type: "warning",
  }).then(() => {
    status = status == 1 ? 2 : 1;
    rq.fetchPut(apiUrl.UPDATE_ACTIVE_REVIEW_STATUS, {
      active_id,
      status,
    }).then((res) => {
      if (res.status_code == 201 || res.status_code == 204) {
        ElMessage.success("操作成功");
        getData();
      }
    });
  });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.active_id).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
};


const form = reactive({
  val: {
    cover_img_url: "",
    title: "",
    content: "",
    retail_goods_no: [],
    view_count: 100,
  },
});
// 获取详情
const getDetail = async (active_id: string) => {
  await rq
    .fetchGet(apiUrl.GET_ACTIVE_REVIEW_DETAIL, { active_id })
    .then((res) => {
      if (res.status_code == 200) {
        const resData = res.data;
        form.val = resData;
        console.log("form", form);
      }
    });
};

// 评论列表弹窗控制
const commentVisible = ref(false);

// 打开评论列表
const handleOpenCommentList = (row: any) => {
  getDetail(row.active_id).then((res) => {
    commentVisible.value = true;
  });
};

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
