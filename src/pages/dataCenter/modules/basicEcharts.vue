<template>
  <div>
    <div class="card">
      <div class="head">
        <h2>{{ title }}</h2>
        <div v-if="showTypeBtn" class="btn_box">
          <span
            @click="typeChange(1)"
            :class="dateType === 1 ? 'select_btn' : 'unselect_btn'"
            >按月</span
          >
          <span
            @click="typeChange(2)"
            :class="dateType === 2 ? 'select_btn' : 'unselect_btn'"
            >按天</span
          >
        </div>
      </div>
      <div :id="echartsName" class="echarts_sup"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { mapActions } from "vuex";
import "./common.less";
export default {
  props: {
    showTypeBtn: {
      type: Boolean,
      default: true,
    },
    dataDeepName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "bar",
    },
    dataSourceFun: {
      type: String,
      default: "",
      require: true,
    },
    echartsName: {
      type: String,
      default: "",
      require: true,
    },
  },
  data() {
    return {
      dateType: 2,
      myChart: "",
    };
  },
  mounted() {
    var chartDom = document.getElementById(this.echartsName);
    var myChart = echarts.init(chartDom);
    this.myChart = myChart;
    this.init({ type: "day" });
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  },
  methods: {
    ...mapActions("statistic", [
      "supplierData",
      "productData",
      "proTypeData",
      "passRate",
      "selectorData",
    ]),
    init(condition) {
      this.setEchartsOption(condition);
    },
    typeChange(value) {
      this.dateType = value;
      if (value === 2) {
        this.init({ type: "day" });
      } else {
        this.init();
      }
    },
    setEchartsOption(condition) {
      if (!this.dataSourceFun || !this.echartsName) {
        return;
      }
      if (!this[this.dataSourceFun]) {
        return;
      }
      this[this.dataSourceFun]({
        ...condition,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        let data = res.data;
        if (this.dataDeepName) {
          data = data[this.dataDeepName];
        }
        const { xAxis, legend, series } = data;
        let categoryData = xAxis;
        let valueData = series[legend[0]];
        let startValue = valueData.length - 12;
        if (condition && condition.type && condition.type === "day") {
          startValue = 0;
        }
        let option = {
          grid: {},
          // title: {
          //   text: "结存数据统计",
          //   top: "2%",
          //   left: "2%",
          // },
          dataZoom: [
            {
              type: "inside",
              zoomOnMouseWheel: false, //滚轮是否触发缩放
              moveOnMouseMove: true, //鼠标滚轮触发滚动
              moveOnMouseWheel: true,
              startValue: startValue,
              endValue: valueData.length - 1,
              zoomLock: true, //禁止缩放
            },
          ],
          xAxis: {
            data: categoryData,
            silent: false,
            inverse: false,
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333",
              },
              rotate: 0,
              interval: 0,
            },
            splitArea: {
              show: false,
            },
          },
          yAxis: {
            splitArea: {
              show: false,
            },
          },
          series: [
            {
              type: this.type,
              data: valueData,
              // Set `large` for large data amount
              large: true,
              barWidth: "40%",
              label: {
                show: true,
                position: "top",
              },
            },
          ],
        };
        this.myChart.setOption(option);
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
