

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <!-- <el-form
      ref="ruleFormRef"
      :model="formData.val"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="formData.val.phone"
          :style="{ width: '480px' }"
          placeholder="请输入手机号码"
          :disabled="formData.val.uid"
        />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="formData.val.password"
          :style="{ width: '480px' }"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
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
      </el-form-item>
    </el-form> -->

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
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
// const textareaValue = ref("");

// // 处理省市区
// let defaultArea = [];
// const provinceSplit = formData.val.province.split(",");
// if (provinceSplit.length > 0) {
//   defaultArea = [provinceSplit[0], provinceSplit[1], provinceSplit[2]];
// }

const dialogTitle = ref("权限配置");

const setImg = (res) => {
  formData.val.head_img_url = res;
};

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (formData.val.uid) {
        rq.fetchPut(apiUrl.update_user, formData.val).then((res: any) => {
          if (res.status_code == 201 || res.status_code == 204) {
            ElMessage.success("编辑成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      } else {
        rq.fetchPost(apiUrl.create_user, formData.val).then((res: any) => {
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


</script>
