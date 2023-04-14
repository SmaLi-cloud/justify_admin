<template>
  <CustomModal
    title="上传图片"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    :width="500"
    okText="上传"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-upload
      :accept="accept"
      :multiple="multiple"
      :maxCount="maxMulti"
      :preview-file="previewFile"
      :list-type="listType"
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
    >
      <a-button> <a-icon type="upload" /> 选择图片 </a-button>
    </a-upload>
    <slot name="tipSlot" :maxMulti="maxMulti">
      <span v-if="showTip">最多上传{{ maxMulti }}张图片</span>
    </slot>
  </CustomModal>
</template>
<script>
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
import fileHelper from "@/utils/file";
export default {
  name: "UploadModal",
  components: {
    CustomModal,
  },
  props: {
    listType: {
      type: String,
      default: "picture",
      validator: function (value) {
        return ["picture", "picture-card", "text"].indexOf(value) !== -1;
      },
    },
    showTip: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: "image/png, image/jpeg, image/jpg",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxMulti: {
      type: Number,
      default: 5,
    },
    maxFileSize:{
      type: Number,
      default: 5,
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      fileList: [],
    };
  },
  methods: {
    ...mapActions("file", ["batchUpload", "deleteFile"]),
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isImage) {
        this.$message.error("请上传图片文件");
      }
      const isLt5M = file.size / 1024 < 1024 * this.maxFileSize;
      if (!isLt5M) {
        this.$message.error("文件大小不能超过"+this.maxFileSize+"M");
        return;
      }
      if (this.fileList.length == this.maxMulti) {
        this.$message.error("最多只能同时上传" + this.maxMulti + "张图片");
        return;
      }
      return isImage && isLt5M && this.addToFileList(file);
    },
    addToFileList(file) {
      let self = this;
      return new Promise(function (resolve, reject) {
        const extension = file.type.split("/")[1];
        const fileName = file.name;
        fileHelper
          .fileToBase64(file)
          .then((base64) => {
            file.url = base64;
            if (self.multiple) {
              if (self.fileList.length >= self.maxMulti) {
                reject();
                return;
              }
              self.fileList = [...self.fileList, file];
            } else {
              self.fileList = [file];
            }
            reject();
          })
          .catch((e) => {
            self.$message.error(e.message);
            reject();
          });
      });
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      if (this.fileList.length == 0) {
        this.$message.error("请选择图片");
        return;
      }
      if (this.fileList.length > this.maxMulti) {
        this.$message.error("最多只能同时上传" + this.maxMulti + "个文件");
        return;
      }
      this.confirmLoading = true;
      let files = [];
      for (let i = 0; i < this.fileList.length; i++) {
        files.push({
          fileName: this.fileList[i].name,
          extension: this.fileList[i].type.split("/")[1],
          fileContent: this.fileList[i].url,
        });
      }
      this.batchUpload({ files }).then((res) => {
        this.confirmLoading = false;
        this.$emit("ok", res);
        this.clearData();
        this.visible = false;
      });
    },
    handleCancel() {
      this.clearData();
      this.confirmLoading = false;
      this.visible = false;
    },
    previewFile(file) {},
    clearData() {
      this.fileList = [];
    },
  },
};
</script>
