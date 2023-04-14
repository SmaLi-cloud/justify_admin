<template>
  <div>
    <a-button
      class="upload"
      slot="addonAfter"
      type="primary"
      :id="id"
      :loading="loading"
      v-if="url == ''"
    >
      <SvgIcon
        iconClass="icon-xiazai"
        style="width: 32px; height: 32px margin-top:3px"
      ></SvgIcon
      >点击上传附件压缩包(zip、rar、7z)
      <!-- <a-spin :id="id" :spinning="loading">
        <slot></slot>
      </a-spin> -->
    </a-button>
    <div class="upload-wrapper upload" v-else>
      <div style="float: left">
        <SvgIcon
          iconClass="icon-xiazai"
          style="width: 32px; height: 32px margin-top:3px"
        ></SvgIcon>
        {{ url }}
      </div>
      <div
        class="status"
        style="float: left; margin-top: 3px"
        @click="deleteFile"
      >
        <SvgIcon
          class="tg"
          iconClass="icon-fangantongguo"
          style="width: 32px; height: 32px"
        ></SvgIcon>
        <SvgIcon
          class="yc"
          iconClass="icon-weitongguo"
          style="width: 32px; height: 32px"
        ></SvgIcon>
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
      default: function () {
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
      imgData: {
        url: require('@/assets/img/logo1.png'),
      },
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
    deleteFile() {
      this.$emit('ok', { path: '', name: '' }, this.id);
    },
    handleChange() {
      this.$emit('ok', { path: this.url, name: '' }, this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.status {
   margin-left: 355px;
  .yc {
    display: none;
  }
  &:hover {
    .tg {
      display: none;
    }
    .yc {
      display: inline-block;
    }
  }
}
.upload {
  font-size: 14px;
  color: #333;
  width: 540px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  padding-left: 12px;
  border-radius: 4px;
  background-color: #f0f2f5;
  border: 1px solid #e1e1e1;
  .left {
    display: inline-block;
    height: 40px;
    padding-bottom: 3px;
    line-height: 40px;
    text-align: left;
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
