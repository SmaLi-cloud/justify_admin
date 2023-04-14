<template>
  <CustomModal
    title="添加联系人"
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
      <a-form-model-item label="姓名" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input v-model="form.email" />
      </a-form-model-item>
      <a-form-model-item label="部门" prop="dept">
        <a-input v-model="form.dept" />
      </a-form-model-item>
      <a-form-model-item label="职务" prop="duties">
        <a-input v-model="form.duties" />
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import { mapActions } from "vuex";
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
        name: [
          {
            required: true,
            message: "联系人姓名必填",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: true,
            message: "联系人手机号必选",
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {
        name: "",
        phone: "",
        email: "",
        dept: "",
        duties: "",
      },
      parentIdList: [],
      visible: false,
      confirmLoading: false,
    };
  },
  mounted() {},
  methods: {
    ...mapActions("product", ["getTypeByLevel"]),
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
        phone: "",
        email: "",
        dept: "",
        duties: "",
      };
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
    getSuperType(value) {
      this.getTypeByLevel({ level: value }).then((res) => {
        if (!res.success) {
          return;
        }
        this.parentIdList = res.data;
      });
    },
  },
  watch: {
    "form.level": {
      handler(newValue, oldValue) {
        if (newValue) {
          if (newValue === 1) {
            return;
          }
          this.getSuperType(newValue);
        }
      },
    },
    defaultValue(value) {
      this.form = value;
    },
  },
};
</script>
<style scoped></style>
