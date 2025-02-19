<template>
  <div class="login-container">
    <div class="background">
      <!-- 背景图片 -->
    </div>
    <div class="header-text">
      <span>南京市古树名木</span>
      <br />
      <span>数字化智慧管理平台</span>
    </div>
    <el-card class="login-card">
      <div slot="header" class="login-header">
        <span>{{ isRegister ? '用户注册' : '账号登录' }}</span>
      </div>
      <el-form :model="form" ref="form" label-width="0" class="login-form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <!-- 添加确认密码输入框 -->
        <el-form-item v-if="isRegister">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" />
          <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="error-message">
            两次密码输入不一致
          </div>
        </el-form-item>

        <el-form-item v-if="isRegister">
          <el-input v-model="form.telephone" type="number" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item v-if="isRegister">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item v-if="isRegister">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit"
            :disabled="isRegister && (!form.agreeToTerms || form.password !== form.confirmPassword)">
            {{ isRegister ? '注册' : '登录' }}
          </el-button>
        </el-form-item>

        <el-form-item v-if="isRegister">
          <el-checkbox v-model="form.agreeToTerms" class="terms-checkbox">
            我同意
            <span @click.prevent="showTerms" class="terms-link">《注册条款》</span>
          </el-checkbox>
          <div v-if="!form.agreeToTerms" class="error-message">
            必须同意注册条款才能注册
          </div>
        </el-form-item>

        <div class="login-footer">
          <span @click="toggleForm" class="toggle-link">
            {{ isRegister ? '已有账号，去登录' : '用户注册' }}
          </span> |
          <span>忘记密码?</span>
        </div>
      </el-form>
    </el-card>

    <!-- 用户条款弹出框 -->
    <el-dialog title="用户注册条款" v-model="termsVisible" width="50%" :before-close="closeTermsDialog">
      <div class="terms-content">
        <h3>南京市古树名木数字化智慧管理平台 用户注册条款</h3>
        <p>欢迎您使用南京市古树名木数字化智慧管理平台（以下简称“本平台”）。为了保障您的合法权益，您在注册并使用本平台前，请仔细阅读并遵守以下用户条款。注册本平台即表示您同意遵守本条款及相关法律法规的约束。</p>

        <h4>一、总则</h4>
        <p>1.1 本条款适用于南京市古树名木数字化智慧管理平台（包括但不限于本平台的所有功能和服务）。</p>
        <p>1.2 用户应保证在使用本平台时，遵守中华人民共和国的法律、法规、规章及南京市的相关规定，遵守社会公德，尊重他人权利。</p>

        <h4>二、用户账户管理</h4>
        <p>2.1 用户在本平台注册时需提供准确、真实的个人信息（包括但不限于姓名、联系方式、身份信息等），并保持信息的实时更新。如因用户提供虚假信息而导致的后果，本平台不承担责任。</p>
        <p>2.2 用户注册成功后，本平台会为其分配一个唯一的账户及密码。用户应妥善保管账户信息和密码，如发现账户被盗用，用户应立即通知本平台，并可通过平台提供的安全渠道进行账户冻结。</p>

        <h4>三、使用规则</h4>
        <p>3.1 用户在使用本平台时，必须遵守南京市古树名木管理条例、中华人民共和国的相关法律法规，以及本平台的使用规定。</p>
        <p>3.2 用户不得利用本平台从事任何违法活动，包括但不限于传播违法信息、侵犯他人隐私、恶意攻击平台等行为。</p>

        <h4>四、个人隐私保护</h4>
        <p>4.1 本平台非常重视用户的隐私保护。我们将采取合理的技术手段保护用户个人信息的安全，未经用户授权，本平台不会泄露、出售或分享用户的个人信息。</p>
        <p>4.2 用户同意本平台根据国家法律及相关政策要求，在必要时披露其个人信息，例如配合司法机关调查等。</p>

        <h4>五、知识产权</h4>
        <p>5.1 本平台及相关服务的所有内容、界面设计、程序代码、数据库等，均属于本平台及其合作方的知识产权，未经授权，用户不得复制、修改、传播或以任何方式使用。</p>
        <p>5.2 用户提交的所有数据和内容（包括但不限于上传的图片、视频、评论等）都应遵循知识产权相关规定，若涉及第三方知识产权纠纷，由用户自行负责。</p>

        <h4>六、责任和免责</h4>
        <p>6.1 本平台将尽最大努力保证平台服务的正常运行，但由于不可抗力因素或技术问题等原因，可能会导致平台服务中断或数据丢失。平台不承担因这些原因导致的任何损失。</p>
        <p>6.2 本平台不对用户因违反本条款而造成的任何损失或法律责任负责。</p>

        <h4>七、用户条款修改</h4>
        <p>7.1 本平台有权随时修改本用户注册条款，并通过平台公告的方式通知用户。修改后的条款将在公告发布后立即生效，用户如继续使用平台服务，即视为同意新修订的条款。</p>

        <h4>八、法律适用及争议解决</h4>
        <p>8.1 本条款的订立、执行及解释均适用中华人民共和国法律。</p>
        <p>8.2 因本条款引起的或与本条款有关的争议，双方应友好协商解决；协商不成时，任何一方可提交南京市人民法院管辖。</p>

        <p>感谢您对南京市古树名木数字化智慧管理平台的支持与信任。如您有任何问题或建议，请随时与我们联系。</p>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="termsVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import { ElForm, ElFormItem, ElInput, ElButton, ElCard, ElCheckbox, ElDialog, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useCounterStore } from "../stores/counter"

