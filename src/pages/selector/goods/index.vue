<template>
  <div>
    <a-card v-if="searchs.length != 0">
      <a-form layout="inline" :model="goodsConditions">
        <template v-for="(item, index) in searchs">
          <a-form-item :label="item.label" :key="index">
            <a-input
              v-if="item.type === 'input'"
              v-model="goodsConditions[item.key]"
            ></a-input>
            <a-select
              v-else-if="item.type === 'select'"
              v-bind="item.props"
              v-model="goodsConditions[item.key]"
            ></a-select>
            <a-tree-select
              v-else-if="item.type === 'tree-select'"
              v-bind="item.props"
              v-model="goodsConditions[item.key]"
            ></a-tree-select>
            <a-range-picker
              v-else-if="item.type === 'range-picker'"
              v-model="goodsConditions[item.key]"
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
      <a-tab-pane key="1" tab="待审核">
        <list ref="auditRef" status="1" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="待测评">
        <list ref="appraisalRef" status="2" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="待完善">
        <list ref="improveRef" status="3" />
      </a-tab-pane>
      <a-tab-pane key="6" tab="未上架">
        <list ref="underLineRef" status="6" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="已上架">
        <list ref="onLineRef" status="5" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="不通过">
        <list ref="unPassRef" status="4" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { buildTree } from "@/utils/util";
import list from "./list.vue";
export default {
  components: { list },
  data() {
    return {
      activeKey: "5",
      searchs: [
        {
          label: "产品名称",
          type: "input",
          key: "name",
        },
        {
          label: "产品类目",
          type: "tree-select",
          key: "productType",
          props: {
            style: "width:200px",
            treeData: [],
          },
        },
        {
          label: "供应商名称",
          type: "input",
          key: "supName",
        },
        {
          label: "选品官",
          type: "input",
          key: "selectorName",
        },
        {
          label: "创建时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      tabs: {
        1: "auditRef",
        2: "appraisalRef",
        3: "improveRef",
        4: "unPassRef",
        5: "onLineRef",
        6: "underLineRef",
      },
    };
  },
  computed: {
    ...mapState("goods", ["allProductType"]),
    ...mapState("selector", ["goodsConditions"]),
  },
  mounted() {
    this.getAllTypeList();
  },
  methods: {
    ...mapMutations("goods", ["setAllProductType"]),
    ...mapMutations("selector", ["resetGoodsConditions"]),
    ...mapActions("product", ["getAllProductType"]),
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        let treeData = buildTree(res.data, "id", "parentId", "children", "");
        this.setAllProductType(treeData);
      });
    },
    changeTab(key) {
      this.activeKey = key;
      this.onRefresh();
    },
    onSearch() {
      this.onRefresh();
    },
    onReset() {
      this.resetGoodsConditions();
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
        this.searchs[1].props.treeData = newValue;
      },
    },
  },
};
</script>
<style scoped></style>
