

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
      label-width="120px"
    >
      <el-form-item label="名称" prop="column_name">
        <el-input
          v-model="formData.val.column_name"
          :style="{ width: '480px' }"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="formData.val.sort_num" :min="1" :step="1" />
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

const dialogTitle = ref("分类管理");

// const setImg = (res) => {
//   formData.val.head_img_url = res;
// };

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {

      if (formData.val.id) {
        rq.fetchPut(apiUrl.UPDATE_GOODS_COLUMN, formData.val).then((res: any) => {
          if (res.status_code == 201 || res.status_code == 204) {
            ElMessage.success("编辑成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      } else {
        rq.fetchPost(apiUrl.CREATE_GOODS_COLUMN, formData.val).then((res: any) => {
          if (res.status_code == 201 || res.status_code == 204) {
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
    dialogTitle.value = formData.val.id ? "编辑分类" : "新建分类";
    // let retail_goods = []
    // formData.val.retail_goods.forEach((item)=>{
    //   retail_goods.push(item.retail_goods_no)
    // })
    // formData.val.goods_nos = retail_goods
  }
);

// 正则校验
const rules = {
  column_name: [
    { required: true, message: "请输入名称", trigger: "blur" },
  ],
};

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
const relationAll = () => {
  formData.val.topic_related_all_goods = "Y";
  formData.val.goods_nos = [];
  lineData.value.forEach((item) => {
    formData.val.goods_nos.push(item.retail_goods_no);
  });
};
// 取消关联全部线路
const cancelRelationAll = () => {
  formData.val.topic_related_all_goods = "N";
  formData.val.goods_nos = [];
};
</script>
