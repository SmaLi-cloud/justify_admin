<template>
  <div>
    <search-table
      :conditions="conditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="supplierList"
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
      conditions: {
        company: "",
        supplierNo: "",
        contacter: "",
        phoneNumber: "",
        addTime: [],
      },
      searchs: [
        {
          label: "企业名称",
          type: "input",
          key: "company",
        },
        {
          label: "供应商编号",
          type: "input",
          key: "supplierNo",
        },
        {
          label: "联系人",
          type: "input",
          key: "contacter",
        },
        {
          label: "手机号码",
          type: "input",
          key: "phoneNumber",
        },
        {
          label: "类型",
          type: "select",
          key: "type",
          props: {
            style: "width:200px",
            options: [
              {
                label: "工厂端",
                value: "factory",
              },
              {
                label: "品牌商",
                value: "brand",
              },
              {
                label: "方案商",
                value: "solution",
              },
            ],
          },
        },
        {
          label: "注册时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      toolbar: [
      ],
      opCols: [
        {
          text: "登录",
          click: this.onLogin,
          icon: "detail",
          key: "login",
        },
      ],
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
          title: "企业名称",
          dataIndex: "company",
        },
        {
          title: "供应商编号",
          dataIndex: "supplierNo",
        },
        {
          title: "类型",
          dataIndex: "type",
          customRender: (text, record) => {
            let obj = {
              factory: "工厂端",
              solution: "方案商",
              brand: "品牌商",
            };
            return obj[record.type] || "/";
          },
        },
        {
          title: "联系人",
          dataIndex: "contacter",
        },
        {
          title: "手机号码",
          dataIndex: "phoneNumber",
        },
        {
          title: "带货人数",
          dataIndex: "distributorCount",
        },
        {
          title: "产品数量",
          dataIndex: "productCount",
        },
        {
          title: "注册时间",
          dataIndex: "addTime",
        },
        // {
        //   title: "操作",
        //   scopedSlots: { customRender: "action" },
        // },
      ],
      saveSupplierData: {},
      supplierList: [],
      allTypeList: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "selectSupplierDetail/" + record.id,
              });
            },
          },
        };
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    ...mapActions("selector", [
      "selectorSupList",
      "supplierLogin",
    ]),
    getList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = Object.assign({}, this.conditions);
      if (conditions.addTime && conditions.addTime.length > 0) {
        conditions.addTime = {
          start: conditions.addTime[0].format("YYYY-MM-DD 00:00:00"),
          end: conditions.addTime[1].format("YYYY-MM-DD 23:59:59"),
        };
      } else {
        delete conditions.addTime;
      }
      this.selectorSupList({
        conditions: conditions,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            this.loading = false;
            return;
          }
          this.supplierList = res.data.rows;
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
      this.getList();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.pageSize = size;
      this.getList();
    },
    onRefresh() {
      this.getList();
    },
    onReset() {
      (this.conditions = {}), this.getList();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getList();
    },
    onLogin(row) {
      this.$confirm({
        title: "确定是否登录?",
        onOk: () => {
          this.supplierLogin({ id: row.id }).then((res) => {
            if (res.success) {
              window.open(res.data, "_blank");
            }
          });
        },
      });
      return false;
    },
  },
};
</script>

<style scoped></style>
