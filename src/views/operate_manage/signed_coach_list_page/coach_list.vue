

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <el-table
      :data="tableData"
      border
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="coach_no" label="教练ID" align="center">
      </el-table-column>
      <el-table-column prop="coach_name" label="教练名称" align="center">
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
      <el-table-column prop="created_at" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <!-- <el-button
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
          </el-button> -->
          <el-button
            text
            :icon="Delete"
            @click="handleRelated(scope.row.coach_no)"
            v-permiss="16"
          >
            关联教练
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

    <!-- <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template> -->
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance } from "vue";
import { FormInstance, ElMessage, ElMessageBox } from "element-plus";
import upload from "../../../components/common/.vue";
import pca from "../../../components/common/pca.vue";
import UploadImages from "../../../components/common/UploadImages.vue";
import { Delete } from "@element-plus/icons-vue";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

const status_list = [
  { label: "正常", value: 1 },
  { label: "未生效", value: 0 },
  { label: "注销", value: 2 },
];

const couponTypeData = [
  {
    value: "PIC",
    label: "图片",
  },
  {
    value: "TOPIC",
    label: "专题入口",
  },
  {
    value: "GOODS",
    label: "线路入口",
  },
];

const pickerOptions = {
  disabledDate(time: any) {
    return time.getTime() > Date.now();
  },
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

console.log("props.data", props.data);

const ruleFormRef = ref<FormInstance>();

const formVisible = ref(false);

const dialogTitle = ref("可关联教练列表");

/*  ==================================表格数据================================= */
interface TableItem {
  id: number;
  name: string;
  money: string;
  state: string;
  date: string;
  address: string;
}
const query = reactive({
  related_sign: "N",
  page: 1,
  pageSize: 10,
});
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

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};
// 操作关联
const handleRelated = (coach_no: string) => {
  ElMessageBox.confirm(`确认关联该教练？`, "提示", {
    type: "warning",
  }).then(() => {
    rq.fetchPut(apiUrl.RELATED_COACH_SIGN, {
      coach_no,
      related_sign: 'Y'
    }).then((res) => {
      if (res.status_code == 201 || res.status_code == 204) {
        ElMessage.success("操作成功");
        getData();
        emit("refreshTable", true);
      }
    });
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emit = defineEmits(["update:visible", "refreshTable"]);
watch(
  () => formVisible.value,
  (val) => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  (val) => {
    // formData.val = val;
    getData(props.data.active_id);
  }
);
</script>

<!-- <style lang="scss" scoped>
// @import "@/style/constant.scss";
.parent{
  color: $color-blue;
  .child{
    color: green;
  }
}
</style> -->