<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">火客营后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <!-- <el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item> -->
        <el-form-item prop="phone">
          <el-input v-model="param.phone" placeholder="请输入用户手机号">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { useTagsStore } from "../store/tags";
import { usePermissStore } from "../store/permiss";
import { useUserInfoStore } from "../store/userInfo";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
// import { loginApi } from "../api/index";
import Cookies from "js-cookie";

// 网络请求
const { proxy } = getCurrentInstance();
const rq = proxy.$rq;
const apiUrl = proxy.$apiUrl;

interface LoginInfo {
  phone: string;
  password: string;
}

const router = useRouter();

onMounted(() => {
  Cookies.remove("TOKEN");
});

const param = reactive<LoginInfo>({
  // username: 'admin',
  // password: '123123'
  phone: "", //13800138000
  password: "", //123456
});

const rules: FormRules = {
  phone: [
    {
      required: true,
      message: "请输入用户手机号",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const permiss = usePermissStore();
const userInfoStore = useUserInfoStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      //   loginApi({
      rq.fetchPost(apiUrl.loginUrl, {
        phone: param.phone,
        password: param.password,
        token_key: "ajj_shop_admin",
      }).then((res) => {
        if (res.status_code == 200) {
          console.log("success", res);
          ElMessage.success("登录成功");
          userInfoStore.handleLogin(
            res.data,
            param.phone,
            param.password,
            "ajj_shop_admin"
          );

          // 权限相关
          localStorage.setItem("ms_username", param.username);
          //   const keys =
          //     permiss.defaultList[param.username == "admin" ? "admin" : "user"];
          const keys = permiss.defaultList["admin"];
          permiss.handleSet(keys);
          localStorage.setItem("ms_keys", JSON.stringify(keys));

          // 跳转首页
          router.push("/");
        } else {
          console.log("err", res);
          ElMessage.error(res.message);
        }
      });
    } else {
      ElMessage.error("请填写登录信息");
      return false;
    }
  });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-image: linear-gradient(45deg,rgb(136, 176, 236),rgb(119, 154, 206),rgb(74, 95, 128),rgb(50 65 87),rgb(42, 54, 73));
  /* background-image: radial-gradient(#333333,#333333,#bbaf0a,#333333,#174a7e,#52769b,#7e6767,#333333); */
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
