<template>
  <div>
    <basic-echarts
      style="margin-top: 20px"
      echartsName="echarts-pro"
      dataSourceFun="productData"
      title="产品新增数量"
    />
    <pie-echarts
      title="产品类型分布"
      echartsName="echarts-type"
      dataSourceFun="proTypeData"
    />
  </div>
</template>
<script>
import basicEcharts from "./modules/basicEcharts.vue";
import pieEcharts from "./modules/pieEcharts.vue";
export default {
  components: {
    basicEcharts,
    pieEcharts,
  },
  data() {
    return {
    };
  },
};
</script>
