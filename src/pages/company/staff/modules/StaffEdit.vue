<template>
  <CustomModal
    title="员工编辑"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="staffInfo"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item label="员工姓名" prop="trueName">
        <a-input v-model.trim="staffInfo.trueName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="工号" prop="staffId">
        <a-input v-model.trim="staffInfo.staffId"></a-input>
      </a-form-model-item>
      <a-form-model-item label="花名" prop="nickname">
        <a-input v-model.trim="staffInfo.nickname"></a-input>
      </a-form-model-item>
      <a-form-model-item v-if="op === 'add'" label="密码" prop="password">
        <a-input v-model.trim="staffInfo.password"></a-input>
      </a-form-model-item>
      <a-form-model-item label="部门" prop="deptId">
        <tree-select
          showCheckedStrategy="SHOW_ALL"
          v-model="staffInfo.deptId"
          :data="deptList"
          keyFieldName="id"
          parentFieldName="parentId"
          rootParentValue=""
          :props="deptSelectProps"
          :config="deptSelectConfig"
          @change="onChangeDept"
        >
        </tree-select>
      </a-form-model-item>
      <a-form-model-item label="岗位" prop="title">
        <a-select
          v-model="staffInfo.title"
          placeholder="若无数据，请先选择部门"
          @change="onChangeTitle"
        >
          <a-select-option
            v-for="(item, index) in titleList"
            :key="index"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="权限" prop="permissions">
        <tree-select
          v-model="staffInfo.permissions"
          :data="permissionList"
          keyFieldName="id"
          parentFieldName="parentId"
          rootParentValue=""
          :props="permissionSelectProps"
        >
        </tree-select>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="roleId">
        <a-select v-model="staffInfo.roleId" mode="multiple">
          <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model.trim="staffInfo.phone"></a-input>
      </a-form-model-item>
      <a-form-model-item label="微信二维码" prop="wechatAttach">
        <upload-img
          :fileList="staffInfo.wechatAttach || []"
          @ok="wechatAttachChange"
          :multiple="true"
          :dragging="true"
          :showTip="false"
          :limitNum="1"
          :maxFileSize="5"
        />
      </a-form-model-item>
      <a-form-model-item label="头像" prop="avatar">
        <upload-img
          :fileList="staffInfo.avatar || []"
          @ok="avatarChange"
          :multiple="true"
          :showTip="false"
          :dragging="true"
          :limitNum="1"
          :maxFileSize="5"
        />
      </a-form-model-item>
      <a-form-model-item label="是否启用" prop="status">
        <a-select v-model="staffInfo.status">
          <a-select-option :value="0">账号禁用</a-select-option>
          <a-select-option :value="1">账号启用</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
import TreeSelect from "@/components/select/TreeSelect.vue";
import { getTreeParentObj, getParentId } from "@/utils/util";
import UploadImg from "@/components/upload/UploadImg";
import { dropParentsPermission } from "@/utils/permission";

export default {
  components: {
    CustomModal,
    TreeSelect,
    UploadImg,
  },
  data() {
    return {
      op: "add",
      titleList: [],
      deptList: [],
      deptSelectProps: {
        widthParentId: true,
        treeCheckable: false,
      },
      deptSelectConfig: {
        label: "deptName",
        val: "deptNo",
        parentDisabled: false,
      },
      permissionSelectProps: {
        multiple: true,
        "tree-checkable": true,
        allowClear: true,
      },
      roleList: [],
      permissionList: [],
      form: {},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      staffInfo: {
        title: "",
      },
      rules: {
        trueName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        staffId: [
          {
            required: true,
            message: "工号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "是否启用不能为空",
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
    ...mapActions("staff", ["saveStaff"]),
    ...mapActions("sys", ["getRoleList", "getPermissionList"]),
    ...mapActions("dept", ["getDeptList", "getTitleByDeptNo"]),
    moment,
    avatarChange(value) {
      this.staffInfo = {
        ...this.staffInfo,
        avatar: value,
      };
    },
    wechatAttachChange(value) {
      this.staffInfo = {
        ...this.staffInfo,
        wechatAttach: value,
      };
    },
    getDateTime(time) {
      return time ? this.moment(time, "YYYY-MM-DD") : null;
    },
    showModal(staffInfo, op = "edit") {
      this.op = op;
      if (op === "add") {
        this.staffInfo = {};
      } else {
        let avatar = [];
        let wechatAttach = [];
        if (staffInfo.avatar && staffInfo.avatar.fileId) {
          avatar = [
            {
              ...staffInfo.avatar,
              url: staffInfo.avatar.attachPath,
            },
          ];
        }
        if (staffInfo.wechatAttach && staffInfo.wechatAttach.fileId) {
          wechatAttach = [
            {
              ...staffInfo.wechatAttach,
              url: staffInfo.wechatAttach.thumbnailPath,
            },
          ];
        }
        let permissions = dropParentsPermission(
          staffInfo.permissions,
          this.permissionList,
          "parentId"
        );
        this.staffInfo = {
          ...staffInfo,
          avatar,
          wechatAttach,
          permissions,
        };
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let parentPoint = getTreeParentObj(this.permissionList);
          let permissions = getParentId(
            this.staffInfo.permissions,
            parentPoint
          );
          permissions = Array.from(
            new Set(permissions.concat(this.staffInfo.permissions))
          );

          let staffInfo = {
            ...this.staffInfo,
            permissions,
          };
          if (staffInfo.wechatAttach && staffInfo.wechatAttach.length) {
            let wechatAttach = staffInfo.wechatAttach[0];
            if (wechatAttach.fileId) {
              delete wechatAttach.url;
              staffInfo.wechatAttach = wechatAttach;
            } else {
              staffInfo.wechatAttach = wechatAttach.url;
            }
          } else {
            staffInfo.wechatAttach = "";
          }
          if (staffInfo.avatar && staffInfo.avatar.length) {
            let avatar = staffInfo.avatar[0];
            if (avatar.fileId) {
              staffInfo.avatar = avatar;
            } else {
              staffInfo.avatar = avatar.url;
            }
          } else {
            staffInfo.avatar = "";
          }
          this.saveStaff({
            staffInfo,
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
      this.getRoleList({
        name: "",
      }).then((res) => {
        if (res.success) {
          this.roleList = res.data;
        }
      });
      this.getPermissionList().then((res) => {
        if (res.success) {
          res.data.forEach((element) => {
            if (element.level == 1) {
              let name = element.name + "-" + element.platform;
              element.name = name;
            }
          });
          this.permissionList = res.data;
        }
      });
      this.getDeptList({}).then((res) => {
        if (res.success) {
          this.deptList = res.data;
        }
      });
    },
    onChangeDept(v) {
      this.getTitleByDeptNo({ dept_no: [v] }).then((res) => {
        if (res.success) {
          this.titleList = res.data;
          this.staffInfo.title = "";
        }
      });
    },
    onChangeTitle(value) {
      this.staffInfo = {
        ...this.staffInfo,
        title: value,
      };
    },
  },
  computed: {
    ...mapState("staff", ["allPermissions", "userPermissions"]),
  },
};
</script>
