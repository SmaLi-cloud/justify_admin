<template>
  <div v-if="getRoleStatus()==1">
        <data-overview />
        <supplier />
        <product />
        <pass-rate />
      <!-- <a-tab-pane key="5" tab="产品优质度统计">
        <quality />
      </a-tab-pane> -->
  </div>
  <div v-else>
      <blankIndex />
  </div>
</template>
<script>
import PassRate from "./passRate.vue";
import Product from "./product.vue";
// import Quality from "./quality.vue";
import supplier from "./supplier.vue";
import dataOverview from './dataOverview.vue';
import blankIndex from '@/pages/main/index.vue';
import { mapGetters } from "vuex";
export default {
  components: {
    supplier,
    Product,
    PassRate,
    dataOverview,
    blankIndex
    // Quality,
  },
  data() {
    return {
      activeKey: "1",
    };
  },
  computed: {
    ...mapGetters('staff', {roles: 'roleNames'}),
  },
  methods: {
    changeTab(value) {
      this.activeKey = value;
    },
    getRoleStatus(){
      let isManager = false;
      let isSelector = false;
      this.roles.forEach(item => {
        if (item == "管理员"){
          isManager = true;
        } else if (item == "选品官"){
          isSelector = true;
        }
      });
      if (isManager){
        return 1;
      }
      if (isSelector){
        return 2;
      }
      return -1;
    }
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-tabs-nav-container {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
}
</style>
