

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
      <el-form-item label="教练头像" prop="head_img_url">
        <!-- <upload :imgUrl="formData.val.head_img_url" @img="setImg"></upload> -->
        <upload v-model:imgUrl="formData.val.head_img_url"></upload>
      </el-form-item>
      <el-form-item label="教练名称" prop="coach_name">
        <el-input
          v-model="formData.val.coach_name"
          :style="{ width: '480px' }"
          placeholder="请输入教练名称"
        />
      </el-form-item>
      <el-form-item label="教练描述" prop="description">
        <el-input
          v-model="formData.val.description"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入教练描述"
        />
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


const dialogTitle = ref("新建教练");

const setImg = (res) => {
  formData.val.head_img_url = res;
};

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (formData.val.coach_no) {
        rq.fetchPut(apiUrl.UPDATE_COACH, formData.val).then((res: any) => {
          if (res.status_code == 201 || res.status_code == 204) {
            ElMessage.success("编辑成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      } else {
        rq.fetchPost(apiUrl.CREATE_COACH, formData.val).then((res: any) => {
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
    dialogTitle.value = formData.val.coach_no ? "编辑教练" : "新建教练"
  }
);

// 正则校验
const rules = {
  head_img_url: [
    { required: true, message: "请上传教练头像", trigger: "blur" },
  ],
  coach_name: [{ required: true, message: "请输入教练名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入教练描述", trigger: "blur" }],
};

// 省市区选择后赋值
const formatPca = (val) => {
  formData.val.province = val[0] + "," + val[1] + "," + val[2];
};
</script>

<!-- <style lang="scss" scoped>
@import "../../../style/constant.scss";
.parent{
  color: $color-red;
  .child{
    color: green;
  }
}
</style> -->