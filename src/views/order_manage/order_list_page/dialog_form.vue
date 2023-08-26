

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="750"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData.val"
      :rules="rules"
      label-width="120px"
    >
      <div class="order-header">
        <div class="left">
          {{ formatStatusText(formData.val.order_status) }}
        </div>
        <div class="right">订单ID：{{ formData.val.order_no }}</div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="线路信息" name="线路信息">
          <el-form-item label="关联线路名称">
            <div class="text">
              {{ formData.val.retail_goods_list[0].title }}
            </div>
          </el-form-item>
          <el-form-item label="关联线路ID">
            <div class="text">
              {{ formData.val.retail_goods_list[0].retail_goods_no }}
            </div>
          </el-form-item>
          <el-form-item label="SKU">
            <div class="text">
              {{ formData.val.retail_goods_list[0].spec_name }}
            </div>
          </el-form-item>
          <!-- <el-form-item label="成人数量">
            <div class="text">1</div>
          </el-form-item> -->
          <!-- <el-form-item label="儿童数量">
            <div class="text">1</div>
          </el-form-item> -->
        </el-tab-pane>
        <el-tab-pane label="出行人信息" name="出行人信息">
          <div class="novice-type">成人</div>
          <el-table :data="parentTableData" border style="width: 100%">
            <el-table-column prop="user_name" label="姓名" />
            <el-table-column prop="id_card" label="身份证号" width="200" />
            <el-table-column prop="birthday" label="出生日期" />
            <el-table-column prop="sex" label="性别"
              ><template #default="scope">
                {{ scope.row.sex == 1 ? "男" : "女" }}
              </template>
            </el-table-column>
            <el-table-column prop="height" label="身高" />
            <el-table-column prop="weight" label="体重" />
          </el-table>
          <div class="novice-type">儿童</div>
          <el-table :data="childTableData" border style="width: 100%">
            <el-table-column prop="user_name" label="姓名" />
            <el-table-column prop="id_card" label="身份证号" width="200" />
            <el-table-column prop="birthday" label="出生日期" />
            <el-table-column prop="sex" label="性别"
              ><template #default="scope">
                {{ scope.row.sex == 1 ? "男" : "女" }}
              </template>
            </el-table-column>
            <el-table-column prop="height" label="身高" />
            <el-table-column prop="weight" label="体重" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="联系人信息">
          <el-form-item label="姓名">
            <div class="text">{{ formData.val.contact_name }}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div class="text">{{ formData.val.contact_phone }}</div>
          </el-form-item>
          <el-form-item label="微信号">
            <div class="text">{{ formData.val.contact_wx }}</div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="订单明细" name="订单明细">
          <el-form-item label="订单总额">
            <div class="text">￥{{ formData.val.goods_price }}</div>
          </el-form-item>
          <el-form-item label="实付金额">
            <div class="text">￥{{ formData.val.pay_price }}</div>
          </el-form-item>
          <el-form-item label="优惠金额">
            <div class="text">￥{{ formData.val.discount_price }}</div>
          </el-form-item>
          <el-form-item label="优惠券名称">
            <div class="text">{{ formData.val.coupon_info.coupon_name }}</div>
          </el-form-item>
          <!-- <el-form-item label="优惠券ID">
            <div class="text">{{ formData.val.contact_wx }}</div>
          </el-form-item> -->
          <el-form-item label="券码">
            <div class="text">{{ formData.val.coupon_info.coupon_code }}</div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template> -->
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, onMounted } from "vue";
import { FormInstance, ElMessage } from "element-plus";
import upload from "../../../components/common/upload.vue";
import pca from "../../../components/common/pca.vue";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

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

const gender_list = [
  { label: "未知", value: 0 },
  { label: "男", value: 1 },
  { label: "女", value: 2 },
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
// const formData = ref(props.data);
const formData = reactive({
  val: props.data,
});
console.log("formData***++-----", formData.val);
// const textareaValue = ref("");

let parentTableData: any = [
  // {
  //   name: "杨子晨",
  //   id_card: "441522199710125566",
  //   birthday: "1997-10-12",
  //   gender: "男",
  //   height: "176",
  //   weight: "100",
  // },
  // {
  //   name: "杨子晨",
  //   id_card: "441522199710125566",
  //   birthday: "1997-10-12",
  //   gender: "男",
  //   height: "176",
  //   weight: "100",
  // },
];

let childTableData: any = [
  // {
  //   name: "杨小晨",
  //   id_card: "441522199710125566",
  //   birthday: "1997-10-12",
  //   gender: "男",
  //   height: "176",
  //   weight: "100",
  // },
];

const activeName = ref("线路信息");

const dialogTitle = ref("查看订单");

// const setImg = (res) => {
//   formData.val.head_img_url = res;
// };

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (formData.val.uid) {
        rq.fetchPut(apiUrl.update_user, formData.val).then((res: any) => {
          if (res.status_code == 204) {
            ElMessage.success("编辑成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      } else {
        rq.fetchPost(apiUrl.create_user, formData.val).then((res: any) => {
          if (res.status_code == 204) {
            ElMessage.success("创建成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      }
    }
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
    formData.val = val;
    // 出行人信息分类处理
    formData.val.retail_goods_list[0].travel_user_list.forEach((item) => {
      if (item.user_type == 1) {
        parentTableData.push(item);
      } else {
        childTableData.push(item);
      }
    });
  }
);

// 正则校验
const rules = {
  head_img_url: [
    { required: true, message: "请上传用户头像", trigger: "blur" },
  ],
  username: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  remark: [{ required: true, message: "请输入简介", trigger: "blur" }],
};

// // 省市区选择后赋值
// const formatPca = (val) => {
//   formData.val.province = val[0] + "," + val[1] + "," + val[2];
// };

// 格式化状态文字
const formatStatusText = (order_status: number) => {
  let statusName = "";
  statusData.forEach((item) => {
    if (item.value == order_status) {
      statusName = item.label;
    }
  });
  return statusName;
};
</script>

<style lang="scss" scoped>
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #999696;
  .left {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }
  .right {
    font-size: 12px;
    color: #7b7a7a;
  }
}

.demo-tabs {
  .text {
    color: #999696;
  }
  .novice-type {
    font-size: 16px;
    padding: 15px;
  }
}
</style>