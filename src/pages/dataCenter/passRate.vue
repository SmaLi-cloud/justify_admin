<template>
  <div>
    <basic-echarts
      style="margin-top: 20px"
      echartsName="echarts-first-trial"
      dataSourceFun="passRate"
      title="初审通过率"
      dataDeepName="examine"
      type="line"
      :showTypeBtn="false"
    />
    <basic-echarts
      style="margin-top: 20px"
      echartsName="echarts-appraisal"
      dataSourceFun="passRate"
      title="测评通过率"
      type="line"
      :showTypeBtn="false"
      dataDeepName="assess"
    />
  </div>
</template>
<script>
import basicEcharts from "./modules/basicEcharts.vue";
export default {
  components: {
    basicEcharts,
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.card {
  padding: 20px;
  padding-left: 0;
  padding-right: 0;
  border-radius: 16px;
  background-color: #fff;
  .head {
    display: flex;
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 200px;
    align-items: center;
    h2 {
      font-weight: 700;
    }
    .btn_box {
      background-color: #f0efef;
      border-radius: 9px;
      padding: 7px 0;
      span {
        padding: 8px 15px;
        cursor: pointer;
        border-radius: 8px;
      }
      .select_btn {
        background-color: #fff9f5;
        color: #ff9900;
      }
    }
    .btn_box span:hover {
      color: #ff9900;
    }
  }
}
.product {
  margin-top: 20px;
  padding-left: 60px;
  padding-right: 60px;
}
h2 {
  font-weight: 600;
}
.echarts_sup {
  height: 500px;
  width: 100%;
  margin-bottom: 15px;
  background-color: #fff;
}
</style>
