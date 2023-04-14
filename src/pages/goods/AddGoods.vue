<template>
  <div>
    <div class="box">
      <a-button @click="completeClick" type="primary">完成</a-button>
    </div>
    <component :is="components[0]" ref="baseInfoRef" :id="id" />
    <component :is="components[1]" ref="introduceRef" />
    <component :is="components[2]" ref="specifRef" :status="parseInt(status)" />
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import BaseInfo from "./modules/BaseInfo.vue";
import SpecifParams from "./modules/SpecifParams.vue";
import { buildTree } from "@/utils/util";
import productIntroduce from "./modules/productIntroduce.vue";
import moment from "moment";
import { postForm } from "@/utils/request";
import { humpToLine } from "../../utils/util";

export default {
  data() {
    return {
      status: -1,
      id: this.$route?.query?.id,
      specifData: {},
      components: {
        0: BaseInfo,
        1: productIntroduce,
        2: SpecifParams,
      },
    };
  },
  mounted() {
    if (this.id) {
      this.getDefaultValue();
    }
  },
  methods: {
    ...mapActions("goods", ["getGoodsDetail", "goodsImprove"]),
    ...mapActions("product", ["getAllProductType"]),
    ...mapMutations("goods", [
      "reset",
      "setBaseInfo",
      "setMainImage",
      "setAttachs",
      "setSpecifData",
      "setSaleInfo",
      "setAllproductType",
      "setSkus",
      "setSpecifications",
      "setIntroInfo",
    ]),
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        let treeData = buildTree(res.data, "id", "parentId", "children", "");
        this.setAllproductType(treeData);
        this.productTypeList = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      });
    },
    getDefaultValue() {
      this.getGoodsDetail({
        productId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { productInfo, supplierInfo } = res.data;
        this.status = productInfo.status;
        const {
          name,
          sellingPoint,
          supId,
          supModel,
          proDetail,
          attachs,
          tertiaryType,
          secondaryType,
          primaryType,
          selectorId,
          detailWidth,
        } = productInfo;
        let baseInfo = {
          name,
          sellingPoint,
          supId,
          selectorId,
          supModel,
          detailWidth,
          productType: tertiaryType || secondaryType || primaryType || "",
        };
        if (productInfo.assessResult) {
          baseInfo.assessUrl = productInfo.assessResult.assessUrl;
        }
        let newAttachs = attachs.map((item) => {
          return {
            ...item,
            url: item.attachPath,
          };
        });
        baseInfo.attachs = newAttachs;
        let newProDetail = [];
        if (proDetail) {
          newProDetail = proDetail.map((item) => {
            return {
              ...item,
              url: item.attachPath,
            };
          });
        }

        baseInfo.proDetail = newProDetail;
        this.setBaseInfo(baseInfo);
        const { skus, specifications } = productInfo;
        this.setSpecifications(specifications);
        setTimeout(() => {
          this.setSkus(skus);
        }, 0);
        if (productInfo.introduce) {
          let {
            attestation,
            boxSpecs,
            listingTime,
            netWeight,
            color,
            size,
            supportDropshipping,
            supportOem,
          } = productInfo.introduce;
          if (size) {
            size = size.split("*");
          }
          this.setIntroInfo({
            attestation,
            boxSpecs,
            netWeight,
            supportOem,
            size,
            color,
            listingTime: listingTime ? moment(listingTime) : "",
            supportDropshipping,
          });
        } else {
          this.setIntroInfo({
            supportDropshipping: 1,
            size: [],
          });
        }
      });
    },
    onGoodsImprove() {
      const specifications = this.specifications.map((item) => {
        let tags = item.tags.map((tagItem) => {
          tagItem.index = tagItem.addIndex || tagItem.index || 0;
          delete tagItem.addIndex;
          return {
            ...tagItem,
          };
        });
        return {
          ...item,
          tags,
        };
      });
      const skus = this.skus.map((item) => {
        let specifImg = [];
        if (item.specifImg) {
          specifImg = item.specifImg.map((ele) => {
            let data = { ...ele };
            delete ele.url;
            return data;
          });
        }
        return {
          ...item,
          status: item.status,
          specifImg: specifImg || [],
          supModelNo: item.supModelNo || "",
          distributionPrice: item.distributionPrice || 0,
          retailPrice: item.retailPrice || 0,
          samplePrice: item.samplePrice || 0,
          settlementPrice: item.settlementPrice || 0,
          reserve: item.reserve || 0,
        };
      });
      const attachs = this.baseInfo.attachs.map((item) => {
        let data = { ...item };
        delete data.url;
        return data;
      });
      const proDetail = this.baseInfo.proDetail.map((item) => {
        let data = { ...item };
        delete data.url;
        return data;
      });
      const size = this.introInfo.size.join("*");
      let conditions = {
        ...this.baseInfo,
        ...this.introInfo,
        specifications,
        skus,
        attachs,
        size,
        listingTime: this.introInfo.listingTime.format("YYYY-MM-DD"),
        proDetail,
        id: this.id,
      };
      let param = new FormData();
      const { filePath, fileId } = conditions.assessUrl;
      if (filePath && !fileId && this.baseInfo.video) {
        param.append("video", this.baseInfo.video.originFileObj); //通过append向form对象添加数据
      } else if (fileId) {
        conditions.assessFileId = fileId;
      }
      delete conditions.video;
      delete conditions.assessUrl;

      conditions = humpToLine(conditions);
      param.append("product_info", JSON.stringify(conditions)); //添加form表单中其他数据
      param.append("action", "product.product:improve"); //添加form表单中其他数据
      postForm(param).then((res) => {
        if (!res.success) {
          return;
        }
        this.$message.success("更新成功");
        this.$refs.baseInfoRef.completeDelete();
        this.$bus.$emit("closeCurrentPage");
        this.$bus.$emit("goodsDetailRefresh");
        this.$bus.$emit("goodsListRefresh");
      });
    },
    completeClick() {
      if (!this.$refs.baseInfoRef.modify()) {
        return;
      }
      if (!this.$refs.introduceRef.modify()) {
        return;
      }
      if (!this.$refs.specifRef.modify()) {
        this.$message.error("请补充完整规格参数信息");
        return;
      }
      this.$confirm({
        content: "是否确认完成",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.onGoodsImprove();
        },
      });
    },
  },
  computed: {
    ...mapState("goods", ["baseInfo", "introInfo", "specifications", "skus"]),
  },
};
</script>
<style scoped lang="less">
.box {
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 3;
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
  .ant-btn {
    margin-right: 20px;
  }
}
.content {
  background-color: #fff;
  min-height: calc(100vh - 300px);
  padding: 20px;
  padding-bottom: 30px;
  flex: 1;
  .steps {
    width: 600px;
    margin: 0 auto;
    margin-bottom: 50px;
  }
}
</style>
