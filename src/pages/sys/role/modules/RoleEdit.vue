<template>
  <CustomModal
    title="角色编辑"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="roleInfo"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item label="角色名称" prop="name">
        <a-input v-model.trim="roleInfo.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="权限" prop="permissions">
        <tree-select
          showCheckedStrategy="SHOW_ALL"
          v-model="roleInfo.permissions"
          :data="permissionList"
          keyFieldName="id"
          parentFieldName="parentId"
          rootParentValue=""
          :props="permissionSelectProps"
        >
        </tree-select>
      </a-form-model-item>
      <a-form-model-item label="描述" prop="desc">
        <a-input v-model.trim="roleInfo.desc"></a-input>
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
import TreeSelect from "@/components/select/TreeSelect.vue";
import { getTreeParentObj, getParentId } from "@/utils/util";
import { dropParentsPermission } from "@/utils/permission";

export default {
  components: {
    CustomModal,
    TreeSelect,
  },
  data() {
    return {
      permissionSelectProps: {
        multiple: true,
        "tree-checkable": true,
        allowClear: true,
      },
      permissionList: [],
      op: "add",
      form: {},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      roleInfo: {},
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        permissions: [
          {
            required: true,
            message: "权限不能为空",
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
    ...mapActions("sys", ["saveRole", "getPermissionList"]),
    moment,
    getDateTime(time) {
      return time ? this.moment(time, "YYYY-MM-DD") : null;
    },
    showModal(roleInfo, op = "edit") {
      this.op = op;
      if (op === "add") {
        this.roleInfo = {};
      } else {
        let permissions = dropParentsPermission(
          roleInfo.permissions,
          this.permissionList,
          "parentId"
        );
        this.roleInfo = {
          ...roleInfo,
          permissions
        }
      }
      this.visible = true;
      this.init();
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let parentPoint = getTreeParentObj(this.permissionList);
          let permissions = getParentId(this.roleInfo.permissions, parentPoint);
          permissions = Array.from(
            new Set(permissions.concat(this.roleInfo.permissions))
          );
          let roleInfo = {
            ...this.roleInfo,
            permissions,
          };
          this.saveRole({
            roleInfo,
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
      this.getPermissionList({}).then((res) => {
        if (res.success) {
          this.permissionList = res.data;
        }
      });
    },
  },
};
</script>
