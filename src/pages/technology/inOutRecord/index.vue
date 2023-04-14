<template>
  <div>
    <a-card v-if="searchs.length != 0">
      <a-form layout="inline" :model="recordConditions">
        <template v-for="(item, index) in searchs">
          <a-form-item :label="item.label" :key="index">
            <a-input
              v-if="item.type === 'input'"
              v-model="recordConditions[item.key]"
            ></a-input>
            <a-select
              v-else-if="item.type === 'select'"
              v-bind="item.props"
              v-model="recordConditions[item.key]"
            ></a-select>
            <a-tree-select
              v-else-if="item.type === 'tree-select'"
              v-bind="item.props"
              v-model="recordConditions[item.key]"
            ></a-tree-select>
            <a-range-picker
              v-else-if="item.type === 'range-picker'"
              v-model="recordConditions[item.key]"
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
      <a-tab-pane key="1" tab="入库记录">
        <list ref="appraisalRef" status="1" />
      </a-tab-pane>
      <a-tab-pane key="0" tab="出库记录">
        <list ref="auditRef" status="0" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { buildTree } from "@/utils/util";
import { mapActions, mapMutations, mapState } from "vuex";
import list from "./list.vue";
export default {
  components: { list },
  data() {
    return {
      activeKey: "1",
      searchs: [
        {
          label: "产品名称",
          type: "input",
          key: "proName",
        },
        {
          label: "型号",
          type: "input",
          key: "supModel",
        },
        {
          label: "处理人",
          type: "input",
          key: "staffName",
        },
        {
          label: "捷配型号",
          type: "input",
          key: "jpModel",
        },
        {
          label: "出入库时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      tabs: {
        0: "auditRef",
        1: "appraisalRef",
      },
    };
  },
  computed: {
    ...mapState("technology", ["recordConditions"]),
  },
  mounted() {
    this.getAllTypeList();
  },
  methods: {
    ...mapMutations("technology", ["resetRecordConditions"]),
    ...mapActions("product", ["getAllProductType"]),
    changeTab(key) {
      this.activeKey = key;
      this.onRefresh();
    },
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        let treeData = buildTree(res.data, "id", "parentId", "children", "");
        this.allProductType = Object.freeze(treeData);
      });
    },
    onSearch() {
      this.onRefresh();
    },
    onReset() {
      this.resetRecordConditions();
      this.onRefresh();
    },
    onRefresh() {
      let ref = this.tabs[this.activeKey];
      if (ref && this.$refs[ref]) {
        this.$refs[ref].onRefresh();
      }
    },
  },
  watch: {
    allProductType: {
      handler(newValue) {
        this.searchs[3].props.treeData = newValue;
      },
    },
  },
};
</script>
<style scoped></style>
