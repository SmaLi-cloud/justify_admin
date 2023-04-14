<template>
  <div class="vue-quill-editor">
    <quill-editor ref="myQuillEditor" v-model="html" :options="editorOption" />
    <UploadModal
      ref="uploadModal"
      listType="picture"
      @ok="onUploadSuccess"
      :multiple="true"
      :maxMulti="maxMulti"
      :showTip="true"
      :maxFileSize="maxFileSize"
    >
      <template #tipSlot="data">
        <div style="margin-top: 5px">最多单次上传{{ data.maxMulti }}张图片</div>
      </template>
    </UploadModal>
  </div>
</template>
<script>
import { quillEditor, Quill } from "vue-quill-editor";
import UploadModal from "@/components/upload/UploadModal";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Im from "@/components/ResizeImage/ImageResize";
// import { ImageResize } from "quill-image-resize-module";

// import SelectImages from '@/components/SelectImages/index'
// 设置字体大小
const fontSizeStyle = Quill.import("attributors/style/size"); // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];
Quill.register(fontSizeStyle, true);
Quill.register("modules/imageResize", Im);

// Quill.register('modules/imageResize', ImageResize);

// (async function(){
//   let res = await import("quill-image-resize-vue")
//   Quill.register('modules/imageResize', res.default);
//   //other init work
// })()

