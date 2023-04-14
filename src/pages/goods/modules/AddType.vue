<template>
  <CustomModal
    title="添加/修改类目"
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
      <a-form-model-item label="类目名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="分类" prop="level">
        <a-select v-model="form.level" allowClear>
          <a-select-option :value="1">一级类目</a-select-option>
          <a-select-option :value="2">二级类目</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.level === 3 || form.level === 2"
        label="上级分类"
        prop="parentId"
      >
        <a-select v-model="form.parentId" allowClear>
          <a-select-option v-for="d in parentIdList" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="图标" class="itemWidth" prop="icon">
        <upload-img
          :fileList="form.icon || []"
          @ok="iconChange"
          :multiple="false"
          :dragging="false"
          :showTip="false"
          :limitNum="1"
          :maxFileSize="5"
        />
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
            message: "类目名称必填",
            trigger: ["blur", "change"],
          },
        ],
        level: [
          {
            required: true,
            message: "分类必选",
            trigger: ["blur", "change"],
          },
        ],
        parentId: [
          {
            required: true,
            message: "上级分类必选",
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {
        name: "",
        level: "",
        parentId: "",
        icon: [],
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
        level: "",
        parentId: "",
        icon: [],
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
    iconChange(value) {
      this.form ={
        ...this.form,
        icon:value
      }
    },
    deleteAttachsImg(data) {
      const { deleteData, list } = data;
      this.setBaseInfo({
        ...this.baseInfo,
        attachs: list,
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
