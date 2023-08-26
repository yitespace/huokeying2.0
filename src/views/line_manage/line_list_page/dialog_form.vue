

<template>
  <el-dialog
    v-model="formVisible"
    :title="dialogTitle"
    :width="1300"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData.val"
      :rules="rules"
      label-width="100px"
    >
      <div class="block-header">基本属性信息</div>
      <el-form-item label="线路头图" prop="cover_images">
        <UploadImages
          v-model:imgUrl="formData.val.cover_images"
          :disabled="props.data.sales_status == 1"
        ></UploadImages>
      </el-form-item>
      <el-form-item label="线路标题" prop="title">
        <el-input
          v-model="formData.val.title"
          :style="{ width: '480px' }"
          placeholder="请输入"
          :disabled="props.data.sales_status == 1"
        />
      </el-form-item>
      <el-form-item label="购买须知" prop="purchase_notes">
        <el-input
          v-model="formData.val.purchase_notes"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入简介"
          :disabled="props.data.sales_status == 1"
        />
      </el-form-item>
      <el-form-item label="线路详情" prop="line_detail_images">
        <UploadImages
          v-model:imgUrl="formData.val.line_detail_images"
          :disabled="props.data.sales_status == 1"
        ></UploadImages>
      </el-form-item>
      <el-form-item label="行程安排" prop="scheduling_images">
        <UploadImages
          v-model:imgUrl="formData.val.scheduling_images"
          :disabled="props.data.sales_status == 1"
        ></UploadImages>
      </el-form-item>
      <el-form-item label="费用信息" prop="cost_remark_images">
        <UploadImages
          v-model:imgUrl="formData.val.cost_remark_images"
          :disabled="props.data.sales_status == 1"
        ></UploadImages>
      </el-form-item>
      <el-form-item label="预定须知" prop="subscribe_ask_images">
        <UploadImages
          v-model:imgUrl="formData.val.subscribe_ask_images"
          :disabled="props.data.sales_status == 1"
        ></UploadImages>
      </el-form-item>

      <el-form-item label="标签" prop="dynamicTags">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          class="mx-1"
          :closable="props.data.sales_status != 1"
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin-right: 10px"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible && dynamicTags.length < 2"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-if="props.data.sales_status != 1 && dynamicTags.length < 2"
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + 新标签
        </el-button>
      </el-form-item>

      <div class="block-header">售卖属性信息</div>
      <el-form-item label="规格设置">
        <el-button
          v-if="!props.data.retail_goods_no"
          type="primary"
          title="新增"
          @click="addSKU()"
          ><el-icon><Plus /></el-icon
        ></el-button>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="spec_list" border style="width: 100%">
          <el-table-column prop="spec_name" label="规格名称" width="200">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].spec_name"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="sale_price" label="金额">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].sale_price"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="roster_num" label="名额">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].roster_num"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="adult_num" label="成人数量">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].adult_num"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="child_num" label="儿童数量">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].child_num"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="verify_num" label="核销次数">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].verify_num"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column prop="sort_num" label="有效天数">
            <template #default="scope">
              <el-input
                v-model="spec_list[scope.$index].sort_num"
                placeholder="请输入"
                :disabled="props.data.retail_goods_no"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                v-if="!formData.val.retail_goods_no"
                @click="delSKU(scope.$index)"
                v-permiss="16"
              >
                删除
              </el-button>
              <el-button
                v-if="formData.val.retail_goods_no"
                @click="
                  handleSpecStatus(
                    spec_list[scope.$index].retail_goods_sku_id,
                    spec_list[scope.$index].status,
                    scope.$index
                  )
                "
                v-permiss="16"
                :disabled="props.data.retail_goods_no"
              >
                {{ spec_list[scope.$index].status == 1 ? "失效" : "启用" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- <el-form-item label="售卖状态" prop="gender">
        <el-select
          v-model="formData.val.sales_status"
          clearable
          :style="{ width: '480px' }"
          :disabled="formData.val.retail_goods_no && props.data.sales_status != 1"
        >
          <el-option
            v-for="(item, index) in statuslist"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button v-if="props.data.sales_status != 1" type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, nextTick } from "vue";
import { FormInstance, ElMessage, ElInput, ElMessageBox } from "element-plus";
import upload from "../../../components/common/upload.vue";
import pca from "../../../components/common/pca.vue";

import UploadImages from "../../../components/common/UploadImages.vue";
import { Refresh } from "@element-plus/icons-vue/dist/types";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

const status_list = [
  { label: "正常", value: 1 },
  { label: "未生效", value: 0 },
  { label: "注销", value: 2 },
];

const statuslist = [
  { label: "上架", value: 1 },
  { label: "下架", value: 2 },
];

// const gender_list = [
//   { label: "未知", value: 0 },
//   { label: "男", value: 1 },
//   { label: "女", value: 2 },
// ];

const spec_list: any = ref([]);

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

const dialogTitle = ref("新建线路");

// const setImg = (res) => {
//   console.log("res", res);
//   formData.val.head_img_url = res;
// };

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log("spec_list", spec_list);
  if (!formEl) return;
  await formEl.validate((valid) => {
    formData.val.labels_group = dynamicTags.value.join(",");
    formData.val.spec_list = spec_list;
    formData.val.spec_list.map((item) => {
      item.adult_num = Number(item.adult_num);
      item.child_num = Number(item.child_num);
      item.roster_num = Number(item.roster_num);
      item.sale_price = Number(item.sale_price);
      item.sort_num = Number(item.sort_num);
      item.verify_num = Number(item.verify_num);

      return;
    });
    if (valid) {
      if (formData.val.retail_goods_no) {
        // 编辑
        // delete formData.val.spec_list;
        rq.fetchPut(apiUrl.UPDATE_RETAIL_GOODS, formData.val).then(
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
        // 创建
        rq.fetchPost(apiUrl.CREATE_RETAIL_GOODS, formData.val).then(
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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emit = defineEmits(["update:visible", "refreshTable"]);

// 正则校验
const rules = {
  cover_images: [
    { required: true, message: "请上传线路头图" },
  ],
  title: [{ required: true, message: "请输入线路标题", trigger: "change" }],
  purchase_notes: [{ required: true, message: "请输入购买须知", trigger: "change" }],
  line_detail_images: [{ required: true, message: "请上传线路详情" }],
  scheduling_images: [{ required: true, message: "请上传行程安排" }],
  cost_remark_images: [{ required: true, message: "请上传费用信息" }],
  subscribe_ask_images: [{ required: true, message: "请上传预定须知" }],
  sales_status: [{ required: true, message: "请选择售卖状态", trigger: "change" }],
};

// // 省市区选择后赋值
// const formatPca = (val) => {
//   formData.val.province = val[0] + "," + val[1] + "," + val[2];
// };

/* ===============================标签=============================== */
const inputValue = ref("");
// const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const dynamicTags = ref([]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

/* ================================规格设置============================== */
// 添加规格
const addSKU = () => {
  console.log("add");
  spec_list.value.push({
    spec_name: "",
    sale_price: 0.0,
    roster_num: 0,
    adult_num: "",
    child_num: 0,
    verify_num: 0,
    sort_num: 0,
  });
  console.log("spec_list.value", spec_list.value);
};

// 删除规格
const delSKU = (index) => {
  spec_list.value.splice(index, 1);
};

// 操作修改规格状态
const handleSpecStatus = (
  retail_goods_sku_id: string,
  status: number,
  index: number
) => {
  let tip = status == 1 ? "失效" : "启用";
  ElMessageBox.confirm(`是否修改该规格状态为${tip}？`, "提示", {
    type: "warning",
  })
    .then(() => {
      status = status == 1 ? 0 : 1;
      rq.fetchPut(apiUrl.UPDATE_SPEC_STATUS, {
        retail_goods_sku_id,
        status,
      }).then((res) => {
        ElMessage.success("操作成功");
        spec_list[index].status = status;
      });
    })
    .catch(() => {});
};

/* =========================监听============================ */
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
    dialogTitle.value = formData.val.retail_goods_no ? "编辑线路" : "新建线路";
    spec_list.value = formData.val.spec_list;
    dynamicTags.value = formData.val.labels_group.split(",");
  }
);
</script>

<style lang="scss" scoped>
.block-header {
  width: calc(100% - 30px);
  text-align: left;
  padding-left: 10px;
  height: 30px;
  background: #f2f2f2;
  line-height: 30px;
  margin: 0 10px;
  margin-bottom: 20px;
  display: inline-block;
}
</style>