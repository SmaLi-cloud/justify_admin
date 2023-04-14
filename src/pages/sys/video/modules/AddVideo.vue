<template>
  <CustomModal
    :title="op == 'add' ? '添加' : '编辑'"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="videoInfo"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item label="设备名称" prop="device">
        <a-input v-model.trim="videoInfo.device"></a-input>
      </a-form-model-item>
      <a-form-model-item label="视频地址" prop="src">
        <a-textarea v-model.trim="videoInfo.src" :autosize="{ minRows: 1, maxRows: 6 }"></a-textarea>
      </a-form-model-item>
      <a-form-model-item label="播放顺序" prop="ordinal">
        <a-input v-model.trim="videoInfo.ordinal"></a-input>
      </a-form-model-item>
      <a-form-model-item label="视频格式" prop="type">
        <a-input v-model.trim="videoInfo.type"></a-input>
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";

export default {
  components: {
    CustomModal,
  },
  data() {
    const isOrdinalVlidator = (rule, value, callback) => {
      var pattern = /^[1-9][0-9]*$/;
      if (!pattern.test(value)) {
        return callback(new Error("播放顺序只能为正整数!"));
      } else return callback();
    };
    return {
      op: "add",
      form: {},
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      videoInfo: {},
      rules: {
        device: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        src: [
          { required: true, message: "视频地址不能为空", trigger: "blur" },
        ],
        ordinal: [
          { required: true, message: "播放顺序不能为空", trigger: "blur" },
          { validator: isOrdinalVlidator, trigger: ["blur"] },
        ],
      },
    };
  },
  methods: {
    ...mapActions("sys", ["saveVideo"]),
    moment,
    getDateTime(time) {
      return time ? this.moment(time, "YYYY-MM-DD") : null;
    },
    showModal(videoInfo, op = "edit") {
      this.op = op;
      if (op === "add") {
        this.videoInfo = {};
      } else {
        this.videoInfo = videoInfo;
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let videoInfo = this.videoInfo;
          this.saveVideo({
            videoInfo,
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
  },
};
</script>
