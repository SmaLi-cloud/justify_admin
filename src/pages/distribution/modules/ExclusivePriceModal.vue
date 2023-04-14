<template>
  <CustomModal
    title="分销商认证审核"
    :visible="visible"
    :destroyOnClose="true"
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
      <a-form-model-item label="分销价" prop="price">
        <a-input v-model="form.price" />
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import CustomModal from "@/components/modal/CustomModal.vue";
export default {
  components: {
    CustomModal,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form: {},
      visible: false,
      confirmLoading: false,
      rules: {
        price: [
          {
            required: true,
            message: "分销价必填",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("onOk", this.form);
        }
      });
    },
    handleCancel() {
      this.form = {};
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
  },
  watch: {
    defaultValue(value) {
      this.form = value;
    },
  },
};
</script>
<style scoped></style>
