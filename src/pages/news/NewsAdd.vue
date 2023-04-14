<template>
  <div>
    <div class="toolbar">
      <a-button
        type="primary"
        :loading="downLoading"
        @click="complete"
        style="margin-right: 20px"
        >完成</a-button
      >
    </div>
    <div class="base">
      <h2>基本信息</h2>
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        :model="baseInfo"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
        style="display: flex; flex-wrap: wrap"
      >
        <a-form-model-item label="标题" class="itemWidth" prop="title">
          <a-input v-model="baseInfo.title"> </a-input>
        </a-form-model-item>
        <a-form-model-item label="摘要" class="itemWidth" prop="summary">
          <a-textarea
            v-model="baseInfo.summary"
            :autoSize="{ maxRows: 4, minRows: 1 }"
          >
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item label="推荐置顶" class="itemWidth" prop="isTop">
          <a-select v-model="baseInfo.isTop">
            <a-select-option :value="1"> 是 </a-select-option>
            <a-select-option :value="0"> 否 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="baseInfo.isTop"
          label="置顶顺序"
          class="itemWidth"
          prop="topSn"
        >
          <a-select v-model="baseInfo.topSn">
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
            <a-select-option :value="3">3</a-select-option>
            <a-select-option :value="4">4</a-select-option>
            <a-select-option :value="5">5</a-select-option>
            <a-select-option :value="6">6</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="封面" style="width: 50%" prop="cover">
          <upload-img
            :fileList="baseInfo.cover"
            @ok="imgChange"
            :limitNum="1"
          />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="editor">
      <h2>正文</h2>
      <rich-editor v-model="content" />
    </div>
  </div>
</template>

<script>
import RichEditor from "@/components/editor/RichEditor";
import UploadImg from "@/components/upload/UploadImg";
import { mapActions } from "vuex";

export default {
  components: { RichEditor, UploadImg },
  data() {
    return {
      id: this.$route?.query?.id,
      baseInfo: {
        title: "",
        summary: "",
        cover: [],
        isTop: 0,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: ["blur", "change"],
          },
        ],
        summary: [
          {
            required: true,
            message: "请输入摘要",
            trigger: ["blur", "change"],
          },
        ],
        isTop: [
          {
            required: true,
            message: "请选择是否置顶",
            trigger: ["blur", "change"],
          },
        ],
        topSn: [
          {
            required: true,
            message: "请选择置顶顺序",
            trigger: ["blur", "change"],
          },
        ],
        cover: [{ required: true, message: "请上传封面", trigger: "blur" }],
      },
      content: "",
      downLoading: false,
    };
  },
  mounted() {
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    ...mapActions("news", ["newsListSave", "newsListDetail"]),
    getDetail() {
      this.newsListDetail({
        newsId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { content, title, cover, summary, isTop, topSn } = res.data;
        let baseInfo = {
          title,
          summary,
          isTop,
          topSn,
          cover: [],
        };
        if (cover && cover.fileId) {
          cover.url = cover.attachPath;
          baseInfo.cover = [].concat(cover);
        }
        this.baseInfo = baseInfo;
        this.content = content;
      });
    },
    complete() {
      if (!this.content) {
        this.$message.error("正文内容为空，请补充正文内容");
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm({
            title: "是否确认完成？",
            onOk: () => {
              let cover = this.baseInfo.cover[0];
              if (this.id) {
                if (cover.fileId) {
                  cover = {
                    fileId: [].concat(cover.fileId),
                    add: [],
                  };
                } else {
                  cover = {
                    fileId: [],
                    add: [].concat(cover.url),
                  };
                }
              } else {
                cover = cover.url;
              }

              let conditions = {};
              let saveInfo = {
                title: this.baseInfo.title,
                summary: this.baseInfo.summary,
                isTop: this.baseInfo.isTop,
                cover: cover,
                content: this.content,
              };
              if (saveInfo.isTop) {
                saveInfo.topSn = this.baseInfo.topSn;
              }
              if (this.id) {
                saveInfo.id = this.id;
              }
              conditions.saveInfo = saveInfo;
              this.newsListSave(conditions).then((res) => {
                if (!res.success) {
                  return;
                }
                if (!this.id) {
                  this.$message.success("创建成功");
                } else {
                  this.$message.success("修改成功");
                }
                this.content = "";
                this.baseInfo = {
                  title: "",
                  summary: "",
                  cover: [],
                  isTop: 0,
                };
                this.$bus.$emit("newsListRefresh");
                this.$bus.$emit("closeCurrentPage");
              });
            },
          });
        } else {
          this.$message.error("请补充完整基本信息");
          return false;
        }
      });
    },
    editorChange(value) {
      this.content = value;
    },
    imgChange(list) {
      this.baseInfo.cover = list;
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
/deep/.ql-clipboard {
  position: fixed;
  display: none;
  left: 50%;
  top: 50%;
}
/deep/ .ql-toolbar {
  position: sticky;
  top: 72px;
  left: 120px;
  z-index: 3;
  background-color: #fff;
}
.toolbar {
  position: sticky;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 2;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
}
.base {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  .itemWidth {
    width: 50%;
  }
}
.editor {
  background-color: #fff;
  padding: 20px;
}
</style>
