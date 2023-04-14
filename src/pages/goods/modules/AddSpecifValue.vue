<template>
  <CustomModal
    title="添加规格值"
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
      <a-form-model-item label="规格值" prop="specifValue">
        <a-input v-model="form.specifValue" />
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
      rules: {
        specifValue: [
          {
            required: true,
            message: "规格值必填",
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {
        specifValue: "",
      },
      visible: false,
      confirmLoading: false,
    };
  },
  mounted() {},
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
      this.form = {
        name: "",
      };
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
