<template>
  <div>
    <search-table
      style="margin-top: -20px"
      :conditions="conditions"
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
    <review-modal ref="modalRef" @onOk="onConfirm" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import ReviewModal from "./modules/ReviewModal.vue";
export default {
  components: { SearchTable, ReviewModal },
  props: {
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      permission: "settle_order.selector",
      confirmId: "",
      searchs: [],
      toolbar: [],
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
                path: "settleDetail/" + record.id,
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
    ...mapState("settle", ["conditions"]),
    ...mapGetters("settle", ["formatConditions"]),
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
          title: "结算单号",
          dataIndex: "orderNo",
        },
        {
          title: "结算起止时间",
          dataIndex: "startTime",
          customRender: (text, record) => {
            return record.startTime + " / " + record.endTime;
          },
        },
        {
          title: "结算订单数量",
          dataIndex: "orderQuantity",
        },
        {
          title: "结算金额",
          dataIndex: "amount",
        },

        {
          title: "选品官",
          dataIndex: "selectorName",
        },
        {
          title: "生成时间",
          dataIndex: "createTime",
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "action",
          },
        },
      ];

      if (this.status === "2") {
        columns[6] = {
          title: "确认时间",
          dataIndex: "confirmTime",
        };
        columns.splice(6, 0, { title: "确认人", dataIndex: "confirmerName" });
      } else if (this.status === "3") {
        columns[6] = {
          title: "结算时间",
          dataIndex: "settleTime",
        };
        columns.splice(6, 0, { title: "结算人", dataIndex: "settlerName" });
        columns.pop();
      }
      return columns;
    },
    opCols() {
      let cols = [
        {
          text: "确认",
          click: this.confirm,
          icon: "",
          key: "confirm",
        },
        {
          text: "结算",
          click: this.settle,
          icon: "",
          key: "settlement",
        },
      ];
      if (this.status === "0") {
        return [cols[0]];
      } else if (this.status === "1") {
        return [cols[1]];
      } else {
        return [];
      }
    },
  },
  methods: {
    ...mapMutations("settle", ["resetConditions"]),
    ...mapActions("settle", [
      "settleList",
      "settleOpConfirm",
      "settleOpSettle",
    ]),
    settle(row) {
      this.$confirm({
        title: "是否对该结算单结算？",
        onOk: () => {
          this.settleOpSettle({ id: row.id }).then((res) => {
            if (res.success) {
              this.onRefresh();
              this.$message.success("结算完成");
            }
          });
        },
      });
    },
    onConfirm(value) {
      this.settleOpConfirm({ id: this.confirmId, ...value }).then((res) => {
        if (res.success) {
          this.onRefresh();
          this.$message.success("确认完成");
          this.$refs.modalRef.handleCancel();
        }
      });
    },
    confirm(row) {
      this.confirmId = row.id;
      this.$refs.modalRef.showModal();
    },
    getCustomList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = this.formatConditions;
      conditions.status = this.status;
      this.settleList({
        conditions,
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
      this.resetConditions();
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
