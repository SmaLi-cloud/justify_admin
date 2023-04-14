<template>
  <div class="box">
    <div class="left">
      <h2>数据总览</h2>
      <div class="flex overview">
        <div v-for="(value, key) in overview" :key="key" style="flex: 1">
          <countTo
            class="h2_count"
            :startVal="startVal"
            :endVal="value"
            :duration="1000"
          />
          <h3>{{ key }}</h3>
        </div>
      </div>
      <div class="data_product flex wrap">
        <div
          v-for="(item, index) in productInfo"
          :key="index"
          class="product_item"
        >
          <div class="primaryTypeName">{{ item.primaryTypeName }}</div>
          <div>
            供应商：<countTo
              :startVal="startVal"
              :endVal="item.supQuantity"
              :duration="1000"
            />
          </div>
          <div>
            产品数：<countTo
              :startVal="startVal"
              :endVal="item.proQuantity"
              :duration="1000"
            />
          </div>
          <div>
            价值金额：<countTo
              :startVal="startVal"
              :endVal="item.amount"
              :duration="1000"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <selector style="height: 100%" />
    </div>
  </div>
</template>
<script>
import selector from "./selector.vue";
import countTo from "vue-count-to";
import { mapActions } from "vuex";
export default {
  components: { selector, countTo },
  data() {
    return {
      startVal: 0,
      overview: {
        供应商数量: 0,
        品牌授权数量: 0,
        样品款数: 0,
        样品价值金额: 0,
      },
      productInfo: [],
    };
  },
  mounted() {
    this.getStatisticData();
  },
  methods: {
    ...mapActions("statistic", ["statisticData"]),
    getStatisticData() {
      this.statisticData({}).then((res) => {
        if (!res.success) {
          return;
        }
        const { supCount, brandCount, sampleQuantity, amount, productInfo } =
          res.data;
        this.overview = {
          供应商数量: supCount,
          品牌授权数量: brandCount,
          样品款数: sampleQuantity,
          样品价值金额: amount,
        };
        this.productInfo = productInfo;
      });
    },
  },
};
</script>
<style scoped>
.flex {
  display: flex;
}
.wrap {
  flex-wrap: wrap;
}
.box {
  display: flex;
  min-width: 540px;
}
.overview {
  border-bottom: 1px solid rgb(232, 232, 232);
  padding-bottom: 10px;
}
.h2_count {
  font-size: 40px;
  color: #333;
  font-weight: 600;
}
.left {
  border-radius: 5px;
  flex: 1;
  background-color: #fff;
  padding: 20px;
  padding-left: 40px;
  min-width: 830px;
}
.right {
  margin-left: 20px;
}
.product_item {
  width: 20%;
  padding-top: 20px;
  line-height: 25px;
}
.primaryTypeName {
  font-size: 18px;
  font-weight: 600;
}
</style>
