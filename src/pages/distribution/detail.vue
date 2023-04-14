<template>
  <div>
    <div class="toolbar" v-if="showBtn">
      <a-button
        type="primary"
        :loading="false"
        @click="onExamine"
        style="margin-right: 20px"
        >审核</a-button
      >
    </div>
    <div class="auth_info">
      <h2>注册信息</h2>
      <div class="content" v-if="detailTextList">
        <div
          v-for="(value, key) in detailTextList"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 90px">{{ key }} ：</div>
          <span style="flex: 1">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="auth_info" style="margin-top: 20px">
      <h2>认证信息</h2>
      <div class="content" v-if="authInfo">
        <div
          v-for="(value, key) in authInfo"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 90px">{{ key }} ：</div>
          <span style="flex: 1">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="image" v-if="licenseAttachs.length">
      <div class="content">
        <span> 营业执照 ： </span>
        <upload-img
          :showDelete="false"
          :showTip="false"
          :fileList="licenseAttachs"
          :limitNum="licenseAttachs.length"
        />
      </div>
    </div>
    <div v-if="shopAttach.length" class="image">
      <div class="content">
        <span> 店铺照片 ： </span>
        <upload-img
          :showDelete="false"
          :showTip="false"
          :fileList="shopAttach"
          :limitNum="shopAttach.length"
        />
      </div>
    </div>
    <div style="background-color: #fff; padding: 20px; margin-top: 20px">
      <h2>产品信息</h2>
      <a-table
        :columns="columns"
        :data-source="distributorList"
        :pagination="false"
        :customRow="customRow"
        bordered
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </a-table>
    </div>
    <div
      v-if="authStatus === 2 || authStatus === 3"
      class="examine_box"
      style="margin-top: 20px"
    >
      <h2>审核信息</h2>
      <div class="content flex">
        <div
          v-for="(value, key) in examineResult"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 90px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
    </div>
    <review-modal ref="modalRef" @onOk="onExamineOk" />
    <exclusive-price-modal
      ref="priceModalRef"
      @onOk="onExclusiveOk"
      :defaultValue="defaultPrice"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ReviewModal from "./modules/ReviewModal.vue";
import ExclusivePriceModal from "./modules/ExclusivePriceModal.vue";

