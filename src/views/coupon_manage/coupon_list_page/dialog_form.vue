

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData.val"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="优惠券名称" prop="coupon_name">
        <el-input
          v-model="formData.val.coupon_name"
          :style="{ width: '480px' }"
          placeholder="请输入"
          :disabled="formData.val.coupon_no"
        />
      </el-form-item>
      <el-form-item label="优惠券类型" prop="coupon_type">
        <el-select
          v-model="formData.val.coupon_type"
          clearable
          :style="{ width: '480px' }"
          :disabled="formData.val.coupon_no"
        >
          <el-option
            v-for="(item, index) in couponTypeData"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.val.coupon_type == 'ZK' || formData.val.coupon_type == 'MJ'"
        label="优惠"
        prop="discount_value"
      >
        <el-input
          v-model="formData.val.discount_value"
          type="number"
          :style="{ width: '480px' }"
          placeholder="请输入"
          :disabled="formData.val.coupon_no"
        >
          <template v-if="formData.val.coupon_type == 'MJ'" #prepend>-￥</template>
          <template v-if="formData.val.coupon_type == 'ZK'" #append>折</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="formData.val.coupon_type == 'ZK'" label="优惠上限" prop="discount_upper_limit">
        <el-input
          v-model="formData.val.discount_upper_limit"
          type="number"
          :style="{ width: '480px' }"
          placeholder="请输入"
          :disabled="formData.val.coupon_no"
        />
      </el-form-item>
      <el-form-item label="门槛" prop="threshold">
        <el-input
          v-model="formData.val.threshold"
          type="number"
          :style="{ width: '480px' }"
          placeholder="请输入"
          :disabled="formData.val.coupon_no"
        />
      </el-form-item>
      <el-form-item label="有效期" prop="valid_datetime">
        <el-date-picker
          v-model="formData.val.valid_datetime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled="formData.val.coupon_no"
        />
      </el-form-item>
      <el-form-item label="关联线路" prop="product_join_nos">
        <el-select
          v-model="formData.val.product_join_nos"
          multiple
          placeholder="请选择"
          :style="{ width: '480px' }"
          :disabled="formData.val.coupon_no"
        >
        <el-button v-if="formData.val.product_join_all == 'N'" type="primary" @click="relationAll()" style="margin:10px 20px">
        关联全部
      </el-button>
      <el-button v-else type="primary" @click="cancelRelationAll()" style="margin:10px 20px">
        取消关联全部
      </el-button>
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
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance } from "vue";
import { FormInstance, ElMessage } from "element-plus";
import upload from "../../../components/common/upload.vue";
import pca from "../../../components/common/pca.vue";

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
    value: "ZK",
    label: "折扣",
  },
  {
    value: "MJ",
    label: "满减",
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
// const formData = ref(props.data);
const formData = reactive({
  val: props.data,
});
console.log("formData***++-----", formData.val);
// const textareaValue = ref("");

// // 处理省市区
// let defaultArea = [];
// const provinceSplit = formData.val.province.split(",");
// if (provinceSplit.length > 0) {
//   defaultArea = [provinceSplit[0], provinceSplit[1], provinceSplit[2]];
// }

const dialogTitle = ref("新增优惠券");

// const setImg = (res) => {
//   formData.val.head_img_url = res;
// };

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      console.log("formData.val", formData.val);
      formData.val.valid_s_datetime = formData.val.valid_datetime[0];
      formData.val.valid_e_datetime = formData.val.valid_datetime[1];
      if(formData.val.coupon_type == "ZK"){
        formData.val.discount_value = formData.val.discount_value * 10;
      }

      // if (formData.val.uid) {
      //   rq.fetchPut(apiUrl.update_user, formData.val).then((res: any) => {
      //     if (res.status_code == 204) {
      //       ElMessage.success("编辑成功");
      //       formVisible.value = false;
      //       resetForm(formEl);
      //       emit("refreshTable", true);
      //     }
      //   });
      // } else {
      rq.fetchPost(apiUrl.CREATE_COUPON, formData.val).then((res: any) => {
        if (res.status_code == 201 || res.status_code == 204) {
          ElMessage.success("创建成功");
          formVisible.value = false;
          resetForm(formEl);
          emit("refreshTable", true);
        }
      });
      // }
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
    formData.val.valid_datetime = [formData.val.valid_s_datetime,formData.val.valid_e_datetime]
  }
);

// 正则校验
const rules = {
  coupon_name: [
    { required: true, message: "请输入优惠券名称", trigger: "blur" },
  ],
  coupon_type: [
    { required: true, message: "请输入优惠券类型", trigger: "blur" },
  ],
  discount_value: [{ required: true, message: "请输入优惠", trigger: "blur" }],
  discount_upper_limit: [
    { required: true, message: "请输入优惠上限", trigger: "blur" },
  ],
  threshold: [{ required: true, message: "请输入门槛", trigger: "blur" }],
};

// // 省市区选择后赋值
// const formatPca = (val) => {
//   formData.val.province = val[0] + "," + val[1] + "," + val[2];
// };

const lineData = ref([]);
// 获取全部线路数据
const getLineData = () => {
  // rq.fetchGet(apiUrl.getUserList, { page: query.pageIndex }).then((res) => {
  rq.fetchGet(apiUrl.GET_ALL_RETAIL_GOODS_LIST, { sales_status: 1 }).then(
    (res) => {
      lineData.value = res.data;
    }
  );
};
getLineData();

// 关联全部线路
const relationAll = ()=>{
  formData.val.product_join_all = "Y"
  formData.val.product_join_nos = []
  lineData.value.forEach((item)=>{
    formData.val.product_join_nos.push(item.retail_goods_no)
  })
}
// 取消关联全部线路
const cancelRelationAll = ()=>{
  formData.val.product_join_all = "N"
  formData.val.product_join_nos = []
}
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