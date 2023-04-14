<template>
  <div>
    <div class="btn_box" v-if="status !== 4">
      <a-button @click="onAudit" v-if="status === 1" type="primary">产品审核</a-button>
      <a-button @click="onReviews" v-else-if="status === 2" type="primary">产品测评</a-button>
      <a-button @click="onPerfect" v-else-if="status === 3" type="primary">完善产品</a-button>
      <a-button @click="onPerfect" v-else-if="status === 6" type="primary">编辑</a-button>
      <a-button @click="updateStatus(5)" v-if="status === 6" type="primary">上架</a-button>
      <a-button @click="updateStatus(6)" v-if="status === 5" type="primary">下架</a-button>
    </div>
    <div class="base_info">
      <h2>基本信息</h2>
      <div class="content">
        <div v-for="(value, key) in baseInfo" :key="key" style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; width: 90px">{{ key }} ：</div>
          <span style="flex:1">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="image">
      <div class="content">
        <span> 产品图片 ： </span>
        <upload-img :showDelete="false" :showTip="false" :fileList="attachs" :limitNum="attachs.length" />
      </div>
    </div>
    <div v-if="proDetail && proDetail.length" class="image">
      <div class="content">
        <span> 产品详情 ： </span>
        <upload-img :showDelete="false" :showTip="false" :fileList="proDetail" :limitNum="proDetail.length" />
      </div>
    </div>
    <div class="introduce" v-if="introInfo.length">
      <h2>商品介绍</h2>
      <descriptions title="" :bordered="true" :info="introInfo" :column="2" :size="'middle'"></descriptions>
    </div>
    <div v-if="status > 4" class="box margin_T_20">
      <h2>规格型号</h2>
      <a-table :columns="columns" :data-source="dataSource" bordered :pagination="false">
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </div>
    <div v-if="status > 1 && productInfo.examineResult" class="box margin_T_20">
      <h2>审核信息</h2>
      <div class="content flex">
        <div v-for="(value, key) in examineResult" :key="key" style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; minwidth: 90px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
      <h3 v-if="productInfo.gradeResults">产品得分</h3>
      <div class="content flex">
        <div v-for="(value, key) in proGrades" :key="key" style="width: 50%; display: flex; line-height: 30px;">
          <div style="text-align: right; minwidth: 90px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
    </div>
    <div v-if="status > 2 && productInfo.assessResult" class="box margin_T_20">
      <h2>测评信息</h2>
      <div class="content flex">
        <div v-for="(value, key) in assessResult" :key="key" style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; minwidth: 90px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
    </div>
    <div v-if="false" class="sale">
      <h2>价格信息</h2>
      <div class="content">
        <div style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; min-width: 90px">价格类型 ：</div>
          <span>{{ priceTypeName }}</span>
        </div>
        <div v-if="priceType === 'unify'" style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; min-width: 90px">产品价格 ：</div>
          <span>{{ costPrice }}</span>
        </div>
        <div v-if="priceType === 'tiered'" style="width: 100%; display: flex; margin-top: 5px">
          <div style="text-align: right; min-width: 90px">产品价格 ：</div>
          <div>
            <table>
              <thead>
                <tr class="thead_tr">
                  <td>数量</td>
                  <td>价格</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in costPrice" :key="index">
                  <td>{{ item.minQuantity }} -- {{ item.maxQuantity }}</td>
                  <td>{{ item.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="content">
        <div v-for="(value, key) in priceInfo" :key="key" style="width: 50%; display: flex; line-height: 30px">
          <div style="text-align: right; min-width: 90px">{{ key }} ：</div>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
    <review-modal ref="modalRef" :status="status" @onOk="onOk" />
  </div>
</template>
<script>
import UploadImg from "@/components/upload/UploadImg";
import { mapActions } from "vuex";
import ReviewModal from "./modules/ReviewModal.vue";
import descriptions from "@/components/descriptions";
import { cloneDeep } from "lodash";
export default {
  components: { UploadImg, ReviewModal, descriptions },
  data() {
    return {
      defaultGradeItems: {},
      gradeColumns: [

      ],
      columns: [
        {
          title: "规格",
          dataIndex: "specifi",
        },
        {
          title: "规格图片",
          dataIndex: "specifImg",
          customRender: (text, row, index) => {
            if (text && text.length) {
              return (
                <img
                  src={text[0].thumbnailPath}
                  style={{ width: "80px", height: "80px" }}
                />
              );
            }
            return "";
          },
        },
        {
          title: "商品编码",
          dataIndex: "productModelNo",
        },
        {
          title: "分销价",
          dataIndex: "distributionPrice",
        },
        {
          title: "零售价",
          dataIndex: "retailPrice",
        },
        {
          title: "样品价",
          dataIndex: "samplePrice",
        },
        {
          title: "成本价",
          dataIndex: "settlementPrice",
        },
        {
          title: "库存",
          dataIndex: "reserve",
        },
      ],
      introInfo: [],
      dataSource: [],
      proGrades: {},
      status: -1,
      id: this.$route.params.id,
      attachs: [],
      priceType: "",
      costPrice: "",
      priceInfo: {},
      productInfo: {},
      proDetail: [],
      examineResult: {
        审核结果: "",
        审核详情: "",
        审核人: "",
        审核时间: "",
      },
      assessResult: {
        测评结果: "",
        测评详情: "",
        测评人: "",
        测评时间: "",
      },
      baseInfo: {
        产品名称: "",
        成本价: "",
        零售价: "",
        毛利率: "",
        产品卖点: "",
      },
      gradeKeyId: {}
    };
  },
  mounted() {
    this.getDetailValue();
    this.$bus.$on("goodsDetailRefresh", () => {
      this.onRefresh();
    });
  },
  computed: {
    priceTypeName() {
      const priceTypeObj = {
        tiered: "阶梯价格",
        unify: "统一价格",
      };
      return priceTypeObj[this.priceType];
    },
  },
  methods: {
    ...mapActions("goods", [
      "getGoodsDetail",
      "goodsExamine",
      "goodsAssess",
      "onlineGoods",
      "getGradeItems",
    ]),
    onPerfect() {
      this.$router.push({
        path: "/goods/addGoods",
        query: {
          id: this.id,
        },
      });
    },
    onAudit() {
      this.getGradeItems().then((res) => {
        if (!res.success) {
          return;
        }
        let obj = {}
        res.data.forEach(item => {
          const { name, id } = item
          obj[name] = id
        })
        this.gradeKeyId = obj
        this.defaultGradeItems = {
          gradeName: res.data
        };
        this.$refs.modalRef.showModal(this.defaultGradeItems);
      });
    },
    onReviews() {
      this.$refs.modalRef.showModal();
    },
    updateStatus(status, offShelves) {
      let conditions = {
        productId: this.id,
        status: status,
      };
      if (offShelves) {
        conditions.offShelves = true;
      }
      this.onlineGoods(conditions).then((res) => {
        if (!res.success) {
          return;
        }
        if (status === 6) {
          if (res.data && res.data.offRemind) {
            this.recommendOffLine(res.data.data);
            return
          }
          this.$message.success("下架成功");
        } else {
          this.$message.success("上架成功");
        }
        this.onRefresh();
      });
    },
    recommendOffLine(msg) {
      this.$confirm({
        title: msg || "",
        onOk: () => {
          this.updateStatus(6, true);
        },
      });
    },
    onOk(value) {
      const { result, detail, assessUrl, mixcheck } = value;
      let completeId = this.gradeKeyId['市场竞争']
      let complete = []
      if (completeId && mixcheck) {
        complete = [value[completeId], ...mixcheck]
        value[completeId] = complete
      }
      delete value.detail
      delete value.result
      delete value.gradeName
      delete value.mixcheck
      let arr = []
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          let itemArr = []
          if (element instanceof Array) {
            itemArr = [key, ...element]
          } else {
            itemArr = [key, element]
          }
          arr = arr.concat(itemArr)
        }
      }
      for (const key in this.gradeKeyId) {
        if (Object.hasOwnProperty.call(this.gradeKeyId, key)) {
          const element = this.gradeKeyId[key];
          if(!arr.includes(element)){
            arr.push(element)
          }
        }
      }
      let conditions = {
        productId: this.id,
        result,
        detail,
        productGrade: arr,
      };
      if (this.status === 1) {
        //待审核
        this.onExamine(conditions);
      }
      if (this.status === 2) {
        // 待测评
        conditions.assessUrl = assessUrl || "";
        this.onAssess(conditions);
      }
    },
    onExamine(conditions) {
      this.goodsExamine(conditions).then((res) => {
        if (!res.success) {
          return;
        }
        this.$message.success("审核完成");
        this.onRefresh();
        this.$refs.modalRef.handleCancel();
      });
    },
    onAssess(conditions) {
      this.goodsAssess(conditions).then((res) => {
        if (!res.success) {
          return;
        }
        this.$message.success("测评完成");
        this.onRefresh();
        this.$refs.modalRef.handleCancel();
      });
    },
    getDetailValue() {
      this.getGoodsDetail({
        productId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { productInfo, supplierInfo } = res.data;
        this.productInfo = productInfo;
        this.status = productInfo.status;
        const {
          examineResult,
          assessResult,
          attachs,
          proDetail,
          skus,
          specifications,
          gradeResults,
        } = productInfo;
        if (attachs && attachs.length) {
          this.attachs = attachs.map((item) => {
            return {
              ...item,
              url: item.thumbnailPath,
            };
          });
        }
        if (proDetail && proDetail.length) {
          this.proDetail = proDetail.map((item) => {
            return {
              ...item,
              url: item.thumbnailPath,
            };
          });
        }
        let setSpecfKey = [];
        for (const item of specifications || []) {
          if (item.name) {
            setSpecfKey.push(item.name);
          }
        }
        let dataSource = [];
        if (skus) {
          dataSource = skus.filter((item) => item.status);
        }
        this.dataSource = dataSource.map((item) => {
          let specifi = [];
          setSpecfKey.forEach((ele) => {
            if (item[ele]) {
              specifi.push(item[ele].value);
            }
          });
          return {
            specifi: specifi.join("、"),
            productModelNo: item.productModelNo,
            specifImg: item.specifImg,
            reserve: item.reserve,
            status: item.status,
            distributionPrice: item.distributionPrice,
            retailPrice: item.retailPrice,
            samplePrice: item.samplePrice,
            settlementPrice: item.settlementPrice,
          };
        });
        this.priceInfo = {
          零售价: productInfo.retailPrice,
          样品价: productInfo.samplePrice,
          成本价: productInfo.settlementPrice,
        };
        const { primaryTypeName, secondaryTypeName } = productInfo;
        if (this.status <= 4) {
          this.baseInfo = {
            产品名称: productInfo.name,
            成本价: productInfo.originSettlementPrice,
            零售价: productInfo.retailPrice,
            毛利率: productInfo.grossMargin,
            产品卖点: productInfo.sellingPoint,
            品牌名称: productInfo.brandName
          };
        } else {
          let baseInfo = {
            产品名称: productInfo.name,
            类目:
              primaryTypeName + (secondaryTypeName && "—" + secondaryTypeName),
            供应商: productInfo?.supName,
            型号: productInfo?.supModel,
            捷配型号: productInfo.jpModel,
            产品卖点: productInfo.sellingPoint,
            品牌名称: productInfo.brandName,
          };
          if (productInfo.selectorId && productInfo.selectorName) {
            baseInfo['选品官'] = productInfo.selectorName
          }
          this.baseInfo = baseInfo
        }
        if (productInfo.introduce) {
          const {
            attestation,
            boxSpecs,
            netWeight,
            otherSpecif,
            size,
            supportDropshipping,
            supportOem,
            color,
            listingTime,
          } = productInfo.introduce;
          let introInfo = [
            {
              label: "是否支持一件代发",
              value: supportDropshipping ? "是" : "否",
            },
            { label: "是否支持OEM", value: supportOem },
            { label: "认证情况", value: attestation },
            { label: "单包尺寸", value: size },
            { label: "箱规（台/箱）", value: boxSpecs },
            { label: "产品净重", value: netWeight },
            { label: "颜色", value: color },
            { label: "上市时间", value: listingTime },
          ];
          if (otherSpecif && otherSpecif.length) {
            let formatOtherSpecif = otherSpecif.map((item) => {
              return { label: item.name, value: item.value };
            });
            introInfo = introInfo.concat(formatOtherSpecif);
          }
          this.introInfo = introInfo;
        }
        if (gradeResults) {
          gradeResults.detail.forEach(item => {
            if(item.selected == ""){
              this.proGrades[item.name + '(' + item.mark + '分)'] = '暂无'
            }else{
              this.proGrades[item.name + '(' + item.mark + '分)'] = item.selected.toString()
            }
            
          })
          this.proGrades['总分'] = gradeResults.total + '分'
        }
        if (examineResult) {
          this.examineResult = {
            审核结果: examineResult.isPass ? "通过" : "不通过",
            审核详情: examineResult.detail,
            审核人: examineResult.staffName,
            审核时间: examineResult.addTime,
          };
        }
        if (assessResult) {
          this.assessResult = {
            测评结果: assessResult.isPass ? "通过" : "不通过",
            测评详情: assessResult.detail,
            测评人: assessResult.staffName,
            测评时间: assessResult.addTime,
          };
          // if (assessResult.assessUrl) {
          //   this.assessResult = Object.assign(this.assessResult, {
          //     测评地址: assessResult.assessUrl,
          //   });
          // }
        }
      });
    },
    onRefresh() {
      this.getDetailValue();
    },
  },
};
</script>
<style lang="less" scoped>
.margin_T_20 {
  margin-top: 20px;
}

