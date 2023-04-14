<template>
  <div>
    <basic-echarts
      style="margin-top: 20px"
      echartsName="echarts-supplier"
      dataSourceFun="supplierData"
      title="供应商新增数量"
    />
    <!-- 没数据暂时屏蔽 -->
    <!-- <pie-echarts
      title="供应商行业分布"
      echartsName="echarts-product"
      dataSourceFun="proTypeData"
    /> -->
  </div>
</template>
<script>
import * as echarts from "echarts";
import basicEcharts from "./modules/basicEcharts.vue";
import pieEcharts from "./modules/pieEcharts.vue";
export default {
  components: {
    basicEcharts,
    // pieEcharts,
  },
  data() {
    return {};
  },
};
</script>
