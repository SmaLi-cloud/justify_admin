<template>
  <div>
    <div v-if="showBtn" class="btn_box">
      <a-button
        v-if="showBtn==='confirm'"
        type="primary"
        @click="confirm"
        >确认</a-button
      >
      <a-button
        v-if="showBtn==='settlement'"
        type="primary"
        @click="settle"
        >结算</a-button
      >
    </div>
    <div class="base_info">
      <h2>结算单信息</h2>
      <div class="content">
        <div
          v-for="(value, key) in baseInfo"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 120px">{{ key }} ：</div>
          <span style="flex: 1">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="box margin_T_20">
      <h2>订单明细</h2>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
      >
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </div>
    <review-modal ref="modalRef" @onOk="onConfirm" />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { checkUserPermission } from "@/utils/permission";
import ReviewModal from "./modules/ReviewModal.vue";
export default {
  components: { ReviewModal },
  data() {
    return {
      showBtn:"",
      permission: "settle_order.selector",
      columns: [
        {
          title: "订单号",
          dataIndex: "orderNo",
        },
        {
          title: "产品图片",
          dataIndex: "productAttachPath",
          customRender: (text, row, index) => {
            if (text && text.length) {
              return (
                <img src={text} style={{ width: "80px", height: "80px" }} />
              );
            }
            return "";
          },
        },
        {
          title: "产品名称",
          dataIndex: "productName",
        },
        {
          title: "规格",
          dataIndex: "specification",
          customRender: (text, row, index) => {
            const { specif } = text;
            let arr = [];
            for (const key in specif) {
              if (Object.hasOwnProperty.call(specif, key)) {
                const element = specif[key];
                arr.push(element);
              }
            }
            return arr.join("、");
          },
        },
        {
          title: "数量",
          dataIndex: "productQuantity",
        },
        {
          title: "佣金",
          dataIndex: "commission",
        },
        {
          title: "下单时间",
          dataIndex: "addTime",
        },
      ],
      dataSource: [],
      status: -1,
      id: this.$route.params.id,
      baseInfo: {
        结算单号: "",
        结算起止时间: "",
        结算订单数量: "",
        结算金额: "",
        选品官: "",
        提佣比例: "",
        生成时间: "",
      },
    };
  },
  mounted() {
    this.getDetailValue();
  },
  computed: {},
  methods: {
    ...mapActions("settle", [
      "settleDetail",
      "settleOpConfirm",
      "settleOpSettle",
    ]),
    settle() {
      this.$confirm({
        title: "是否对该结算单结算？",
        onOk: () => {
          this.settleOpSettle({ id: this.id }).then((res) => {
            if (res.success) {
              this.onRefresh();
              this.$message.success("结算完成");
            }
          });
        },
      });
    },
    onConfirm(value) {
      this.settleOpConfirm({ id: this.id, ...value }).then((res) => {
        if (res.success) {
          this.onRefresh();
          this.$message.success("确认完成");
          this.$refs.modalRef.handleCancel();
        }
      });
    },
    confirm() {
      this.$refs.modalRef.showModal();
    },
    checkUserPermission(code) {
      return checkUserPermission(code);
    },
    getDetailValue() {
      this.settleDetail({
        id: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { settleOrderInfo, orderInfo } = res.data;

        let showBtn = "";
        const confirmBtn =
          settleOrderInfo.status === 0 &&
          this.checkUserPermission(this.permission + ".op.confirm");
        const settlementBtn =
          settleOrderInfo.status === 1 &&
          checkUserPermission(this.permission + ".op.settlement");
        if (confirmBtn) {
          showBtn = "confirm";
        } else if (settlementBtn) {
          showBtn = "settlement";
        }
        this.showBtn = showBtn;
        this.status = settleOrderInfo.status;
        this.dataSource = orderInfo;
        let baseInfoAdd = {};
        let baseInfo = {
          结算单号: settleOrderInfo.orderNo,
          结算起止时间:
            settleOrderInfo.startTime + "/" + settleOrderInfo.endTime,
          结算订单数量: settleOrderInfo.orderQuantity,
          结算金额: settleOrderInfo.amount,
          选品官: settleOrderInfo.selectorName,
          提佣比例: settleOrderInfo.commRatio,
          生成时间: settleOrderInfo.createTime,
        };
        if (this.status === 1) {
          baseInfoAdd = {
            确认人: settleOrderInfo.confirmerName,
            确认时间: settleOrderInfo.confirmTime,
          };
        } else if (this.status === 2) {
          baseInfoAdd = {
            确认人: settleOrderInfo.confirmerName,
            确认时间: settleOrderInfo.confirmTime,
            不通过原因: settleOrderInfo.failCause,
          };
        } else if (this.status === 3) {
          baseInfoAdd = {
            确认人: settleOrderInfo.confirmerName,
            确认时间: settleOrderInfo.confirmTime,
            结算人: settleOrderInfo.settlerName,
            结算时间: settleOrderInfo.settleTime,
          };
        }
        this.baseInfo = Object.assign(baseInfo, baseInfoAdd);
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
.base_info {
  background: #fff;
  padding: 20px;
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
