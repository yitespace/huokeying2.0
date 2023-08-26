

<template>
    <!-- 单图上传，多图用UploadImages组件 -->
  <el-upload
    class="avatar-uploader"
    action="https://up-z2.qiniup.com"
    :data="uploadData"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
    <el-image v-if="imageUrl" :src="imageUrl" fit="cover" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    <el-icon
      v-if="imageUrl"
      class="avatar-uploader-icon-view"
      @click.stop="handlePictureCardPreview"
      ><View
    /></el-icon>
    <el-icon
      v-if="imageUrl"
      class="avatar-uploader-icon-delete"
      @click.stop="handleRemove"
      ><Delete
    /></el-icon>
  </el-upload>
  <div v-if="isPreview" class="preview-box">
    <el-icon class="close-icon" @click="handlePictureCardPreview"
      ><CircleClose
    /></el-icon>
    <el-image :src="imageUrl" class="preview-img" />
  </div>
</template>
  
  
  
  <script lang="ts" setup>
import { ref, getCurrentInstance} from "vue";
import { ElMessage } from "element-plus";
import { Plus, View, Delete, CircleClose } from "@element-plus/icons-vue";

import type { UploadProps } from "element-plus";

/* 网络请求 */
const { proxy } = getCurrentInstance();
const rq = proxy.$rq; // 请求方法
const apiUrl = proxy.$apiUrl; // api地址

/* 接收父组件传参 */
const props = defineProps({
    imgUrl: {
    type: String,
    default: ""
  },
});

// /* 定义发送给父组件的方法 */
// const emits = defineEmits(["img"]);

/* 定义发送给父组件的方法 */
const emits = defineEmits(["update:imgUrl"]);

// 图片地址
// const imageUrl = ref("");
const imageUrl = ref(props.imgUrl);

/* 图片上传成功回调 */
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log("response", response);
  if (response.key) {
    imageUrl.value = visit_url + response.key; // https://xxxx.com 为回显图片的地址，在七牛上配置的映射地址
    console.log('imageUrl.value',imageUrl.value)
    // emits('img', imageUrl.value) // 返回图片地址给父组件
    emits("update:imgUrl", imageUrl.value); // 返回图片地址给父组件
} else {
    ElMessage.error(response.msg);
  }
};

/* 图片上传前处理 */
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //   if (rawFile.type !== "image/jpeg") {
  //     ElMessage.error("Avatar picture must be JPG format!");
  //     return false;
  //   } else
  //   if (rawFile.size / 1024 / 1024 > 2) {
  //     ElMessage.error("Avatar picture size can not exceed 2MB!");
  //     return false;
  //   }

  console.log("rawFile", rawFile);

  uploadData.key = rawFile.uid + rawFile.name;

  return true;
};

const uploadData = { key: "", token: "" };
// token、 地址
let visit_url = "";
// 获取七牛地址
const getToken = () => {
  rq.fetchGet(apiUrl.getQNToken).then((res) => {
    if (res) {
      // this.uploadData.key = file.uid + file.name;
      uploadData.token = res.data.token;
      visit_url = res.data.visit_url;
      console.log("uploadData", uploadData);
      console.log("visit_url", visit_url);
    } else {
      uploadData.key = "";
      uploadData.token = "";
    }
  });
};
getToken();

/* 预览图片 */
const isPreview = ref(false);
const handlePictureCardPreview = () => {
  isPreview.value = !isPreview.value;
};

/* 删除图片 */
const handleRemove = () => {
  imageUrl.value = "";
};
</script>




<style lang="scss">
/* .avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
} */

.el-icon.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

// /deep/.el-upload {
//   width: 98px !important;
//   height: 98px !important;
// }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 20px;
  height: 20px;
  line-height: 98px;
  text-align: center;
}
.avatar-uploader-icon-delete {
  font-size: 18px;
  color: #8c939d;
  width: 20px;
  height: 20px;
  line-height: 98px;
  text-align: center;
  position: absolute;
  top: 42%;
  right: 20%;
}
.avatar-uploader-icon-view {
  font-size: 18px;

  color: #8c939d;
  width: 20px;
  height: 20px;
  line-height: 98px;
  text-align: center;
  position: absolute;
  top: 42%;
  left: 20%;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

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
}

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
</style>