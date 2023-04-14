<template>
  <CustomModal
    title="添加/编辑供应商"
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
      <a-form-model-item label="企业名称" prop="company">
        <a-input v-model="form.company" />
      </a-form-model-item>
      <a-form-model-item label="联系人" prop="contacter">
        <a-input v-model="form.contacter" />
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phoneNumber">
        <a-input v-model="form.phoneNumber" />
      </a-form-model-item>
      <a-form-model-item label="供应商类型" prop="type">
        <a-select :options="supTypeList" v-model="form.type" allowClear>
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
      supTypeList: [
        {
          label: "工厂端",
          value: "factory",
        },
        {
          label: "品牌商",
          value: "brand",
        },
        {
          label: "方案商",
          value: "solution",
        },
      ],
      rules: {
        company: [
          {
            required: true,
            message: "企业名称必填",
            trigger: ["blur", "change"],
          },
        ],
        contacter: [
          {
            required: true,
            message: "联系人姓名必填",
            trigger: ["blur", "change"],
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "手机号码必填",
            trigger: ["blur", "change"],
          },
        ],
        type: [
          {
            required: true,
            message: "供应商类型必选",
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {},
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
