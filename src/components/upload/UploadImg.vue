<template>
  <a-spin :spinning="loading">
    <div class="upload-wrapper">
      <div class="upload-wrapper" v-if="dragging">
        <div
          class="upload-item"
          :class="{ nomargin: limitNum == 1 }"
          v-for="(item, index) in fileList"
          :key="index"
          v-dragging="{ item: item, list: fileList,group }"
        >
          <img :src="item && item.url" />
          <span class="upload-delete">
            <a-icon
              v-if="showEye"
              type="eye"
              :style="showDelete ? 'margin-right:10px;' : ''"
              @click.stop="handlePreview(index)"
            />
            <a-icon
              v-if="showDelete"
              type="delete"
              @click.stop="handleDelete(index)"
            />
          </span>
        </div>
      </div>
      <div class="upload-wrapper" v-else>
        <div
          class="upload-item"
          :class="{ nomargin: limitNum == 1 }"
          v-for="(item, index) in fileList"
          :key="index"
        >
          <img :src="item && item.url" />
          <span class="upload-delete">
            <a-icon
              v-if="showEye"
              type="eye"
              :style="showDelete ? 'margin-right:10px;' : ''"
              @click.stop="handlePreview(index)"
            />
            <a-icon
              v-if="showDelete"
              type="delete"
              @click.stop="handleDelete(index)"
            />
          </span>
        </div>
      </div>
      <!-- <div
        class="upload-item"
        :class="{ nomargin: limitNum == 1 }"
        v-for="(item, index) in fileList"
        :key="index"
        v-dragging="{ item: item, list: fileList }"
      >
        <img :src="item && item.url" />
        <span class="upload-delete">
          <a-icon
            v-if="showEye"
            type="eye"
            :style="showDelete ? 'margin-right:10px;' : ''"
            @click.stop="handlePreview(index)"
          />
          <a-icon
            v-if="showDelete"
            type="delete"
            @click.stop="handleDelete(index)"
          />
        </span>
      </div> -->
      <a-upload
        :accept="accept"
        :preview-file="() => {}"
        list-type="picture"
        :file-list="[]"
        :class="{
          'btn-hide': !(!showBtn && limitNum > fileList.length),
          nomargin: true,
        }"
        :multiple="multiple"
        :before-upload="beforeUpload"
      >
        <div :id="id" class="selectpics upload-item">
          <a-icon type="plus" />
        </div>
      </a-upload>
      <a-button type="primary" :id="id" :class="showBtn ? '' : 'btn-hide'">{{
        title
      }}</a-button>
    </div>
    <div v-if="!showBtn && showTip">
      上传图片大小不能超过{{ maxFileSize }}MB，格式为jpg、jpeg、png<span
        v-if="limitNum"
        >，限制上传{{ limitNum }}个</span
      >
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-spin>
</template>
<script>
import fileHelper from "@/utils/file";

export default {
  name: "fileUpload",
  props: {
    dragging: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      default: "",
    },
    showEye: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: "uploadImg",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: "image/png, image/jpeg, image/jpg",
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "上传图片",
    },
    maxFileSize: {
      type: Number,
      default: 10,
    },
    fileList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    extraData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    limitNum: {
      type: Number,
      default: 1,
    },
    multi_selection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      index: "",
      loading: false,
      previewVisible: false,
      previewImage: "",
    };
  },
  mounted() {},
  methods: {
    beforeUpload(file, fileList) {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isImage) {
        this.$message.error("请上传图片文件");
      }
      const isLt5M = file.size / 1024 < 1024 * this.maxFileSize;
      if (!isLt5M) {
        this.$message.error("文件大小不能超过" + this.maxFileSize + "M");
        return;
      }
      if (this.fileList.length == this.limitNum) {
        this.$message.error("最多只能同时上传" + this.limitNum + "个文件");
        return;
      }
      return isImage && isLt5M && this.addToFileList(file, fileList);
    },
    getIndex(id, arr, compareName) {
      let i = -1;
      for (let index = 0; index < arr.length; index++) {
        const ele = arr[index];
        if (ele[compareName] == id) {
          i = index;
          break;
        }
      }
      return i;
    },
    addToFileList(file, fileList) {
      let self = this;
      let fileIndex = this.getIndex(file.uid, fileList, "uid");
      return new Promise(function (resolve, reject) {
        const extension = file.type.split("/")[1];
        const fileName = file.name;
        fileHelper
          .fileToBase64(file)
          .then((base64) => {
            file.url = base64;
            if (self.fileList.length + fileList.length > self.limitNum) {
              self.$message.error(
                "最多只能同时上传" + self.limitNum + "个文件"
              );
              return;
            }
            const list = self.fileList.concat(file);
            self.ok(list);
            self.onChange(file, self.fileList, fileIndex);
            reject();
          })
          .catch((e) => {
            self.$message.error(e.message);
            reject();
          });
      });
    },
    onChange(file, list, fileIndex) {
      this.$emit("onChange", { file, list, fileIndex });
    },
    ok(list) {
      this.$emit("ok", list);
    },
    handleDelete(index) {
      const list = [...this.fileList];
      const deleteData = list[index];
      list.splice(index, 1);
      this.$emit("ok", list);
      this.$emit("deleteImg", { deleteData, list });
    },
    handlePreview(index) {
      if (this.fileList && this.fileList[index]) {
        let file = this.fileList[index];
        this.previewImage = file.url || "";
        this.previewVisible = true;
      }
    },
    handleCancel() {
      this.previewImage = "";
      this.previewVisible = false;
    },
  },
};
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.upload-item {
  margin-right: 10px;
  /* margin-bottom: 10px; */
  width: 80px;
  height: 80px;
  border: 1px dashed #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-sizing: content-box;
}
.nomargin {
  margin: 0;
  height: 82px;
}
.btn-hide {
  display: none;
}
.upload-item:hover .upload-delete {
  display: block;
}
.upload-item img {
  width: 80px;
  height: 80px;
  display: block;
}
.upload-delete {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 80px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  cursor: pointer;
}
.selectpics {
  text-align: center;
  line-height: 80px;
  cursor: pointer;
}
.selectpics:hover {
  border-color: #f90;
}
</style>
