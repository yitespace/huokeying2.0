<template>
  <!-- 多图上传，单图用upload组件 -->
  <el-upload
    v-model:file-list="fileList"
    action="http://upload-z2.qiniup.com"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :auto-upload="true"
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
    :data="uploadData"
    :disabled="disabled"
    :limit="9"
  >
    <el-icon>
      <Plus />
    </el-icon>
  </el-upload>

  <!-- <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog> -->

  <div v-if="dialogVisible" class="preview-box">
    <el-icon class="close-icon" @click="dialogVisible = false"
      ><CircleClose
    /></el-icon>
    <el-image :src="dialogImageUrl" class="preview-img" />
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElUpload } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
// import store from "@/store";

/* 网络请求 */
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

/* 接收父组件传参 */
const props = defineProps({
  // imgUrl: {
  //   type: Array,
  //   default: [],
  // },
  imgUrl: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
/* 定义发送给父组件的方法 */
const emits = defineEmits(["update:imgUrl"]);

// url列表
const imgArr = props.imgUrl ? props.imgUrl.split(",") : [];
console.log("imgArr", imgArr);
// const picURL: any = ref([]);
const picURL: any = ref(imgArr);

let files = [];
imgArr.forEach((item) => {
  files.push({ url: item });
});

// 图片列表
const fileList: any = ref<UploadUserFile[]>(
  //   [
  //   // {
  //   //   name: 'food.jpeg',
  //   //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  //   // },
  // ]
  files
);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 选中的图片地址列表
let srcList = [];

// const uploadData: any = ref({
// //   token: store.getters.uploadToken,
//   // token: '4_aYuuFk0q5GAyaqtBNzSV-UvNG2knaHD88zr2cf:aS203tsgXrGNADSNTcLcRHOecTc=:eyJzY29wZSI6ImVjb20iLCJkZWFkbGluZSI6MTY3ODc2NTU2MX0=',
//   key: null,
// });

onMounted(() => {
  console.log("渲染完成");
  srcList = props.imgUrl ? props.imgUrl.split(",") : [];
});

let uploadData = { key: "", token: "" };
// token、 地址
let visit_url = "";
// 获取七牛地址
const getToken = () => {
  rq.fetchGet(apiUrl.getQNToken).then((res) => {
    if (res) {
      // this.uploadData.key = file.uid + file.name;
      uploadData.token = res.data.token;
      visit_url = res.data.visit_url;
      // console.log("uploadData", uploadData);
      // console.log("visit_url", visit_url);
    } else {
      uploadData.key = "";
      uploadData.token = "";
    }
  });
};
getToken();

// 删除图片
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log("fileList", fileList);
  console.log(uploadFile, uploadFiles);
  srcList.forEach((item, index) => {
    if (item == uploadFile.url) {
      console.log("remove", item, uploadFile.url);
      srcList.splice(index, 1);
    }
  });
  let srcLists = "";
  srcLists = srcList.join(",");
  emits("update:imgUrl", srcLists); // 返回图片地址给父组件
};

// 放大
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
// 上传之前
const beforeAvatarUpload = (file: any) => {
  const isLt2M = file.size / 1024 / 1024 < 5;
  const fileName = file.name;

  // if (!isJPG) {
  //   ElMessage.error('头像必须是JPG格式!')
  // }
  if (!isLt2M) {
    ElMessage.error("图片必须小于5MB!");
  }
  uploadData.key = fileName;
  // return isJPG && isLt2M
  return isLt2M;
};

// 上传成功
const handleAvatarSuccess = (res: any, file: any) => {
  let src = visit_url + res.key;
  picURL.value.push({
    name: uploadData.key,
    // url: `${`http://qiniu.ecom20200909.com/${uploadData.value.key}`}`,
    url: src,
  });
  // console.log('visit_url + res.key',visit_url + res.key)
  // console.log(fileList.value, "图片列表");
  // console.log(picURL.value, "url列表");
  srcList.push(src);
  let srcLists = "";
  srcLists = srcList.join(",");
  console.log("props.imgUrl", props.imgUrl);
  console.log("srcLists--", srcLists);
  // emits("update:imgUrl", srcLists); // 返回图片地址给父组件
  // srcLists = props.imgUrl ? props.imgUrl + "," + srcLists : srcLists
  emits("update:imgUrl", srcLists); // 返回图片地址给父组件
  // emits("update:imgUrl", props.imgUrl + "," + srcLists); // 返回图片地址给父组件
  console.log("srcLists", srcLists);
  files = [];
  srcList.forEach((item,index) => {
    // files.push({ url: item });
    fileList.value[index].url = item
  });
};
</script>
  
<style lang="scss" scoped>
.preview-box {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--el-overlay-color-lighter);
  z-index: 99999;
  .close-icon {
    position: absolute;
    top: 100px;
    right: 100px;
    font-size: 36px;
    color: white;
    cursor: pointer;
  }
  .preview-img {
    // position: absolute;
    // top: 20%;
    height: 50%;
    background-color: white;
    // margin: 0 auto;
  }
}
</style>