export default {
  name: "Login",
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElCard,
    ElCheckbox,
    ElDialog,
    ElMessage,
  },
  data() {
    return {
      isRegister: false, // 控制是否是注册界面
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        telephone: '',
        email: '',
        address: '',
        rememberMe: false,
      },
      usernameRules: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应在3到20个字符之间', trigger: 'blur' },
      ],
      passwordRules: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6到20个字符之间', trigger: 'blur' },
      ],
      confirmPasswordRules: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: this.validateConfirmPassword, trigger: 'blur' },
      ],
      termsVisible: false, // 控制用户条款弹出框的显示与隐藏
    };
  },
  methods: {
    toggleForm() {
      this.isRegister = !this.isRegister; // 切换登录/注册表单
    },

    async handleSubmit() {
      if (this.isRegister) {
        this.handleRegister();
      } else {
        this.handleLogin();
      }
    },

    // 登录方法
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:4000/login", {
          username: this.form.username,
          password: this.form.password,
        });

        if (response.data.message === "登录成功") {
          const userData = response.data.username;
          console.log(userData);

          const userStore = useCounterStore();
          userStore.setUsername(userData);

          ElMessage.success("登录成功！"); // 登录成功的提示
          this.$router.push("/home");
        } else {
          alert("用户名或密码错误");
        }
      } catch (error) {
        console.error("登录请求失败:", error);
        alert("登录请求失败，请稍后再试");
      }
    },

    handleRegister() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 发送注册请求
          await this.registerUser();
        } else {
          console.log('表单验证失败');
        }
      });
    },

    validateConfirmPassword(rule, value, callback) {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },

    async registerUser() {
      try {
        const response = await axios.post('http://localhost:4000/register', {
          username: this.form.username,
          password: this.form.password,
          telephone: this.form.telephone, // 手机号字段
          email: this.form.email,         // 邮箱字段
          address: this.form.address,     // 地址字段
        });
        if (response.data === '注册成功') {
          this.$router.push('/home');
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('注册请求失败:', error);
        alert('注册请求失败，请稍后再试');
      }
    },


    // 显示用户条款弹窗
    showTerms() {
      console.log("用户条款弹窗被触发");
      this.termsVisible = true;
    },


    // 关闭用户条款弹窗
    closeTermsDialog() {
      this.termsVisible = false;
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/images/background.png");
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.header-text {
  position: absolute;
  top: 30px;
  left: 50px;
  color: #ffffff;
  font-size: 33px;
  font-weight: bold;
  line-height: 1.5;
  z-index: 1;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  max-width: 100%;
  box-sizing: border-box;
}

.login-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
}

.login-footer {
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
}

.terms-checkbox {
  margin-left: 5px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
}

.el-button:disabled {
  background-color: #d3d3d3;
  border-color: #d3d3d3;
}

.toggle-link {
  cursor: pointer;
  color: #409eff;
  transition: color 0.3s;
}

.toggle-link:hover {
  color: #66b1ff;
}

.terms-link {
  color: #409eff;
  cursor: pointer;
}

.terms-link:hover {
  text-decoration: underline;
}


/* 弹窗背景 */
.el-dialog {
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 弹窗标题 */
.el-dialog .el-dialog__header {
  background-color: #409eff;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  border-radius: 10px 10px 0 0;
  padding: 10px;
}

/* 弹窗主体内容 */
.terms-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
  height: 400px;
  overflow-y: auto;
}

/* 关闭按钮 */
.el-button {
  background-color: #409eff;
  color: #ffffff;
  border: none;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #66b1ff;
}

/* 弹窗脚部 */
.dialog-footer {
  text-align: center;
  padding: 15px;
}
</style>
