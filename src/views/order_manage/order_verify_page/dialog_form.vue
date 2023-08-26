

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="1400"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData.val"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="旅行团名称" prop="team_name">
        <el-input
          v-model="formData.val.team_name"
          :style="{ width: '480px' }"
          placeholder="请输入旅行团名称"
          :disabled="formData.val.status != 0"
        />
      </el-form-item>
      <!-- <el-form-item label="关联线路" prop="status">
        <el-select
          v-model="formData.val.status"
          clearable
          :style="{ width: '480px' }"
        >
          <el-option
            v-for="(item, index) in status_list"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="关联线路" prop="retail_goods_no">
        <el-select
          v-model="formData.val.retail_goods_no"
          placeholder="请选择"
          :style="{ width: '480px' }"
          :disabled="formData.val.status != 0"
        >
          <el-option
            v-for="item in lineData"
            :key="item.value"
            :label="item.title"
            :value="item.retail_goods_no"
          >
            <span style="float: left">{{ item.title }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.retail_goods_no }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联订单" prop="phone">
        <el-button
          v-if="formData.val.retail_goods_no && formData.val.status == 0"
          type="primary"
          title="新增"
          @click="openOrderListDialog()"
          ><el-icon><Plus /></el-icon
        ></el-button>
      </el-form-item>
      <!-- <el-table :data="tableData" border style="width: 100%"> -->
      <el-table :data="formData.val.order_relations" border style="width: 100%">
        <el-table-column prop="order_no" label="订单ID" width="200" />
        <el-table-column
          prop="retail_goods_title"
          label="关联线路名称"
          width="200"
        />
        <el-table-column
          prop="contact_phone"
          label="联系人手机号"
          width="200"
        />
        <el-table-column prop="adult_count" label="成人数量" width="200" />
        <el-table-column prop="children_count" label="儿童数量" width="200" />
        <el-table-column prop="order_status" label="状态" width="200">
          <template #default="scope">
            <el-tag class="ml-2" :type="formatStatusType(scope.row.order_status)">{{ formatStatusText(scope.row.order_status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="in_team" label="旅行团订单核销状态" width="200">
          <template #default="scope">
            <el-tag class="ml-2" :type="scope.row.team_verify_status == 1 ? 'success' : 'danger'">
            {{ scope.row.team_verify_status == 1 ? "已核销" : "未核销" }}
            </el-tag>
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
        <el-table-column v-if="formData.val.status == 0" label="操作" fixed="right" width="220" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.in_team == 1 && scope.row.team_verify_status == 0"
              text
              :icon="Edit"
              @click="handleVerify(scope.$index, scope.row)"
              v-permiss="15"
            >
              核销
            </el-button>
            <el-button
              text
              :icon="Delete"
              class="red"
              @click="handleCloseTour(scope.$index)"
              v-permiss="16"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button v-if="formData.val.status == 0" type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>

  <!-- 待成团订单列表 -->
  <orderList
    v-model:visible="orderListVisible"
    :retail_goods_no="formData.val.retail_goods_no"
    :verify_team_no="formData.val.verify_team_no"
    @relation="addRelationOrder"
  />
</template>


<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, toRaw, onUnmounted } from "vue";
import { FormInstance, ElMessage, ElMessageBox } from "element-plus";
import upload from "../../../components/common/upload.vue";
import pca from "../../../components/common/pca.vue";
import { Delete, Edit, Search, Plus } from "@element-plus/icons-vue";

import orderList from "./order_list.vue";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

const status_list = [
  { label: "正常", value: 1 },
  { label: "未生效", value: 0 },
  { label: "注销", value: 2 },
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

const tableData: any = [
  {
    name: "杨子晨",
    id_card: "441522199710125566",
    birthday: "1997-10-12",
    gender: "男",
    height: "176",
    weight: "100",
  },
  {
    name: "杨子晨",
    id_card: "441522199710125566",
    birthday: "1997-10-12",
    gender: "男",
    height: "176",
    weight: "100",
  },
];


const ruleFormRef = ref<FormInstance>();

const formVisible = ref(false);
// const formData = ref(props.data);
const formData = reactive({
  val: props.data,
});

const dialogTitle = ref("编辑旅行团详情");

let _formData = {
    team_name: "",
    retail_goods_no: "",
    order_list: [],
    order_relations: [],
    status: 0,
  }
// let resetFormData = () => {
//   // formData.val = { ..._formData.value }
//   console.log(_formData, "_formData.value")
//   Object.assign(formData.val, _formData); // 将属性值还原为默认值
// }

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      formData.val.order_list = [];
      formData.val.order_relations.forEach((item) => {
        formData.val.order_list.push(item.order_no);
      });

      if (formData.val.verify_team_no) {
        formData.val = {
          team_name: formData.val.team_name,
          retail_goods_no: formData.val.retail_goods_no,
          order_list: formData.val.order_list,
          verify_team_no: formData.val.verify_team_no,
        };
        rq.fetchPut(apiUrl.UPDATE_VERIFY_TEAM, formData.val).then(
          (res: any) => {
            if (res.status_code == 201 || res.status_code == 204) {
              ElMessage.success("编辑成功");
              formVisible.value = false;
              resetForm(formEl);
              emit("refreshTable", true);
            }
          }
        );
      } else {
        formData.val = {
          team_name: formData.val.team_name,
          retail_goods_no: formData.val.retail_goods_no,
          order_list: formData.val.order_list,
        };
        rq.fetchPost(apiUrl.CREATE_VERIFY_TEAM, formData.val).then(
          (res: any) => {
            if (res.status_code == 201 || res.status_code == 204) {
              ElMessage.success("创建成功");
              formVisible.value = false;
              resetForm(formEl);
              emit("refreshTable", true);
            }
          }
        );
      }
    }
  });
};

