<template>
  <div>
    <div class="box">
      <h2>订单信息</h2>
      <div class="content flex">
        <div
          v-for="(value, key) in orderInfo"
          :key="key"
          style="width: 50%; line-height: 30px"
        >
          <span>{{ key }}：</span>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="box" style="margin-top: 20px">
      <h2>物流信息</h2>
      <div class="content flex">
        <div
          v-for="(value, key) in logisticsInfo"
          :key="key"
          style="width: 50%; line-height: 30px"
        >
          <span>{{ key }}：</span>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="box" style="margin-top: 20px">
      <h2>商品信息</h2>
      <div class="content">
        <div
          class="flex dashed"
          v-for="(item, index) in goodsInfo"
          :key="index"
        >
          <div
            v-for="(value, key) in item"
            :key="key"
            style="width: 50%; vertical-align: top; line-height: 30px"
          >
            <span>{{ key }}：</span>
            <span v-if="typeof value === 'string'">{{ value }}</span>
            <img
              v-else-if="value && value.thumbnailPath"
              style="
                height: 100px;
                width: 100px;
                vertical-align: top;
                margin-top: 8px;
              "
              :src="value.thumbnailPath"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { orderStatus, orderType } from "./type";
export default {
  data() {
    return {
      id: this.$route.params.id,
      orderInfo: {
        订单编号: "",
        订单状态: "",
        订单类型: "",
        订单来源: "",
        下单时间: "",
        支付时间: "",
        交易单号: "",
        支付金额: "",
      },
      logisticsInfo: {
        发货时间: "",
        快递名称: "",
        快递单号: "",
        收货人: "",
        联系电话: "",
        收货地址: "",
      },
      goodsInfo: [],
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapActions("order", ["getOrderDetail"]),
    getDetail() {
      this.getOrderDetail({
        orderId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const {
          orderNo,
          status,
          type,
          source,
          addTime,
          payTime,
          payAmount,
          transactionId,
          payMode,
        } = res.data;
        this.orderInfo = {
          订单编号: orderNo,
          订单状态: orderStatus[status],
          订单类型: orderType[type],
          订单来源: source,
          下单时间: addTime,
          支付时间: payTime,
          交易单号: (transactionId||"") + (payMode ? `(${payMode})` : ""),
          支付金额: payAmount,
        };
        let { address } = res.data;
        address = address || {};
        this.logisticsInfo = {
          发货时间: address.sendTime,
          快递名称: address.expressName,
          快递单号: address.expressNo,
          收货人: address.name,
          联系电话: address.phoneNumber,
          收货地址: address.addressDetail,
        };
        const {
          specification,
          productName,
          price,
          productQuantity,
          productAmount,
        } = res.data;
        let specifArr = [];
        for (const key in specification.specif) {
          if (Object.hasOwnProperty.call(specification.specif, key)) {
            const element = specification.specif[key];
            specifArr.push(element);
          }
        }
        this.goodsInfo = [
          {
            商品名称: productName,
            商品型号: specification.jpMOdelNo,
            商品图片: specification.specifImg || {},
            规格: specifArr.join("、"),
            商品单价: price + "",
            购买数量: productQuantity + "",
            商品总价: productAmount + "",
          },
        ];
      });
    },
  },
};
</script>
<style scoped lang="less">
.box {
  background-color: #fff;
  padding: 20px;
  .content {
    margin-left: 20px;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .dashed {
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: 1px dashed rgb(232, 232, 232);
  }
  .dashed:nth-last-child(1) {
    border-bottom: none;
    padding-bottom: 0px;
  }
  .dashed:first-child {
    padding-top: 0px;
  }
}
</style>
