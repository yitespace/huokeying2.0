

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
      <el-form-item label="icon" prop="icon_url">
        <upload v-model:imgUrl="formData.val.icon_url"></upload>
        <div style="margin-left: 20px">图像尺寸：670*200 建议使用2倍图</div>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.val.name"
          :style="{ width: '480px' }"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="头图" prop="cover_img_url">
        <upload v-model:imgUrl="formData.val.cover_img_url"></upload>
        <div style="margin-left: 20px">图像尺寸：686*310 建议使用2倍图</div>
      </el-form-item>
      <el-form-item label="关联线路" prop="goods_nos">
        <el-select
          v-model="formData.val.goods_nos"
          multiple
          placeholder="请选择"
          :style="{ width: '480px' }"
        >
          <el-button
            v-if="formData.val.related_all_goods == 'N'"
            type="primary"
            @click="relationAll()"
            style="margin: 10px 20px"
          >
            关联全部
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="cancelRelationAll()"
            style="margin: 10px 20px"
          >
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
      <!-- <el-form-item label="排序">
        <el-input-number v-model="formData.val.sort" :min="1" :step="1" />
      </el-form-item> -->
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

const dialogTitle = ref("编辑金刚区");

// const setImg = (res) => {
//   formData.val.head_img_url = res;
// };

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // if (formData.val.target_type == "TOPIC" && !formData.val.cover_img_url) {
      //   return ElMessage.error("请选择专题头图");
      // }

      // if (formData.val.id) {
        rq.fetchPut(apiUrl.UPDATE_QUICK_LINK, formData.val).then((res: any) => {
          if (res.status_code == 201 || res.status_code == 204) {
            ElMessage.success("编辑成功");
            formVisible.value = false;
            resetForm(formEl);
            emit("refreshTable", true);
          }
        });
      // } else {
      //   rq.fetchPost(apiUrl.CREATE_BANNER, formData.val).then((res: any) => {
      //     if (res.status_code == 201 || res.status_code == 204) {
      //       ElMessage.success("创建成功");
      //       formVisible.value = false;
      //       resetForm(formEl);
      //       emit("refreshTable", true);
      //     }
      //   });
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
    let retail_goods = []
    formData.val.retail_goods.forEach((item)=>{
      retail_goods.push(item.retail_goods_no)
    })
    formData.val.goods_nos = retail_goods
  }
);

// 正则校验
const rules = {
  icon_url: [{ required: true, message: "请上传icon", trigger: "blur" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  target_type: [{ required: true, message: "请选择类型", trigger: "blur" }],
  cover_img_url: [{ required: true, message: "请上传头图", trigger: "blur" }],
  goods_nos: [
    { required: true, message: "请选择专题关联线路", trigger: "blur" },
  ],
  retail_goods_no: [
    { required: true, message: "请选择关联线路", trigger: "blur" },
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
  formData.val.related_all_goods = "Y";
  formData.val.goods_nos = [];
  lineData.value.forEach((item) => {
    formData.val.goods_nos.push(item.retail_goods_no);
  });
};
// 取消关联全部线路
const cancelRelationAll = () => {
  formData.val.related_all_goods = "N";
  formData.val.goods_nos = [];
};
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