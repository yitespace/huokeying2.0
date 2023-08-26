

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="1400"
    draggable
    :before-close="closeDialog"
  >
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column fixed="left" type="selection" width="55" />
      <el-table-column prop="order_no" label="订单ID" width="200" />
      <el-table-column
        prop="retail_goods_title"
        label="关联线路名称"
        width="200"
      />
      <el-table-column prop="contact_phone" label="联系人手机号" width="200" />
      <el-table-column prop="adult_count" label="成人数量" width="200" />
      <el-table-column prop="children_count" label="儿童数量" width="200" />
      <!-- <el-table-column prop="order_status" label="状态" width="200">
        <template #default="scope">
          {{
            scope.row.order_status == 1
              ? "已完成"
              : scope.row.order_status == 2
              ? "已关闭"
              : "否"
          }}
        </template>
      </el-table-column> -->
      <el-table-column prop="order_status" label="状态" width="200">
          <template #default="scope">
            <el-tag class="ml-2" :type="formatStatusType(scope.row.order_status)">{{ formatStatusText(scope.row.order_status) }}</el-tag>
          </template>
        </el-table-column>
      <el-table-column prop="in_team" label="是否成团" width="200">
        <template #default="scope">
          {{ scope.row.in_team == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="total_fee" label="实付金额" width="200" />
      <el-table-column prop="use_coupon" label="是否使用优惠券" width="200">
        <template #default="scope">
          {{ scope.row.use_coupon == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="coupon_name" label="优惠券名称" width="200" />
      <el-table-column prop="discount_price" label="优惠金额" width="200" />
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
        width="200"
      ></el-table-column>
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
    <template #footer>
      <!-- <el-button @click="closeDialog">取消</el-button> -->
      <el-button type="primary" @click="relation()"> 关联 </el-button>
    </template>
  </el-dialog>
</template>
  
  
  <script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, onMounted } from "vue";
import { FormInstance, ElMessage, ElMessageBox } from "element-plus";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  retail_goods_no: {
    type: String,
    default: "",
  },
  verify_team_no: {
    type: String,
    default: "",
  },
});

// 是否关闭弹窗
const formVisible = ref(false);
// 关闭弹窗
const closeDialog = () => {
  formVisible.value = false;
};

const emit = defineEmits(["update:visible", "relation"]);
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
  () => props.retail_goods_no,
  (val) => {
    if(props.retail_goods_no){
      getData(props.retail_goods_no,props.verify_team_no);
    }
  }
);

watch(
  () => props.verify_team_no,
  (val) => {
    if(props.retail_goods_no){
      getData(props.retail_goods_no,props.verify_team_no);
    }
  }
);

const dialogTitle = ref("待成团订单列表");

interface TableItem {
  id: number;
  name: string;
  money: string;
  state: string;
  date: string;
  address: string;
}
const query = reactive({
  retail_goods_no: "",
  verify_team_no: "",
  page: 1,
  pageSize: 10,
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = (retail_goods_no,verify_team_no) => {
  query.retail_goods_no = retail_goods_no;
  query.verify_team_no = verify_team_no;
  rq.fetchGet(apiUrl.GET_RELATION_ORDER_LIST, query).then((res) => {
    tableData.value = res.data;
    pageTotal.value = res.pagination.total;
  });
};
// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData(props.retail_goods_no,props.verify_team_no);
};

const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log("relation---", val);
  multipleSelection.value = val;
};

const relation = () => {
  emit("relation", multipleSelection.value);
  formVisible.value = false;
};

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
  