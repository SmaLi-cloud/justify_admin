<template>
  <div>
    <pie-echarts
      title="产品优质度"
      echartsName="echarts-quality"
      dataSourceFun="proTypeData"
    />
  </div>
</template>
<script>
import pieEcharts from "./modules/pieEcharts.vue";
export default {
  components: {
    pieEcharts,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

