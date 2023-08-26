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
          <el-form-item label="线路标题：">
            <el-input
              v-model="query.title"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="query.sales_status"
              class="m-2"
              clearable
              placeholder="请选择"
            >
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
          prop="retail_goods_no"
          label="线路ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="线路标题"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="status"
          label="已报名"
          align="center"
        ></el-table-column> -->
        <!-- <el-table-column
          prop="phone"
          label="总名额"
          align="center"
        ></el-table-column> -->
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.sales_status === 1 ? 'success' : 'danger'">
              {{
                scope.row.sales_status === 1
                  ? "上架"
                  : scope.row.sales_status === 2
                  ? "下架"
                  : "待上架"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="created_at"
          label="最新编辑时间"
          align="center"
        ></el-table-column> -->
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.sales_status === 2"
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
              :icon="View"
              @click="handleEdit(scope.$index, scope.row)"
              v-permiss="15"
            >
              查看
            </el-button>
            <el-button
              text
              :icon="Delete"
              @click="
                handleSaleStatus(
                  scope.row.retail_goods_no,
                  scope.row.sales_status
                )
              "
              v-permiss="16"
            >
              {{ scope.row.sales_status === 1 ? "下架" : "上架" }}
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
import { Delete, Edit, Search, Plus, View } from "@element-plus/icons-vue";

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
  title: "",
  sales_status: "",
  page: 1,
  pageSize: 10,
});

const statusData = [
  // {
  //   value: "",
  //   label: "全部",
  // },
  {
    value: 0,
    label: "待上架",
  },
  {
    value: 1,
    label: "上架",
  },
  {
    value: 2,
    label: "下架",
  },
];

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.GET_RETAIL_GOODS_LIST, query).then((res) => {
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
const handleSaleStatus = (retail_goods_no: string, sales_status: number) => {
  let tip = sales_status == 1 ? "下架" : "上架";
  ElMessageBox.confirm(`是否确定${tip}该线路？`, "提示", {
    type: "warning",
  })
    .then(() => {
      sales_status = sales_status == 1 ? 2 : 1;
      rq.fetchPut(apiUrl.UPDATE_SALES_STATUS, {
        retail_goods_no,
        sales_status,
      }).then((res) => {
        ElMessage.success("操作成功");
        getData();
      });
    })
    .catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.retail_goods_no).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
};

const form = reactive({
  val: {
    cover_images: "",
    title: "",
    purchase_notes: "",
    line_detail_images: "",
    scheduling_images: "",
    cost_remark_images: "",
    subscribe_ask_images: "",
    labels_group: "",
    spec_list: [],
    sales_status: 0,
  },
});
// 获取用户详情
const getDetail = async (retail_goods_no: string) => {
  await rq
    .fetchGet(apiUrl.GET_RETAIL_GOODS_DETAIL, { retail_goods_no })
    .then((res) => {
      if (res.status_code == 200) {
        const resData = res.data;
        form.val = resData;
        form.val.cover_images = form.val.cover_images.join(",");
        form.val.line_detail_images = form.val.line_detail_images.join(",");
        form.val.scheduling_images = form.val.scheduling_images.join(",");
        form.val.cost_remark_images = form.val.cost_remark_images.join(",");
        form.val.subscribe_ask_images = form.val.subscribe_ask_images.join(",");
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
