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
          <el-form-item label="优惠券名称：">
            <el-input
              v-model="query.coupon_name"
              placeholder="请输入"
              class="handle-input mr10"
              clearable
            />
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select
              v-model="query.coupon_type"
              class="m-2"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in couponTypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效：">
            <el-select
              v-model="query.valid_status"
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
          prop="coupon_name"
          label="优惠券名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="coupon_no"
          label="优惠券ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="coupon_type_text"
          label="优惠券类型"
          align="center"
        ></el-table-column>
        <el-table-column label="门槛" align="center">
          <template #default="scope"> ￥{{ scope.row.threshold }} </template>
        </el-table-column>
        <el-table-column label="优惠" align="center">
          <template #default="scope">
            {{
              scope.row.coupon_type == "MJ"
                ? `-￥${scope.row.discount_value}`
                : `${scope.row.discount_value / 10}折 （封顶${
                    scope.row.discount_upper_limit
                  }）`
            }}
          </template>
        </el-table-column>
        <el-table-column label="是否有效" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.valid_status === 1 ? 'success' : 'danger'">
              {{ scope.row.valid_status === 1 ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" width="320">
          <template #default="scope">
            {{ scope.row.valid_s_datetime }} -- {{ scope.row.valid_e_datetime }}
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
              查看
            </el-button>
            <el-button
              text
              :icon="Edit"
              @click="handleIssue(scope.row.coupon_no)"
              v-permiss="16"
            >
              发放
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <!-- <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination> -->
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
import type { Action } from "element-plus";

import dialogForm from "./dialog_form.vue";
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
  coupon_name: "",
  coupon_type: "",
  valid_status: "",
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
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.GET_COUPON_LIST, query).then((res) => {
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

// 发放操作
const handleIssue = (coupon_no: string) => {
  rq.fetchPost(apiUrl.DISTRIBUTE_COUPON, { coupon_no }).then((res) => {
    ElMessageBox.alert(res.data.coupon_code, "优惠券券码", {
      confirmButtonText: "复制",
      callback: async (action: Action) => {
        const text = res.data.coupon_code;
        try {
          await toClipboard(text);
          ElMessage.success("复制成功");
          console.log("复制成功");
        } catch (error) {
          ElMessage.error("复制失败");
          console.log("复制失败");
        }
      },
    });
  });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.coupon_no).then((res) => {
    editVisible.value = true;
  });
};
const handleCreate = () => {
  editVisible.value = true;
};

const form = reactive({
  val: {
    coupon_name: "",
    coupon_type: "",
    discount_value: 0,
    discount_upper_limit: 0,
    threshold: 0,
    valid_s_datetime: "",
    valid_e_datetime: "",
    product_join_nos: [],
    product_join_all: "N",
  },
});
// 获取用户详情
const getDetail = async (coupon_no: string) => {
  await rq.fetchGet(apiUrl.GET_COUPON_DETAIL, { coupon_no }).then((res) => {
    if (res.status_code == 200) {
      const resData = res.data;
      form.val = resData;
      console.log("form", form);
    }
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