const lineData = ref([]);
// 获取全部线路数据
const getLineData = () => {
  rq.fetchGet(apiUrl.GET_ALL_RETAIL_GOODS_LIST, { sales_status: 1 }).then(
    (res) => {
      lineData.value = res.data;
    }
  );
};
getLineData();

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
console.log("props.data", props.data);

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
    formData.val = val;
  }
);

// 正则校验
const rules = {
  team_name: [{ required: true, message: "请输入旅行团名称", trigger: "blur" }],
  retail_goods_no: [
    { required: true, message: "请选择关联线路", trigger: "blur" },
  ],
  order_list: [
    {
      required: true,
      message: "请选择关联订单",
      trigger: "blur",
      type: "array",
      min: 1,
    },
  ],
};

// 核销操作
const handleCloseTour = (index: number) => {
  ElMessageBox.confirm("是否确认删除", "提示", {
    type: "warning",
  })
    .then(() => {
      ElMessage.success("操作成功");
      formData.val.order_relations.splice(index, 1);
    })
    .catch(() => {});
};

const handleVerify = (index: number, row: any) => {
  ElMessageBox.prompt("请输入核销码", "核销确认", {
    confirmButtonText: "核销",
    cancelButtonText: "取消",
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: "无效的核销码",
  }).then(({ value }) => {
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    console.log("userInfo", userInfo);
    let data = {
      verify_team_no: formData.val.verify_team_no,
      order_no: row.order_no,
      verify_code: value,
      verify_uid: userInfo.uid,
    };
    rq.fetchPost(apiUrl.VERIFY_ORDER, data).then((res: any) => {
      if (res.status_code == 201 || res.status_code == 204) {
        ElMessage.success("核销成功");
      } else {
        ElMessage.error("核销码不存在");
      }
    });
  });
};

/* ===================待成团订单列表======================= */
// 是否弹出待成团订单列表弹框
const orderListVisible = ref(false);
// 弹出待成团订单列表弹框
const openOrderListDialog = () => {
  orderListVisible.value = true;
  console.log("orderListVisible", orderListVisible.value);
};

const addRelationOrder = (val) => {
  if (formData.val.order_relations.length > 0) {
    formData.val.order_relations.forEach((item) => {
      val.forEach((it, key) => {
        if (item.order_no == it.order_no) {
          val.splice(key, 1);
        }
      });
    });
  }

  val.forEach((item) => {
    formData.val.order_relations.push(item);
  });
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

// /* 组件卸载状态 */
// onUnmounted(()=>{
//   resetFormData()
// })
</script>
