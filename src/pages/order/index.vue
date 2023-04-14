<template>
  <div>
    <a-card v-if="searchs.length != 0">
      <a-form layout="inline" :model="conditions">
        <template v-for="(item, index) in searchs">
          <a-form-item :label="item.label" :key="index">
            <a-input
              v-if="item.type === 'input'"
              v-model="conditions[item.key]"
            ></a-input>
            <a-select
              v-else-if="item.type === 'select'"
              v-bind="item.props"
              v-model="conditions[item.key]"
            ></a-select>
            <a-range-picker
              v-else-if="item.type === 'range-picker'"
              v-model="conditions[item.key]"
              v-bind="item.props"
            ></a-range-picker>
          </a-form-item>
        </template>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="onSearch">
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-tabs
      :activeKey="activeKey"
      type="card"
      :tabBarGutter="5"
      @change="changeTab"
      style="margin-top: 20px"
    >
      <a-tab-pane key="0" tab="全部">
        <list ref="allRef" status="" />
      </a-tab-pane>
      <a-tab-pane key="1" tab="待支付">
        <list ref="unpaidRef" status="1" />
      </a-tab-pane>
            <a-tab-pane key="6" tab="待分配">
        <list ref="distributRef" status="6" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="待发货">
        <list ref="paidRef" status="2" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="待收货">
        <list ref="receiveRef" status="3" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="已完成">
        <list ref="finishRef" status="4" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="已取消">
        <list ref="cancelRef" status="5" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import list from "./list.vue";
export default {
  components: { list },
  data() {
    return {
      activeKey: "0",
      searchs: [
        {
          label: "订单编号",
          type: "input",
          key: "orderNo",
        },
        {
          label: "订单来源",
          type: "input",
          key: "source",
        },
        {
          label: "交易单号",
          type: "input",
          key: "transactionId",
        },
        {
          label: "商品名称",
          type: "input",
          key: "productName",
        },
        {
          label: "下单时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      tabs: {
        0: "allRef",
        1: "unpaidRef",
        2: "paidRef",
        3: "receiveRef",
        4: "finishRef",
        5: "cancelRef",
        6:"distributRef"
      },
    };
  },
  computed: {
    ...mapState("order", ["conditions"]),
  },
  methods: {
    ...mapMutations("order", ["resetConditions"]),
    changeTab(key) {
      this.activeKey = key;
      this.onRefresh();
    },
    onSearch() {
      this.onRefresh();
    },
    onReset() {
      this.resetConditions();
      this.onRefresh();
    },
    onRefresh() {
      let ref = this.tabs[this.activeKey];
      if (ref && this.$refs[ref]) {
        this.$refs[ref].onRefresh();
      }
    },
  },
};
</script>
<style scoped></style>
