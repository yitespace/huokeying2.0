

<template>
  <el-cascader
    v-model="selectedArea.val"
    :options="area"
    :props="optionsProps"
    @change="changeValue"
  />
</template>
    
    
    
    <script lang="ts" setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";

import area from "./area";

/* 网络请求 */
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

/* 接收父组件传参 */
const props = defineProps({
  defaultArea: {
    type: String,
    default: ""
  },
});

/* 定义发送给父组件的方法 */
const emits = defineEmits(["formatPca"]);

const selectedArea = reactive({
    val: []
});

onMounted(() => {
  const provinceSplit = props.defaultArea.split(",");
  if (provinceSplit.length > 0) {
    selectedArea.val = [provinceSplit[0], provinceSplit[1], provinceSplit[2]];
  }
});

const optionsProps = {
  value: "label",
};

const changeValue = (val) => {
  selectedArea.value = val;
  emits("formatPca", val);
};
</script>
  
  