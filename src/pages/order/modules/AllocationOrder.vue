<template>
  <CustomModal
    title="选择发货人"
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
      <a-form-model-item label="发货人" prop="result">
        <a-select v-model="form.result">
          <a-select-option :value="1">供应商代发</a-select-option>
          <a-select-option :value="2">捷配仓库发货</a-select-option>
        </a-select>
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
      form: {
      },
      rules: {
        result: [
          {
            required: true,
            message: "结果必填",
            trigger: ["blur", "change"],
          },
        ],
        failCause: [
          {
            required: true,
            message: "不通过原因必填",
            trigger: ["blur", "change"],
          },
        ]
      },
      visible: false,
      confirmLoading: false,
    };
  },
  mounted() {},
  computed: {},
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
