<template>
  <div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-button type="primary" :icon="Plus" @click="handleCreate()"
          >新增</el-button
        >
      </div> -->
      <div class="handle-box">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="关联线路编号">
            <el-input
              v-model="query.goods_no"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="关联线路名称">
            <el-input
              v-model="query.goods_title"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="query.order_status"
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
          <!-- <el-form-item label="是否使用优惠券：">
            <el-select
              v-model="query.status"
              class="m-2"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in isUseCouponData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="是否成团：">
            <el-select
              v-model="query.status"
              class="m-2"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in isSuccessData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
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
          prop="order_no"
          label="订单编号"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="SKU" align="center" width="200">
          <template #default="scope">
            {{ scope.row.retail_goods_list[0].title }}
          </template>
        </el-table-column>
        <el-table-column label="SKU" align="center" width="200">
          <template #default="scope">
            {{ scope.row.retail_goods_list[0].spec_name }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="200">
          <template #default="scope">
            <el-tag class="ml-2" :type="formatStatusType(scope.row.order_status)">{{ formatStatusText(scope.row.order_status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品总价"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="pay_price"
          label="实付金额"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="discount_price"
          label="优惠金额"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="220" align="center">
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
  goods_no: "",
  goods_title: "",
  order_status: "",
  page: 1,
  pageSize: 10,
});

const statusData = [
  {
    value: "",
    label: "全部",
    type: "",
  },
  {
    value: 0,
    label: "已失效",
    type: "info",
  },
  {
    value: 10,
    label: "待付款",
    type: "danger",
  },
  {
    value: 20,
    label: "待核销",
    type: "warning",
  },
  {
    value: 80,
    label: "已关闭",
    type: "primary",
  },
  {
    value: 100,
    label: "已完成",
    type: "success",
  },
];

const isUseCouponData = [
  {
    value: 1,
    label: "是",
  },
  {
    value: 0,
    label: "否",
  },
];

const isSuccessData = [
  {
    value: 1,
    label: "是",
  },
  {
    value: 0,
    label: "否",
  },
];

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.GET_RETAIL_ORDER_LIST, query).then((res) => {
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
  getDetail(row.order_no).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
};

const form = reactive({
  val: {
    // head_img_url: "",
    // username: "",
    // nickname: "",
    // password: "",
    // phone: "",
    // gender: "",
    // birthday: "",
    // address: "",
    // status: "",
    // remark: "",
  },
});
// 获取详情
const getDetail = async (order_no: string) => {
  await rq.fetchGet(apiUrl.GET_RETAIL_ORDER_DETAIL, { order_no }).then((res) => {
    if (res.status_code == 200) {
      const resData = res.data;
      form.val = resData;
      console.log("form", form);
    }
  });
};

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
