<template>
  <div class="upload-wrapper">
    <a-icon v-if="iconFlag" type="cloud-upload" :id="id"></a-icon>
    <a-button v-else type="primary" :id="id" :loading="loading">上传</a-button><span v-if="limitNum">限制上传{{limitNum}}个</span>
    <div class="file-list">
      <div class="file-item" v-for="(item,index) in fileList" :key="index">
        <span class="file-item-path">{{item.filePath}}</span>
        <span class="item-delete" @click="handleDelete(index)">
          <a-icon type="delete" />
        </span>
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
      default: 'uploadFile'
    },
    fileList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    extraData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    limitNum: {
      type: Number,
      default: 0
    },
    multi_selection: {
      type: Boolean,
      default: false
    },
    iconFlag:{
      type:Boolean,
      default:false
    },
  },
  data () {
    return {
      loading: false
    }
  },
  mounted() {
    this.initUploader();
  },
  methods: {
    initUploader() {
      // let that = this;
    //   uploader({
    //     that: this,
    //     el: that.id,
    //     extraData: that.extraData,
    //     limitNum: that.limitNum - that.fileList.length,
    //     multi_selection: that.limitNum > 1 || that.multi_selection,
    //     file_added(uploader, files) {
    //       that.loading = true;
    //       that.$emit('getLoading', true);
    //     },
    //     file_uploaded_complete(url, files) {
    //       const list = [...that.fileList];
    //       let errorFiles = [];
    //       files.forEach(file => {
    //         if (file.status == 5) {
    //           list.push({
    //             filePath: url.host + url.key + (file.target_name || file.name),
    //             fileName: file.target_name || file.name
    //           });
    //         } else {
    //           errorFiles.push(file.target_name || file.name)
    //         }
    //       })
    //       that.loading = false;
    //       that.$emit('getLoading', false);
    //       if (errorFiles.length > 0) {
    //         that.$error({
    //           title: '以下文件上传失败',
    //           content: errorFiles.join('\n'),
    //         });
    //         return;
    //       }
    //       that.$emit('ok', list, that.id);
    //       that.$message.success('上传成功');
    //     }
    //   }).init();
    },
    handleDelete(index) {
      const list = [...this.fileList];
      list.splice(index, 1);
      this.$emit('ok', list, this.id);
    }
  }
}
</script>

<style scoped>
#uploadFile {
  margin-right: 10px;
}
.item-delete {
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
}
.file-list {
  max-height: 240px;
  overflow-y: auto;
}
.file-item {
  line-height: 24px;
  display: flex;
  align-items: center;
}
.file-item-path {
  word-break: break-all;
}
</style>