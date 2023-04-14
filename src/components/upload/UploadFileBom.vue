<template>
  <div>
    <div class="upload-wrapper">
      <div class="wrappCls" :id="id">
        <a-icon type="cloud-upload" />
        <span>上传文件</span>
      </div>
    </div>
  </div>
</template>
<script>
// import uploader from '@/utils/ali-oss.js';
export default {
  name: 'fileUpload',
  props: {
    id: {
      type: String,
      default: 'fileSingle',
    },
    title: {
      type: String,
      default: '上传',
    },
    filePath: {
      type: String,
      default: '',
    },
    showInput: {
      type: Boolean,
      default: true,
    },
    extraData: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  watch: {
    filePath(newVal, oldVal) {
      this.url = newVal;
    },
  },
  data() {
    return {
      url: '',
      loading: false,
    };
  },
  mounted() {
    this.url = this.filePath;
    this.initUploader();
  },
  methods: {
    initUploader() {
      // let that = this;
      // uploader({
      //   that: this,
      //   el: that.id,
      //   extraData: that.extraData,
      //   file_added(uploader, files) {
      //     that.loading = true;
      //   },
      //   file_uploaded(url, file) {
      //     const path = url.host + url.key + (file.target_name || file.name);
      //     that.loading = false;
      //     that.$emit(
      //       'ok',
      //       { path: path, name: file.target_name || file.name },
      //       that.id
      //     );
      //     that.$message.success('上传成功');
      //   },
      // }).init();
    },
    handleChange() {
      this.$emit('ok', { path: this.url, name: '' }, this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.wrappCls {
  width: 360px;
  margin: 0 auto;
  height: 120px;
  background: #f7f7f7;
  border: 1px dashed #dddddd;
  border-width: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .anticon-cloud-upload {
    font-size: 30px;
    color: #f90;
    margin-bottom: 10px;
  }
}
.upload-wrapper {
  /deep/ .ant-input-group-addon {
    padding: 0;
    border: none;
    background-color: transparent;
    button {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
