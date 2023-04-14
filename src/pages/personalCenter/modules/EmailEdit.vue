<template>
  <CustomModal
    title="修改邮箱"
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
      <a-form-model-item label="" prop="newemail">
        <a-input v-model.trim="form.newemail"></a-input>
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
// import { addMessage } from "@/services/researchCenter/researchCenter";
// import { updateUserDetail } from '@/services/user';
import CustomModal from '../../../components/modal/CustomModal.vue';
export default {
  components: {
    CustomModal
  },
  data() {
    return {
      userInfo:{},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 25 },
      form: {
        newemail: '',
      },
      rules: {
        newemail: [
          { required: true, message: '请填写正确的邮箱', trigger: 'blur',type:'email' },
        ],
      },
    };
  },
  methods: {
    showModal(user) {
      this.userInfo = user;
      this.form.newemail =user?.email;
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // updateUserDetail({
          //   ...this.userInfo,
          //   email:this.form.newemail
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
