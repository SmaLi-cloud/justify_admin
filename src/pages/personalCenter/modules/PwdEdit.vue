<template>
  <CustomModal
    title="修改密码"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
        <a-form-model-item label="旧密码" prop="oldpwd">
           <a-input v-model.trim="form.oldpwd" type="password" class="personel-pwd"  ></a-input>
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newpwd">
            <a-input v-model.trim="form.newpwd" type="password" class="personel-pwd"></a-input>
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="confirmpwd">
            <a-input v-model.trim="form.confirmpwd" type="password" class="personel-pwd"></a-input>
        </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
// import { changePassword } from '@/services/user';
export default {
  components: {
  },
  data() {
    const newpwd = (rule, value, callback) => {

      if (!value) {
        callback(new Error('新密码必须填写'));
        return;
      }
      if (value.length < 6) {
        callback(new Error('新密码至少为6个字符.'));
        return;
      }
      if (value.length > 128) {
        callback(new Error('新密码必须是最大长度为128的字符串.'));
        return;
      }
      let reg = /\d+/;
      if (!reg.test(value)) {
        callback(new Error('新密码至少包含一位数字 (\'0\'-\'9\').'));
        return;
      }
      reg = /[a-z]+/;
      if (!reg.test(value)) {
        callback(new Error('新密码至少包含一位小写字母 (\'a\'-\'z\').'));
        return;
      }
      reg = /[A-Z]+/;
      if (!reg.test(value)) {
        callback('新密码至少包含一位大写字母 (\'A\'-\'Z\').');
        return;
      }
      reg = /\W+/;
      if (!reg.test(value)) {
        callback(new Error('密码至少包含一位特殊字符 (@#%^&).'));
        return;
      }

      callback();
    };

    const confirmpwd = (rule, value, callback) => {    

      if (!value) {
        callback(new Error('确认密码必须填写'));
        return;
      }
      if(this.form.newpwd != value) {
        callback(new Error('确认密码与新密码不一致'));
        return;
      }

      callback();
    };
    return {
      userInfo:{},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form: {       
      },
      rules: {
        oldpwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        newpwd: [
          { validator: newpwd, trigger: ['blur', 'change'] }
        ],
        confirmpwd: [
          { validator: confirmpwd, trigger: ['blur', 'change'] }
        ]
      },
    };
  },
  methods: {
    showModal(user) {
      this.userInfo = user;
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // changePassword({
          //   currentPassword: this.form.oldpwd,
          //   newPassword: this.form.newpwd
          // })
          //   .then((res) => {
          //     this.visible = false;
          //     this.$message.success('提交成功！');
          //     this.$emit('ok');
          //   })
          //   .finally(() => {
          //     this.loading = false;
          //   });
        }
      });
    },
    handleCancel() {
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
  },
};
</script>
<style scoped>
.personel-pwd {
    font-family:Microsoft YaHei;
}
</style>