<template>
  <div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column label="icon" align="center">
          <template #default="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.icon_url"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="zone_name" label="名称" align="center">
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
import { Delete, Edit, Search, Plus, Switch } from "@element-plus/icons-vue";
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
  // coupon_name: "",
  // coupon_type: "",
  // valid_status: "",
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
  rq.fetchGet(apiUrl.GET_RECOMMEND_LIST, query).then((res) => {
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
const handleSaleStatus = (banner_id: string, status: number) => {
  let tip = status == 1 ? "失效" : "启用";
  ElMessageBox.confirm(`您确定要${tip}该banner？`, "提示", {
    type: "warning",
  })
    .then(() => {
      status = status == 1 ? 2 : 1;
      rq.fetchPut(apiUrl.UPDATE_BANNER_STATUS, {
        banner_id,
        status,
      }).then((res) => {
        if (res.status_code == 201 || res.status_code == 204) {
          ElMessage.success("操作成功");
          getData();
        }
      });
    })
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);

// let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  // idx = index;
  getDetail(row.id).then((res) => {
    editVisible.value = true;
  });
  // form.val = row;
  // editVisible.value = true;

};
// const handleCreate = () => {
//   editVisible.value = true;
// };

const form = reactive({
  val: {
    icon_url: "",
    name: "",
    cover_img_url: "",
    goods_nos: [],
    related_all_goods: "N",
  },
});
// 获取详情
const getDetail = async (id: string) => {
  await rq.fetchGet(apiUrl.GET_RECOMMEND_DETAIL, { id }).then((res) => {
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
