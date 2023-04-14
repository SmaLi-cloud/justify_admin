<template>
  <div>
    <div class="base">
      <h2>基本信息</h2>
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        :model="staffInfo"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model.trim="staffInfo.phone"></a-input>
        </a-form-model-item>
        <a-form-model-item label="微信二维码" prop="wechatAttach">
          <upload-img
            :fileList="staffInfo.wechatAttach || []"
            @ok="wechatAttachChange"
            :multiple="false"
            :dragging="false"
            :showTip="false"
            :limitNum="1"
            :maxFileSize="5"
          />
        </a-form-model-item>
        <a-form-model-item label="头像" prop="avatar">
          <upload-img
            :fileList="staffInfo.avatar || []"
            @ok="avatarChange"
            :multiple="false"
            :showTip="false"
            :dragging="false"
            :limitNum="1"
            :maxFileSize="5"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handleOk"> 修改 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
import UploadImg from "@/components/upload/UploadImg";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  components: { UploadImg },
  data() {
    return {
      staffInfo: {},
      rules: {
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.resetStaffInfo();
  },

  methods: {
    ...mapMutations("staff", ["setPersonData"]),
    ...mapActions("staff", ["updatePersonalData"]),
    resetStaffInfo(value) {
      let personalData = value || this.$store.getters["staff/personalData"];
      const { phone, wechatAttach, avatar } = personalData;
      let staffInfo = {
        phone,
      };
      if (wechatAttach && wechatAttach.fileId) {
        staffInfo.wechatAttach = [
          {
            ...wechatAttach,
            url: wechatAttach.attachPath,
          },
        ];
      }
      if (avatar && avatar.fileId) {
        staffInfo.avatar = [
          {
            ...avatar,
            url: avatar.attachPath,
          },
        ];
      }
      this.staffInfo = staffInfo;
    },
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
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let staffInfo = {
            ...this.staffInfo,
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
          this.updatePersonalData(staffInfo).then((res) => {
            if (!res.success) {
              return;
            }
            const data = res.data;
            this.$message.success("修改成功");
            this.setPersonData(data);
            this.resetStaffInfo(data)
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.base {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  .itemWidth {
    width: 100%;
  }
  .rate {
    display: flex;
  }
}
</style>
