<template>
  <common-layout>
    <!-- <div class="login-logo">
      <SvgIcon iconClass="icon-logo" />
    </div> -->
    <div class="login-box">
      <div class="logo-line"></div>
      <div class="title">您好，欢迎来到<br/>捷配JUSTFIT科技馆管理后台</div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-alert
            type="error"
            :closable="true"
            v-show="error"
            :message="error"
            showIcon
            style="margin-bottom: 24px"
          />
          <a-form-item>
            <a-input
              autocomplete="autocomplete"
              size="large"
              placeholder="请输入员工编号"
              v-decorator="[
                'staffId',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入员工编号',
                      whitespace: true,
                    },
                  ],
                },
              ]"
            >
              <SvgIcon slot="prefix" iconClass="icon-gonghao" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              placeholder="请输入密码"
              autocomplete="autocomplete"
              :style="showPassword ? '' : 'font-family:Microsoft YaHei;'"
              :type="showPassword ? 'input' : 'password'"
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                      whitespace: true,
                    },
                  ],
                },
              ]"
            >
              <SvgIcon slot="prefix" iconClass="icon-mima" />
              <span slot="suffix" @click="showPassword = !showPassword">
                <SvgIcon iconClass="icon-buxianshi" v-if="showPassword" />
                <SvgIcon iconClass="icon-xianshi" v-else />
              </span>
            </a-input>
          </a-form-item>
          <a-form-item>
            <div class="validate-wrap">
              <a-input
                class="validate-input"
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入验证码"
                v-decorator="[
                  'checkCode',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <SvgIcon slot="prefix" iconClass="icon-yanzhengma" />
              </a-input>
              <div><img class="validate-code" :src="checkCodeUrl" @click="changeCheckCode()"/></div>
            </div>
          </a-form-item>
          <a-form-item>
            <div class="login-btn-wrap">
              <a-button
                :loading="logging"
                size="large"
                htmlType="submit"
                type="primary"
                class="login-btn"
                >登录</a-button
              >
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="login-footer">IOT物联网技术支持由捷配智造旗下品牌骐骥智能提供！</div>
  </common-layout>
</template>

<script>
import { getVerifyCode} from '@/services/sys';
import CommonLayout from '@/layouts/CommonLayout';
import { mapMutations, mapActions } from 'vuex';
import { mapState } from 'vuex';
import storage from '@/utils/storage'
import { updateMenuData } from '@/utils/routerUtil'

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      checkCodeUrl: '',
      showPassword: false
    };
  },
  computed: {
    ...mapState('setting', ['footerLinks', 'copyright']),
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  mounted() {
    this.changeCheckCode();
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    ...mapActions('staff', ['login']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const staffId = this.form.getFieldValue('staffId');
          const password = this.form.getFieldValue('password');
          const checkCode = this.form.getFieldValue('checkCode');
          this.login({staffId,password,checkCode}).then(
            (res) => {
              if (res.success) {
                this.$message.success('登录成功', 3);
                updateMenuData();
                this.$router.push('/main');
              } else {
                this.changeCheckCode();
              }
              this.logging = false;
            }
          ).catch(
            (err) => {
              this.logging = false;
              this.error = err.message;
              this.changeCheckCode();
            }
          );
        }
      });
    },
    
    changeCheckCode: function() {
      getVerifyCode().then((res) => {
        storage.set(process.env.VUE_APP_TOKEN_KEY, res.data.voToken);
        this.checkCodeUrl = "data:image/jpg;base64,"  +  res.data.imgData;
      })
      .catch(() => {
        this.logging = false;
      });
    }
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 42px;
    padding-right: 42px;
    height: 48px;
    border-radius: 6px;
  }
  .login-logo {
    position: absolute;
    top: 88px;
    left: 80px;
    .icon {
      width: 234px;
      height: 64px;
    }
  }
  .login-box {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.2);
    width: 440px;
    height: auto;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
    padding: 68px 40px 0;
    box-sizing: border-box;
    border-radius: 16px;
    .logo-line {
      width: 100%;
      height: 4px;
      background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FF9900 100%);
      margin-bottom: 20px;
    }
    .title {
      font-size: 22px;
      line-height: 40px;
      color: #fff;
      margin-bottom: 32px;
    }
  }
  .login-footer {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);
    color: #fff;
  }
  .login {
    width: 100%;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 14px;
      color: @text-color-second;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      margin-left: 4px;
      &:hover {
        color: @primary-color;
      }
    }
    /deep/ .ant-input-affix-wrapper .ant-input-suffix {
      right: 20px;
    }
  }
  .validate-wrap {
    display: flex;
    .validate-input {
      flex: 1;
    }
    .validate-code {
      width: 150px;
      height: 48px;
      background-color: #fff;
      border-radius: 6px;
      margin-left: 10px;
    }
  }
  .login-btn-wrap {
    text-align: center;
  }
  .login-btn {
    margin-top: 16px;
    width: 240px;
    height: 48px;
    border-radius: 24px;
  }
  .validate-code {
    height: 40px;
    border: 1px solid #d9d9d9;
    margin-left: 7px;
  }
}
// @media (max-width: 1200px) {
//   .common-layout {
//     .login-box {
//       width: 100%;
//       height: 600px;
//       .login_left {
//         display: none;
//       }
//       .login_right {
//         width: 100%;
//         float: none;
//         padding: 60px 20px 0;
//         .title {
//           font-size: 20px;
//         }
//       }
//     }
//   }
// }
</style>
