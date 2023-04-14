<template>
  <div>
    <search-table
      style="margin-top: -20px"
      :conditions="recordConditions"
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
      permission: "",
      searchs: [],
      toolbar: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      opCols: [],
      sourceList: [],
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "产品名称",
          dataIndex: "proName",
        },
        {
          title: "产品图片",
          dataIndex: "proImg",
          customRender: (text, row, index) => {
            if (text ) {
              return (
                <img
                  src={text}
                  style={{ width: "40px", height: "40px" }}
                />
              );
            }
            return "";
          },
        },
        {
          title: "型号",
          dataIndex: "supModel",
        },
         {
          title: "产品规格型号",
          dataIndex: "productModelNo",
        },
        {
          title: "捷配型号",
          dataIndex: "jpModel",
        },
        {
          title: "库位",
          dataIndex: "locationId",
        },
        {
          title: "数量",
          dataIndex: "quantity",
        },
        {
          title: "时间",
          dataIndex: "addTime",
        },
        {
          title: "处理人",
          dataIndex: "staffName",
        },
        {
          title: "备注",
          dataIndex: "remark",
        },
      ],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {},
          },
        };
      },
    };
  },
  mounted() {
    this.getCustomList();
  },
  computed: {
    ...mapState("technology",["recordConditions"]),
    ...mapGetters("technology", ["formatRecordConditions"]),
  },
  methods: {
    ...mapMutations("technology", ["resetRecordConditions"]),
    ...mapActions("technology", ["inOutRecord"]),
    getCustomList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = this.formatRecordConditions;
      conditions.status = this.status;
      this.inOutRecord({
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
      this.resetRecordConditions();
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
