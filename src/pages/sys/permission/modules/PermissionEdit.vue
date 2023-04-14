<template>
  <CustomModal
    title="权限编辑"
    :destroyOnClose="true"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="permissionInfo"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item label="父权限" prop="parentId">
        <tree-select
          v-model="permissionInfo.parentId"
          :data="permissionList"
          keyFieldName="id"
          parentFieldName="parentId"
          rootParentValue=""
          :props="permissionSelectProps"
          :config="permissionSelectConfig"
        >
        </tree-select>
      </a-form-model-item>
      <a-form-model-item label="权限名称" prop="name">
        <a-input v-model.trim="permissionInfo.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="权限编码" prop="code">
        <a-input v-model.trim="permissionInfo.code"></a-input>
      </a-form-model-item>
      <a-form-model-item label="平台" prop="platform">
        <a-select v-model="permissionInfo.platform">
          <a-select-option value="app">移动端</a-select-option>
          <a-select-option value="pc">PC端</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="orderNoo">
        <a-input v-model.trim="permissionInfo.orderNo"></a-input>
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
import TreeSelect from "@/components/select/TreeSelect.vue";

export default {
  components: {
    CustomModal,
    TreeSelect,
  },
  data() {
    return {
      permissionSelectProps: {
        widthParentId: true,
        treeCheckable: false,
      },
      permissionSelectConfig: {
        label: "name",
        val: "id",
        parentDisabled: false,
      },
      permissionList: [],
      op: "add",
      form: {},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      permissionInfo: {},
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          {
            required: true,
            message: "权限编码不能为空",
            trigger: "blur",
          },
        ],
        platform: [
          {
            required: true,
            message: "平台不能为空",
            trigger: "blur",
          },
        ],
        orderNo: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions("sys", ["savePermission", "getPermissionList"]),
    moment,
    getDateTime(time) {
      return time ? this.moment(time, "YYYY-MM-DD") : null;
    },
    async showModal(permissionInfo, op = "edit") {
      this.op = op;
      if (op === "add") {
        this.permissionInfo = {};
      } else {
        this.permissionInfo = Object.assign({}, permissionInfo);
      }
      
      await this.init();
      console.log(this.permissionList);
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.savePermission({
            permissionInfo: this.permissionInfo,
          }).then((res) => {
            if (res.success) {
              this.visible = false;
              this.$message.success("保存成功");
              this.$emit("ok");
            }
          });
        }
      });
    },
    handleCancel() {
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
    init() {
      return this.getPermissionList({}).then((res) => {
        if (res.success) {
          this.permissionList = res.data;
        }
        return true
      });
    },
  },
};
</script>
