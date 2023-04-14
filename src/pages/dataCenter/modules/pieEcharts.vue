<template>
  <div>
    <div class="card product">
      <h2>{{ title }}</h2>
      <div :id="this.echartsName" class="echarts_sup"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import "./common.less";
import { mapActions } from "vuex";
export default {
  props: {
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
      dateType: 1,
      myChart: "",
    };
  },
  mounted() {
    var chartDom = document.getElementById(this.echartsName);
    var myChart = echarts.init(chartDom);
    this.myChart = myChart;
    this.init();
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
    init() {
      this.setEchartsOption();
    },
    typeChange(value) {
      this.dateType = value;
      this.init();
    },
    setEchartsOption() {
      if (!this.dataSourceFun || !this.echartsName) {
        return;
      }
      if (!this[this.dataSourceFun]) {
        return;
      }
      this[this.dataSourceFun]().then((res) => {
        if (!res.success) {
          return;
        }
        const data = res.data.map((item) => {
          return {
            ...item,
            name: item.name + " (" + item.value + ")",
          };
        });
        let option = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            x: "left",
            y: "center",
          },
          series: [
            {
              name: "产品类型",
              type: "pie",
              radius: "50%",
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
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