// 设置字体样式
const Font = Quill.import("attributors/style/font"); // 引入这个后会把样式写在style上
const fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong"];
Font.whitelist = fonts; // 将字体加入到白名单
Quill.register(Font, true);
// 工具栏
const toolbarOptions = [
  ["bold", "italic", "underline", "strike", "link"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ font: fonts }], // 字体种类-----[{ font: [] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
  [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  // ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
  ["clean"], // 清除文本格式-----['clean']
  ["link", "image"], // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
  name: "RichEditor",
  components: {
    quillEditor,
    UploadModal,
  },
  props: {
    value: {
      type: [Number, Object, Array, String],
      default: "",
    },
    editorStyle: {
      type: Object,
    },
    maxMulti: {
      type: Number,
      default: 5,
    },
    maxFileSize: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    editorHeight() {
      let height = parseInt(
        (this.editorStyle.height || "").replace("px", ""),
        10
      );
      return height - 66 + "px";
    },
  },
  data() {
    return {
      html: this.value,
      editorOption: {
        modules: {
          // ImageResize: {
          //   modules: ["Resize", "DisplaySize", "Toolbar"],
          // },
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: this.handleImgUpload,
            },
          },
        },
        placeholder: "请输入正文",
      },
      isShow: false,
    };
  },
  watch: {
    html: {
      handler(newValue) {
        this.$emit("input", newValue);
      },
      deep: true,
    },
    value: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) this.html = newValue;
      },
      deep: true,
    },
  },
  mounted() {
    this.initMounted();
    let array = document.getElementsByClassName("ql-container");
    this.stopAutoFocus();
    // array.forEach((element) => {
    // element.style.height = this.editorHeight;
    // });
  },
  methods: {
    stopAutoFocus() {
      this.$refs.myQuillEditor.quill.enable(false);
      setTimeout(() => {
        this.$refs.myQuillEditor.quill.enable(true);
      }, 500);
    },
    initMounted() {
      setTimeout(() => {
        this.isShow = true;
      }, 100);
    },
    handleImgUpload() {
      this.$refs.uploadModal.showModal();
    },
    onUploadSuccess(res) {
      const { quill } = this.$refs.myQuillEditor;
      if (res.success) {
        for (const item of res.data) {
          const length = quill.getSelection(true).index;
          // 获取光标所在位置
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, "image", item.imagePath);
          // 调整光标到最后
          quill.setSelection(length + 1);
        }
      }
    },
  },
};
</script>
<style lang="less">
.vue-quill-editor {
  .quill-editor {
    line-height: normal;
    display: block;
    .ql-container.ql-snow {
      font-size: 14px;
      // height: 400px;
      min-height: 300px;
      line-height: normal !important;
    }
    .ql-snow {
      .ql-tooltip[data-mode="link"] {
        &:before {
          content: "请输入链接地址:";
        }
      }
      .ql-tooltip.ql-editing {
        a.ql-action {
          &:after {
            border-right: 0px;
            content: "保存";
            padding-right: 0px;
          }
        }
      }
      .ql-tooltip[data-mode="video"] {
        &:before {
          content: "请输入视频地址:";
        }
      }
      .ql-picker.ql-size {
        .ql-picker-label[data-value="12px"] {
          &:before {
            content: "12px";
          }
        }
        .ql-picker-item[data-value="12px"] {
          &:before {
            content: "12px";
          }
        }
        .ql-picker-label[data-value="14px"] {
          &:before {
            content: "14px";
          }
        }
        .ql-picker-item[data-value="14px"] {
          &:before {
            content: "14px";
          }
        }
        .ql-picker-label[data-value="16px"] {
          &:before {
            content: "16px";
          }
        }
        .ql-picker-item[data-value="16px"] {
          &:before {
            content: "16px";
          }
        }
        .ql-picker-label[data-value="18px"] {
          &:before {
            content: "18px";
          }
        }
        .ql-picker-item[data-value="18px"] {
          &:before {
            content: "18px";
          }
        }
        .ql-picker-label[data-value="20px"] {
          &:before {
            content: "20px";
          }
        }
        .ql-picker-item[data-value="20px"] {
          &:before {
            content: "20px";
          }
        }
        .ql-picker-label[data-value="24px"] {
          &:before {
            content: "24px";
          }
        }
        .ql-picker-item[data-value="24px"] {
          &:before {
            content: "24px";
          }
        }
        .ql-picker-label[data-value="28px"] {
          &:before {
            content: "28px";
          }
        }
        .ql-picker-item[data-value="28px"] {
          &:before {
            content: "28px";
          }
        }
        .ql-picker-label[data-value="32px"] {
          &:before {
            content: "32px";
          }
        }
        .ql-picker-item[data-value="32px"] {
          &:before {
            content: "32px";
          }
        }
        .ql-picker-label[data-value="36px"] {
          &:before {
            content: "36px";
          }
        }
        .ql-picker-item[data-value="36px"] {
          &:before {
            content: "36px";
          }
        }
      }
      .ql-picker.ql-header {
        .ql-picker-label {
          &:before {
            content: "文本";
          }
        }
        .ql-picker-item {
          &:before {
            content: "文本";
          }
        }
        .ql-picker-label[data-value="1"] {
          &:before {
            content: "标题1";
          }
        }
        .ql-picker-item[data-value="1"] {
          &:before {
            content: "标题1";
          }
        }
        .ql-picker-label[data-value="2"] {
          &:before {
            content: "标题2";
          }
        }
        .ql-picker-item[data-value="2"] {
          &:before {
            content: "标题2";
          }
        }
        .ql-picker-label[data-value="3"] {
          &:before {
            content: "标题3";
          }
        }
        .ql-picker-item[data-value="3"] {
          &:before {
            content: "标题3";
          }
        }
        .ql-picker-label[data-value="4"] {
          &:before {
            content: "标题4";
          }
        }
        .ql-picker-item[data-value="4"] {
          &:before {
            content: "标题4";
          }
        }
        .ql-picker-label[data-value="5"] {
          &:before {
            content: "标题5";
          }
        }
        .ql-picker-item[data-value="5"] {
          &:before {
            content: "标题5";
          }
        }
        .ql-picker-label[data-value="6"] {
          &:before {
            content: "标题6";
          }
        }
        .ql-picker-item[data-value="6"] {
          &:before {
            content: "标题6";
          }
        }
      }
      .ql-picker.ql-font {
        .ql-picker-label[data-value="SimSun"] {
          &:before {
            content: "宋体";
            font-family: "SimSun" !important;
          }
        }
        .ql-picker-item[data-value="SimSun"] {
          &:before {
            content: "宋体";
            font-family: "SimSun" !important;
          }
        }
        .ql-picker-label[data-value="SimHei"] {
          &:before {
            content: "黑体";
            font-family: "SimHei";
          }
        }
        .ql-picker-item[data-value="SimHei"] {
          &:before {
            content: "黑体";
            font-family: "SimHei";
          }
        }
        .ql-picker-label[data-value="Microsoft-YaHei"] {
          &:before {
            content: "微软雅黑";
            font-family: "Microsoft YaHei";
          }
        }
        .ql-picker-item[data-value="Microsoft-YaHei"] {
          &:before {
            content: "微软雅黑";
            font-family: "Microsoft YaHei";
          }
        }
        .ql-picker-label[data-value="KaiTi"] {
          &:before {
            content: "楷体";
            font-family: "KaiTi" !important;
          }
        }
        .ql-picker-item[data-value="KaiTi"] {
          &:before {
            content: "楷体";
            font-family: "KaiTi" !important;
          }
        }
        .ql-picker-label[data-value="FangSong"] {
          &:before {
            content: "仿宋";
            font-family: "FangSong";
          }
        }
        .ql-picker-item[data-value="FangSong"] {
          &:before {
            content: "仿宋";
            font-family: "FangSong";
          }
        }
      }
    }
    .ql-align-center {
      text-align: center;
    }
    .ql-align-right {
      text-align: right;
    }
    .ql-align-left {
      text-align: left;
    }
  }
}
</style>
