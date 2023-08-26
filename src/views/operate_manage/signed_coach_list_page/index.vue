<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" :icon="Plus" @click="handleOpenCoachList()"
          >关联教练</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="coach_name" label="教练名称" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="教练手机号" align="center">
        </el-table-column>
        <el-table-column label="教练头像" align="center">
          <template #default="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.head_img_url"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
            text
            :icon="Delete"
            @click="handleCancelRelated(scope.row.coach_no)"
            v-permiss="16"
          >
            取消关联
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


    <!-- 教练列表 -->
    <coachList
      v-model:visible="coachVisible"
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

import coachList from "./coach_list.vue";

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
  related_sign: 'Y',
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
  rq.fetchGet(apiUrl.GET_COACH_LIST, query).then((res) => {
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
// 操作取消关联
const handleCancelRelated = (coach_no: string) => {
  ElMessageBox.confirm(`确认取消关联该教练？`, "提示", {
    type: "warning",
  }).then(() => {
    rq.fetchPut(apiUrl.RELATED_COACH_SIGN, {
      coach_no,
      related_sign: 'N'
    }).then((res) => {
      if (res.status_code == 201 || res.status_code == 204) {
        ElMessage.success("操作成功");
        getData();
      }
    });
  });
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
const coachVisible = ref(false);

// 打开关联教练列表
const handleOpenCoachList = () => {
  coachVisible.value = true;
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
