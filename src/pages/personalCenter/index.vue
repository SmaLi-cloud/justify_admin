<template>
  <a-card class="personal-card">
    <div class="personal-divider">
      <div class="personal-title">修改密码</div>
    </div>
    <a-form
      :form="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit="handleSubmit"
    >
      <a-form-item label="旧密码" prop="oldpwd">
        <a-input
          v-decorator="[
            'oldpwd',
            {
              rules: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
              ],
            },
          ]"
          type="password"
          class="personel-pwd"
        ></a-input>
      </a-form-item>
      <a-form-item label="新密码" prop="newpwd">
        <a-input
          v-decorator="['newpwd', { rules: [{ validator: handleNewpwd }] }]"
          type="password"
          class="personel-pwd"
        ></a-input>
      </a-form-item>
      <a-form-item label="确认密码" prop="confirmpwd">
        <a-input
          v-decorator="[
            'confirmpwd',
            { rules: [{ validator: handleConfirmpwd }] },
          ]"
          type="password"
          class="personel-pwd"
        ></a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit" :loading="loading">
          修改
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    const newpwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("新密码必须填写"));
        return;
      }
      if (value.length < 6) {
        callback(new Error("新密码至少为6个字符."));
        return;
      }
      if (value.length > 128) {
        callback(new Error("新密码必须是最大长度为128的字符串."));
        return;
      }
      let reg = /\d+/;
      if (!reg.test(value)) {
        callback(new Error("新密码至少包含一位数字 ('0'-'9')."));
        return;
      }
      // reg = /[a-z]+/;
      // if (!reg.test(value)) {
      //   callback(new Error('新密码至少包含一位小写字母 (\'a\'-\'z\').'));
      //   return;
      // }
      // reg = /[A-Z]+/;
      // if (!reg.test(value)) {
      //   callback('新密码至少包含一位大写字母 (\'A\'-\'Z\').');
      //   return;
      // }
      // reg = /\W+/;
      // if (!reg.test(value)) {
      //   callback(new Error('密码至少包含一位特殊字符 (@#%^&).'));
      //   return;
      // }

      callback();
    };

    const confirmpwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("确认密码必须填写"));
        return;
      }
      if (this.form.newpwd != value) {
        callback(new Error("确认密码与新密码不一致"));
        return;
      }

      callback();
    };
    return {
      userInfo: {},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form: this.$form.createForm(this, {
        oldpwd: "",
        newpwd: "",
        confirmpwd: "",
      }),
      loading: false,
    };
  },
  methods: {
    ...mapActions("staff", ["changePassword", "logout"]),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.loading = true;
          this.changePassword({
            oldPassword: values.oldpwd,
            newPassword: values.newpwd,
          }).then((res) => {
            this.loading = false;
            if (res.success) {
              this.$message.success("修改成功，请重新登陆！");
              this.logout();
              this.$router.push("/login");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleNewpwd(rule, value, callback) {
      if (!value) {
        callback(new Error("新密码必须填写"));
        return;
      }
      if (value.length < 6) {
        callback(new Error("新密码至少为6个字符."));
        return;
      }
      if (value.length > 128) {
        callback(new Error("新密码必须是最大长度为128的字符串."));
        return;
      }
      let reg = /\d+/;
      if (!reg.test(value)) {
        callback(new Error("新密码至少包含一位数字 ('0'-'9')."));
        return;
      }
      // reg = /[a-z]+/;
      // if (!reg.test(value)) {
      //   callback(new Error('新密码至少包含一位小写字母 (\'a\'-\'z\').'));
      //   return;
      // }
      // reg = /[A-Z]+/;
      // if (!reg.test(value)) {
      //   callback('新密码至少包含一位大写字母 (\'A\'-\'Z\').');
      //   return;
      // }
      // reg = /\W+/;
      // if (!reg.test(value)) {
      //   callback(new Error('密码至少包含一位特殊字符 (@#%^&).'));
      //   return;
      // }

      callback();
    },
    handleConfirmpwd(rule, value, callback) {
      if (!value) {
        callback(new Error("确认密码必须填写"));
        return;
      }
      if (this.form.getFieldValue("newpwd") != value) {
        callback(new Error("确认密码与新密码不一致"));
        return;
      }

      callback();
    },
  },
};
</script>

<style lang="less" scoped>
.personel-pwd {
  font-family: Microsoft YaHei;
}
.personal-item-button {
  text-align: right;
}
</style>