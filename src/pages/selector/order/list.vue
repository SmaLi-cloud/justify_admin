<template>
  <div>
    <search-table
      style="margin-top: -20px"
      :conditions="orderConditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="staffList"
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
import { orderStatus, orderType } from "./type";

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
      permission: "order",
      searchs: [],
      toolbar: [],
      opCols: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "订单编号",
          dataIndex: "orderNo",
        },
        {
          title: "订单状态",
          dataIndex: "status",
          customRender: (text) => {
            return orderStatus[text] || "";
          },
        },
        {
          title: "订单类型",
          dataIndex: "type",
          customRender: (text, record) => {
            return orderType[text] || "";
          },
        },
        {
          title: "订单来源",
          dataIndex: "source",
        },
        {
          title: "下单时间",
          dataIndex: "addTime",
        },
        {
          title: "交易单号",
          dataIndex: "transactionId",
          flex: 1.5,
          customRender: (text, record) => {
            const payMode = record.payMode ? `(${record.payMode})` : "";
            return (text || "") + payMode;
          },
        },
        {
          title: "商品图片",
          dataIndex: "productAttachPath",
          customRender: (text, record) => {
            if (!text) {
              return "";
            }
            return <img src={text} style={{ width: "40px", height: "40px" }} />;
          },
        },
        {
          title: "商品名称",
          dataIndex: "productName",
        },
        // {
        //   title: "规格",
        //   dataIndex: "countryName",
        // },
        {
          title: "数量",
          dataIndex: "productQuantity",
        },
        {
          title: "支付金额",
          dataIndex: "productAmount",
        },
        {
          title: "收货人",
          dataIndex: "address",
          customRender: (text, record) => {
            if (!text) {
              return "";
            }
            return text.name || "";
          },
        },
      ],
      staffList: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "selectOrderDetail/" + record.id,
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
    ...mapState("selector", ["orderConditions"]),
    ...mapGetters("selector", ["formatOrderConditions"]),
  },
  methods: {
    ...mapMutations("selector", ["resetOrderConditions"]),
    ...mapActions("selector", ["selectorOrderList"]),
    getCustomList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = this.formatOrderConditions;
      conditions.status = this.status;
      this.selectorOrderList({
        conditions,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            this.loading = false;
            return;
          }
          this.staffList = res.data.rows;
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
      this.resetOrderConditions();
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
