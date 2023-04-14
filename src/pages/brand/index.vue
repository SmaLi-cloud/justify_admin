<template>
  <div>
    <search-table
      :conditions="conditions"
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
import { mapActions, mapGetters } from "vuex";
import SearchTable from "@/components/table/SearchTable";

export default {
  components: { SearchTable },
  data() {
    return {
      permission: "client",
      conditions: {},
      searchs: [
        {
          label: "状态",
          type: "select",
          key: "status",
          props: {
            style: "width:200px",
            options: [
              { label: "待审核", value: 1 },
              { label: "通过", value: 2 },
              { label: "不通过", value: 3 },
            ],
          },
        },
        {
          label: "品牌名称",
          type: "input",
          key: "name",
        },
        {
          label: "商标注册号",
          type: "input",
          key: "trademarkNumber",
        },
        {
          label: "类型",
          type: "select",
          key: "type",
          props: {
            style: "width:200px",
            options: [
              { label: "自创品牌", value: "own" },
              { label: "授权品牌", value: "license" },
            ],
          },
        },
      ],
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
        // {
        //   title: "操作",
        //   scopedSlots: {
        //     customRender: "action",
        //   },
        // },
        {
          title: "状态",
          dataIndex: "status",
          customRender: (text) => {
            let statusName = ["", "待审核", "通过", "不通过"];
            return statusName[text || 0];
          },
        },
        {
          title: "品牌名称",
          dataIndex: "name",
        },
        {
          title: "类型",
          dataIndex: "type",
          customRender: (text) => {
            let typeName = {
              own: "自创品牌",
              license: "授权品牌",
            };
            return typeName[text];
          },
        },
        {
          title: "公司名称",
          dataIndex: "accountName",
        },
        {
          title: "注册商标号",
          dataIndex: "trademarkNumber",
          customRender: (text) => {
            return text || "/";
          },
        },
        {
          title: "添加时间",
          dataIndex: "addTime",
        },
      ],
      staffList: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "brandDetail/" + record.id,
              });
            },
          },
        };
      },
    };
  },
  mounted() {
    this.getStaffList();
  },
  computed: {},
  methods: {
    ...mapActions("brand", ["getBrandList"]),
    getStaffList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = Object.assign({}, this.conditions);
      if (conditions.lastLoginTime && conditions.lastLoginTime.length > 0) {
        conditions.lastLoginTime = {
          start: conditions.lastLoginTime[0].format("YYYY-MM-DD 00:00:00"),
          end: conditions.lastLoginTime[1].format("YYYY-MM-DD 23:59:59"),
        };
      } else {
        delete conditions.lastLoginTime;
      }
      this.getBrandList({
        conditions: conditions,
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
      this.getStaffList();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.pageSize = size;
      this.getStaffList();
    },
    onRefresh() {
      this.getStaffList();
    },
    onReset() {
      (this.conditions = {}), this.getStaffList();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getStaffList();
    },
  },
};
</script>

<style scoped></style>
