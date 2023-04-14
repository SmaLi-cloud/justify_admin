<template>
  <div>
    <div class="upload-wrapper">
      <a-spin v-if="iconFlag" :spinning="loading">
        <a-icon type="cloud-upload" :id="id"></a-icon>
      </a-spin>
      <a-input 
        placeholder="请输入内容"
        v-model="url"
        @change="handleChange"
        allowClear
        v-else-if="showInput&&!iconFlag"
      >
        <a-button
          slot="addonAfter"
          type="primary"
          :id="id"
          :loading="loading"
          ><a-icon type='upload' />{{ title }}</a-button
        >
      </a-input>
      <a-spin
        :id="id"
        :spinning="loading"
        v-else
      >
        <slot></slot>
      </a-spin>
      <!-- <a-button
        slot="addonAfter"
        type="primary"
        ><a-icon type='upload' />{{ title }}</a-button
      > -->
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
    iconFlag:{
      type:Boolean,
      default:false
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
      //     that.$emit('ok', {path: path, name: file.target_name || file.name}, that.id);
      //     that.$message.success('上传成功');
      //   },
      // }).init();
    },
    handleChange() {
      this.$emit('ok', {path: this.url, name: ''}, this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.upload-wrapper {
  cursor: pointer;
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
