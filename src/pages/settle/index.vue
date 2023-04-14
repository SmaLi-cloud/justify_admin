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
            <a-tree-select
              v-else-if="item.type === 'tree-select'"
              v-bind="item.props"
              v-model="conditions[item.key]"
            ></a-tree-select>
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
      <a-tab-pane key="0" tab="待确认">
        <list ref="auditRef" status="0" />
      </a-tab-pane>
      <a-tab-pane key="1" tab="待结算">
        <list ref="appraisalRef" status="1" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="结算未通过">
        <list ref="improveRef" status="2" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="已完成">
        <list ref="completeRef" status="3" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import list from "./list.vue";
export default {
  components: { list },
  data() {
    return {
      activeKey: "0",
      searchs: [
        {
          label: "结算单号",
          type: "input",
          key: "orderNo",
        },
        {
          label: "选品官",
          type: "input",
          key: "selectorName",
        },
        {
          label: "生成时间",
          type: "range-picker",
          key: "createTime",
        },
      ],
      tabs: {
        0: "auditRef",
        1: "appraisalRef",
        2: "improveRef",
        3: "completeRef",
      },
    };
  },
  computed: {
    ...mapState("settle", ["conditions"]),
  },
  mounted() {},
  methods: {
    ...mapMutations("settle", ["resetConditions"]),
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
  watch: {},
};
</script>
<style scoped></style>
