<template>
  <div>
    <search-table
      style="margin-top: -20px"
      :conditions="goodsConditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="sourceList"
      :loading="loading"
      :onSearch="onSearch"
      :onRefresh="onRefresh"
      :onReset="onReset"
      :toolbar="toolbar"
      :opCols="opCols"
      :permission="permission"
      :customRow="customRow"
      :pagination="{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
      ref="searchTable"
    >
    </search-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import { statusType } from "./type";
export default {
  components: { SearchTable },
  props: {
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      permission: "client",
      searchs: [],
      toolbar: [],
      opCols: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      sourceList: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "selectGoodsDetail/" + record.id,
              });
            },
          },
        };
      },
    };
  },
  mounted() {
    this.getCustomList();
  },
  computed: {
    ...mapState("selector", ["goodsConditions"]),
    ...mapGetters("selector", ["formatGoodsConditions"]),
    columns() {
      let columns = [
        {
          title: "序号",
          dataIndex: "index",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "产品名称",
          dataIndex: "name",
        },
        {
          title: "状态",
          dataIndex: "status",
          customRender: (text) => {
            return statusType[text];
          },
        },
        {
          title: "类目",
          dataIndex: "primaryTypeName",
          customRender: (text, rows) => {
            return (
              (text || "") +
              ((rows.secondaryTypeName || "") && "—" + rows.secondaryTypeName)
            );
          },
        },
        {
          title: "品牌名称",
          dataIndex: "brandName",
        },

        {
          title: "供应商名称",
          dataIndex: "supName",
          customRender: (text, record) => {
            return text;
          },
        },
        {
          title: "成本价",
          dataIndex: "originSettlementPrice",
        },
        {
          title: "零售价",
          dataIndex: "retailPrice",
        },
        {
          title: "毛利率",
          dataIndex: "grossMargin",
        },
        {
          title: "创建时间",
          dataIndex: "addTime",
        },
      ];
      if (this.status === "5" || this.status === "6") {
        columns.splice(6, 1);
        columns.splice(7, 1);
        columns.splice(6, 0, { title: "捷配型号", dataIndex: "jpModel" });
        columns.splice(6, 0, { title: "选品官", dataIndex: "selectorName" });
      } else {
        columns.splice(3, 1);
      }
      return columns;
    },
  },
  methods: {
    ...mapMutations("selector", ["resetGoodsConditions"]),
    ...mapActions("selector", ["selectorProList"]),
    getCustomList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = this.formatGoodsConditions;
      conditions.status = this.status;
      this.selectorProList({
        conditions,
        type: 2,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            this.loading = false;
            return;
          }
          this.sourceList = res.data.rows;
          this.page = page;
          this.total = res.data.count;
          this.pageSize = pageSize;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    onSearch() {
      this.page = 1;
      this.getCustomList();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.pageSize = size;
      this.getCustomList();
    },
    onRefresh() {
      this.page = 1;
      this.getCustomList();
    },
    onReset() {
      this.resetGoodsConditions();
      this.getCustomList();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getCustomList();
    },
  },
};
</script>

<style scoped></style>
