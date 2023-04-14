<template>
  <div>
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
        <a-form-model-item label="商品名称" class="itemWidth" prop="name">
          <a-input v-model="baseInfo.name"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="产品类型"
          class="itemWidth"
          prop="productType"
        >
          <a-tree-select
            v-model="baseInfo.productType"
            :treeData="allProductType"
          />
        </a-form-model-item>
        <a-form-model-item label="供应商" class="itemWidth" prop="supId">
          <a-select v-model="baseInfo.supId">
            <a-select-option v-for="d in allSupplierList" :key="d.id">
              {{ d.company }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选品官" class="itemWidth" prop="selectorId">
          <a-select v-model="baseInfo.selectorId">
            <a-select-option v-for="d in selectorNameIdData" :key="d.id">
              {{ d.trueName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="型号"
          help=""
          class="itemWidth"
          prop="supModel"
        >
          <a-input v-model="baseInfo.supModel"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="商品卖点"
          class="itemWidth"
          prop="sellingPoint"
        >
          <a-textarea v-model="baseInfo.sellingPoint"> </a-textarea>
        </a-form-model-item>
        <a-form-model-item label="产品图片" class="itemWidth" prop="attachs">
          <upload-img
            :fileList="baseInfo.attachs || []"
            @onChange="attachsChange"
            :multiple="true"
            group="attachs"
            :dragging="true"
            :limitNum="10"
            :maxFileSize="5"
            @deleteImg="deleteAttachsImg"
          />
        </a-form-model-item>

        <a-form-model-item label="产品详情" class="itemWidth" prop="proDetail">
          <upload-img
            :fileList="baseInfo.proDetail || []"
            @onChange="proDetailChange"
            :multiple="true"
            :dragging="true"
            group="proDetail"
            :showTip="false"
            :limitNum="50"
            :maxFileSize="5"
            @deleteImg="deleteProDetailImg"
          />
        </a-form-model-item>
        <a-form-model-item label="详情固定宽度(%)" class="itemWidth" prop="detailWidth">
          <a-input-number style="width:200px" :max="100" :min="1" v-model="baseInfo.detailWidth" />
        </a-form-model-item>
        <a-form-model-item label="视频地址" class="itemWidth" prop="assessUrl">
          <a-button v-if="baseInfo.assessUrl.filePath" @click="clearVideo"
            >清除上传视频</a-button
          >
          <a-upload
            v-else
            name="file"
            :customRequest="previewFile"
            :file-list="[]"
            @change="handleChange"
          >
            <a-button>上传视频</a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <div
        v-if="baseInfo.assessUrl.filePath"
        style="height: 300px; width: 500px; margin-left: 17%"
      >
        <vue-core-video-player :src="baseInfo.assessUrl.filePath" />
      </div>
    </div>
  </div>
</template>
<script src="./dist/vue-core-vide-player.umd.min.js"></script>
<script>
import UploadImg from "@/components/upload/UploadImg";
import { mapActions, mapMutations, mapState } from "vuex";
import { buildTree } from "@/utils/util";
import fileHelper from "@/utils/file";
export default {
  components: { UploadImg },
  props: {
    id: {
      typp: String,
      default: "",
    },
  },
  data() {
    return {
      player: null,
      fileList: [],
      rules: {
        proDetail: [
          {
            required: true,
            message: "请上传产品详情",
            trigger: ["blur"],
          },
        ],
        supId: [
          {
            required: true,
            message: "请选择供应商",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入产品名称",
            trigger: ["blur", "change"],
          },
        ],
        supModel: [
          {
            required: true,
            message: "请输入型号",
            trigger: ["blur", "change"],
          },
        ],
        sellingPoint: [
          {
            required: true,
            message: "请输入卖点",
            trigger: ["blur", "change"],
          },
        ],
        supplierId: [
          {
            required: true,
            message: "请输入供应商型号",
            trigger: ["blur", "change"],
          },
        ],
        model: [
          {
            required: true,
            message: "请输入内部型号",
            trigger: ["blur", "change"],
          },
        ],
        productType: [
          {
            required: true,
            message: "请选择产品类型",
            trigger: ["blur", "change"],
          },
        ],
        mainImage: [
          {
            required: true,
            message: "请上传首页主图",
            trigger: ["blur", "change"],
          },
        ],
        attachs: [
          {
            required: true,
            message: "请上传产品图片",
            trigger: ["blur"],
          },
        ],
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: ["blur", "change"],
          },
        ],
        describe: [
          {
            required: true,
            message: "请输入描述",
            trigger: ["blur", "change"],
          },
        ],
        keyword: [
          {
            required: true,
            message: "请输入关键字",
            trigger: ["blur", "change"],
          },
        ],
      },
      deleteImgList: new Set(),
      allSupplierList: [],
      selectorNameIdData: [],
      attachsTempList: [],
      proDetailTempList: [],
      proDetailTempLength: 0,
      attachsTempLength: 0,
    };
  },
  mounted() {
    this.getAllTypeList();
    this.getAllSupplierList();
    this.getSelectorNameId();
  },
  destroyed() {},

  methods: {
    ...mapActions('goods',["selectorNameId"]),
    ...mapActions("product", ["getAllProductType"]),
    ...mapActions("supplier", ["getSupplierName", "getProductTypeByParentId"]),
    ...mapMutations("goods", [
      "setAttachs",
      "setBaseInfo",
      "setAllProductType",
    ]),
    ...mapActions("file", ["batchUpload", "deleteWithThumbnail"]),
    getSelectorNameId() {
      this.selectorNameId({}).then((res) => {
        if (!res.success) {
          this.selectorNameIdData = [];
          return;
        }
        this.selectorNameIdData = res.data;
      });
    },
    clearVideo() {
      this.setBaseInfo({
        ...this.baseInfo,
        video: "",
        assessUrl: {},
      });
    },
    handleChange(e) {
      let video = "";
      let url = {};
      if (e.fileList.length) {
        video = e.fileList[e.fileList.length - 1];
        url.filePath = fileHelper.getFiletUrl(video.originFileObj);
        const isVideo =
          video.type === "video/mp4" ||
          video.type === "video/avi" ||
          video.type === "video/mov";
        if (!isVideo) {
          this.$message.error("请上传mp4、avi、mov格式的视频文件");
          return;
        }
        const isLt5M = video.size / 1024 < 1024 * 5;
        if (!isLt5M) {
          this.$message.error("文件大小不能超过5M");
          return;
        }
      }
      this.setBaseInfo({
        ...this.baseInfo,
        video,
        assessUrl: url,
      });
    },
    previewFile(e) {
      setTimeout(() => {
        e.onSuccess({}, e.file);
      }, 100);
    },

    mainImageChange(value) {
      this.setMainImage(value);
    },
    // 获取全部产品类型
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        let treeData = buildTree(res.data, "id", "parentId", "children", "");
        treeData = Object.freeze(treeData);
        this.setAllProductType(treeData);
      });
    },
    // 获取全部供应商类型
    getAllSupplierList() {
      this.getSupplierName({}).then((res) => {
        if (!res.success) {
          return;
        }
        this.allSupplierList = res.data || [];
      });
    },

    imgUpload(file, fileIndex, paramsName, callback) {
      let files = [];
      if (file && !file.fileId) {
        files.push({
          fileName: file.name,
          extension: file.type.split("/")[1],
          fileContent: file.url,
          thumbnail: true,
        });
      }
      if (!files.length) {
        let obj = {};
        if (paramsName === "attachs") {
          obj[paramsName] = this.attachsTempList;
        } else {
          obj[paramsName] = this.proDetailTempList;
        }
        callback({
          ...this.baseInfo,
          ...obj,
        });
        return;
      }
      this.batchUpload({ files })
        .then((res) => {
          if (!res.success) {
            return;
          }
          const { data } = res;
          let newFile = {
            fileId: data[0].fileId,
            thumbnailPath: data[0].thumbnailPath,
            fileName: data[0].fileName,
            url: data[0].imagePath,
            attachPath: data[0].imagePath,
          };
          let newList = [];
          if (paramsName === "attachs") {
            newList = [...this.attachsTempList];
            newList[this.attachsTempLength + fileIndex] = newFile;
            this.attachsTempList = newList;
            callback({
              ...this.baseInfo,
              attachs: this.attachsTempList.concat([]),
            });
          } else {
            newList = [...this.proDetailTempList];
            newList[this.proDetailTempLength + fileIndex] = newFile;
            this.proDetailTempList = newList;
            callback({
              ...this.baseInfo,
              proDetail: this.proDetailTempList.concat([]),
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    completeDelete() {
      let list = [...this.deleteImgList];
      if (list.length) {
        /**
         * 暂时取消删除功能
         */
        // this.deleteWithThumbnail({ fileIds: list });
      }
    },
    deleteAttachsImg(data) {
      const { deleteData, list } = data;
      this.setBaseInfo({
        ...this.baseInfo,
        attachs: list,
      });
      /**
       * 暂时取消删除功能
       */
      // if (this.id) {
      //   this.deleteImgList.add(deleteData.fileId);
      // } else {
      //   this.deleteWithThumbnail({ fileIds: [deleteData.fileId] });
      // }
    },
    deleteProDetailImg(data) {
      const { deleteData, list } = data;
      this.setBaseInfo({
        ...this.baseInfo,
        proDetail: list,
      });
    },
    attachsChange(obj) {
      const { file, list, fileIndex } = obj;
      this.attachsTempList = list;
      this.attachsTempLength = list.length;
      this.imgUpload(file, fileIndex, "attachs", this.setBaseInfo);
    },
    proDetailChange(obj) {
      const { file, list, fileIndex } = obj;
      this.proDetailTempList = list;
      this.proDetailTempLength = list.length;
      this.imgUpload(file, fileIndex, "proDetail", this.setBaseInfo);
    },

    modify() {
      let result = true;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          result = false;
        }
      });
      if (!result) {
        this.$message.error("请补充完整基础信息");
      }
      return result;
    },
  },
  computed: {
    ...mapState("goods", ["baseInfo", "allProductType"]),
  },
  watch: {
    // "baseInfo.proDetail": {
    //   handler(newValue) {
    //     this.$refs.ruleForm.validateField("proDetail");
    //   },
    // },
    "baseInfo.supId": {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        this.getProductTypeByParentId({ parentId: newValue }).then((res) => {
          if (!res.success) {
            return;
          }
          this.setBaseInfo({
            ...this.baseInfo,
            supplierId: res.data,
          });
        });
      },
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .tips {
  display: none !important;
}
/deep/ .vue-core-video-player-control:nth-child(2) {
  display: none !important;
}
/deep/ .settings-control {
  display: none !important;
}

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
