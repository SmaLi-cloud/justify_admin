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
      <a-form-model-item label="审核结果" prop="result">
        <a-select v-model="form.result">
          <a-select-option :value="2">
            {{ "审核通过" }}
          </a-select-option>
          <a-select-option :value="3">
            {{ "审核不通过" }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.result === 3"
        label="审核详情"
        prop="failCause"
      >
        <a-textarea
          v-model="form.failCause"
          :autoSize="{ maxRows: 5, minRows: 3 }"
        />
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
        result: "",
        failCause: "",
      },
      visible: false,
      confirmLoading: false,
      rules: {
        result: [
          {
            required: true,
            message: "审核结果必选",
            trigger: ["blur", "change"],
          },
        ],
        failCause: [
          {
            required: true,
            message: "不通过原因必填",
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
      this.form = {
        result: "",
        failCause: "",
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