export default {
  components: { ReviewModal, ExclusivePriceModal },
  data() {
    return {
      defaultPrice: {},
      examineResult: {},
      authInfo: false,
      showAuth: false,
      licenseAttachs: [],
      shopAttach: [],
      authStatus: "",
      showBtn: false,
      permission: "",
      conditions: {},
      src: "",
      detailTextList: {},
      searchs: [],
      toolbar: [],
      opCols: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,

      columns: [
        {
          title: "序号",
          dataIndex: "sequence",
          customRender: (text, record, index) => {
            return {
              children: text + 1 || "",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "产品图片",
          dataIndex: "attach",
          customRender: (text, record) => {
            let children = [];
            children.push(
              this.$createElement("img", {
                domProps: {
                  src: text,
                },
                style: {
                  width: "50px",
                  height: "50px",
                  marginRight: "5px",
                },
              })
            );
            const obj = {
              children: text ? children : "",
              attrs: { rowSpan: record.rowSpan },
            };
            return obj;
          },
        },
        {
          title: "产品名称",
          dataIndex: "name",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "类目",
          dataIndex: "",
          customRender: (text, record) => {
            let value = "";
            if (record.primaryTypeName && record.secondaryTypeName) {
              value = record.primaryTypeName + "-" + record.secondaryTypeName;
            }
            return {
              children: value || "/",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "订单数量",
          dataIndex: "orderCount",
          customRender: (text, record) => {
            return {
              children: text,
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "销售数量",
          dataIndex: "productQuantity",
          customRender: (text, record) => {
            return {
              children: text,
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "订单总金额",
          dataIndex: "productAmount",
          customRender: (text, record) => {
            return {
              children: text,
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "规格",
          dataIndex: "specification",
        },
        {
          title: "分销价",
          dataIndex: "distributionPrice",
        },
        {
          title: "操作",
          dataIndex: "op",
          customRender: (_, record) => {
            if (record.hasSpecification === false) {
              return "";
            }
            return (
              <span
                style="color:#ff9900;cursor:pointer"
                onClick={() => {
                  this.setExclusivePrice(record);
                }}
              >
                设置专属分销价
              </span>
            );
          },
        },
      ],

      distributorList: [],
      customRow: (record) => {
        return {
          on: {
            // 事件
            click: (event) => {}, // 点击行
          },
        };
      },
    };
  },
  mounted() {
    this.getRows();
  },
  watch: {
    typeList(newValue) {
      this.searchs[1].props.options = newValue;
    },
  },
  methods: {
    ...mapActions("distribution", [
      "distributorDetail",
      "distributorExamine",
      "distributorExclusivePrice",
    ]),
    setExclusivePrice(record) {
      this.defaultPrice = {
        proId: record.id,
        proModelId: record.proModelId,
        price: record.distributionPrice || "",
      };
      this.$refs.priceModalRef.showModal();
    },
    onExclusiveOk(value) {
      this.distributorExclusivePrice({
        distributorId: this.$route.params.id,
        ...value,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.$refs.priceModalRef.handleCancel();
        this.$message.success("分销价设置成功");
        this.onRefresh();
      });
    },
    onExamine() {
      this.$refs.modalRef.showModal();
    },
    onExamineOk(value) {
      this.distributorExamine({
        distributorId: this.$route.params.id,
        ...value,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.$refs.modalRef.handleCancel();
        this.onRefresh();
      });
    },
    getRows() {
      let obj = {
        live: "直播",
        online: "电商",
        offline: "线下门店",
        staff: "员工",
      };
      this.loading = true;
      const { page, pageSize, conditions } = this;
      this.distributorDetail({
        conditions,
        page,
        size: pageSize,
        distributorId: this.$route.params.id,
      }).then((res) => {
        const { regInfo } = res.data;
        let authentication = "";
        if (regInfo.authStatus === 3) {
          authentication = "认证未通过";
        } else if (regInfo.isAuthentication === 1 && regInfo.authStatus === 2) {
          authentication = "已认证";
        } else if (regInfo.isAuthentication === 0 && regInfo.authStatus === 1) {
          authentication = "待审核";
        } else {
          authentication = "未认证";
        }
        this.detailTextList = {
          联系人: res.data.regInfo.contacter || "/",
          手机号码: res.data.regInfo.phoneNumber || "/",
          分销类型: obj[res.data.regInfo.type] || "/",
          注册时间: res.data.regInfo.addTime || "/",
          认证情况: authentication,
        };
        let distributorList = [];
        res.data.selectedInfo.forEach((item, proIndex) => {
          const { modelInfo } = item;
          const length = modelInfo.length;
          let sequence = proIndex;
          if (modelInfo && modelInfo.length) {
            modelInfo.map((specifItem, index) => {
              const {
                id: proModelId,
                specification,
                distributionPrice,
              } = specifItem;
              let obj = {
                ...item,
                proModelId,
                specification,
                distributionPrice,
                hasSpecification: true,
                sequence,
              };
              if (modelInfo.length > 1) {
                if (index === 0) {
                  obj.rowSpan = length;
                } else {
                  obj.rowSpan = 0;
                }
              } else {
                obj.rowSpan = 1;
              }
              distributorList.push(obj);
            });
          } else {
            distributorList.push({
              ...item,
              hasSpecification: false,
              sequence,
              rowSpan: 1,
            });
          }
        });
        this.distributorList = distributorList;
        this.page = page;
        this.total = res.data.selectedCount;
        this.pageSize = pageSize;
        this.loading = false;
        this.showBtn =
          regInfo.isAuthentication === 0 && regInfo.authStatus === 1;
        this.authStatus = regInfo.authStatus;
        this.formarAuth(regInfo);
      });
    },
    formarAuth(regInfo) {
      const { type } = regInfo;
      let authObj = {
        2: "已通过",
        3: "未通过",
      };
      let obj = {
        live: "直播",
        online: "电商",
        offline: "线下门店",
        staff: "员工",
      };
      let examineResult = {
        认证类型: obj[regInfo.type] || "",
        审核结果: authObj[regInfo.authStatus] || "",
        审核人: regInfo.examineStaffName,
        审核时间: regInfo.examineTime,
      };
      if (regInfo.failCause) {
        examineResult["不通过原因"] = regInfo.failCause;
      }
      this.examineResult = examineResult;
      let authInfo = false;
      let licenseAttachs = [];
      let shopAttach = [];
      let showAuth = false;

      if (type === "live") {
        const { authInfo: regAuth } = regInfo;
        authInfo = {
          认证类型: obj[type],
          直播平台: regAuth.platform,
          昵称: regAuth.nickname,
          链接: regAuth.link,
          粉丝数量: regAuth.fan,
        };
      } else if (type == "online") {
        const onlineType = {
          enterprise: "企业",
          person: "个人",
        };
        authInfo = {
          认证类型: obj[type],
          店铺地址: regInfo.shopAddress,
          电商类型: onlineType[regInfo.onlineType],
        };
        if (regInfo.licenseAttachs) {
          licenseAttachs = [
            {
              ...regInfo.licenseAttachs,
              url: regInfo.licenseAttachs?.imagePath,
            },
          ];
        }
        if (regInfo.onlineType === "person") {
          licenseAttachs = [];
        }
      } else if (type == "offline") {
        authInfo = {
          认证类型: obj[type],
        };
        shopAttach = (regInfo.shopAttach || []).map((item) => {
          return {
            url: item.imagePath,
          };
        });
        if (regInfo.licenseAttachs) {
          licenseAttachs = [
            {
              ...regInfo.licenseAttachs,
              url: regInfo.licenseAttachs?.imagePath,
            },
          ];
        }
      }
      this.showAuth = showAuth;
      this.authInfo = authInfo;
      this.licenseAttachs = licenseAttachs;
      this.shopAttach = shopAttach;
    },
    onSearch() {
      this.page = 1;
      this.getRows();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.pageSize = size;
      this.getRows();
    },
    onRefresh() {
      this.getRows();
    },
    onReset() {
      (this.conditions = {
        materielId: "",
        materielType: "",
        brand: "",
        supplyMode: "",
        customerId: "",
      }),
        this.getRows();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getRows();
    },
  },
};
</script>

<style lang="less" scoped>
.toolbar {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
}
.auth_info {
  background: #fff;
  padding: 20px;
  // padding-bottom: 0;
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
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
}

.examine_box {
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
      cursor: default;
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