.btn_box {
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

.base_info {
  background: #fff;
  padding: 20px;
  padding-bottom: 0;

  .content {
    padding-left: 20px;
    padding-right: 40px;
    display: flex;
    flex-wrap: wrap;

    .detail {
      flex: 1;
      margin-bottom: 20px;
      padding: 20px;
      border-width: 1px;
      border-color: rgb(232, 232, 232);
      border-style: solid;
      border-radius: 8px;
    }
  }
}

.image {
  background: #fff;
  padding: 20px;
  padding-top: 10px;

  .content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 37px;
    padding-right: 40px;
  }

  .content:first-of-type {
    margin-bottom: 0px;
  }
}

.box {
  background-color: #fff;
  padding: 20px;

  .content {
    margin-left: 20px;
    padding-right: 40px;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
  }
}

.sale {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;

  .content {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;

    table {

      // margin: 0 auto;
      thead {
        background: #e8e8e8;

        .thead_tr {
          border-width: 1px;
          border-color: #e8e8e8;
          border-style: solid;
          height: 40px;

          td {
            width: 220px;
            text-align: center;
          }
        }
      }

      tbody {
        text-align: center;

        tr {
          height: 50px;
          border-width: 1px;
          border-color: #e8e8e8;
          border-style: solid;

          td:first-child {
            padding-left: 10px;
            padding-right: 10px;
            border-right-color: #e8e8e8;
            border-right-width: 1px;
            border-right-style: solid;
          }

          td:nth-child(2) {
            padding-left: 10px;
            padding-right: 10px;
            border-right-color: #e8e8e8;
            border-right-width: 1px;
            border-right-style: solid;
          }
        }

        div {
          color: #ff9900;
          vertical-align: middle;
        }

        div:hover {
          cursor: pointer;
        }
      }
    }
  }
}

.introduce {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;
}

::v-deep .ant-descriptions-item-label {
  width: 25%;
}

::v-deep .ant-descriptions-item-content {
  width: 25%;
}

/deep/.ant-table table {
  border-spacing: 0 0;
}

/deep/.ant-table-thead {
  tr {
    th {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      text-align: left;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
    }

    td {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

/deep/.ant-table-tbody {
  tr {
    td {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

/deep/.ant-table-tbody {
  tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) {
    td {
      background-color: #fff;
    }
  }
}
</style>
