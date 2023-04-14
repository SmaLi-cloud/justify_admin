<template>
  <div>
    <search-table
      :conditions="conditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="distributorList"
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
    <!-- <add-supplier
      ref="addTypeRef"
      :industryList="allIndustryList"
      :defaultValue="saveSupplierData"
      @onOk="typeSave"
    /> -->
    <review-modal ref="modalRef" @onOk="onExamineOk" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import ReviewModal from "./modules/ReviewModal.vue";
export default {
  components: { SearchTable, ReviewModal },
  data() {
    return {
      permission: "client",
      conditions: {
        contacter: "",
        phoneNumber: "",
        addTime: [],
      },
      searchs: [
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
          label: "分销类型",
          type: "select",
          key: "type",
          props: {
            style: "width:200px",
            options: [
              {
                label: "直播",
                value: "live",
              },
              {
                label: "电商",
                value: "online",
              },
              {
                label: "线下门店",
                value: "offline",
              },
              {
                label: "员工",
                value: "staff",
              },
            ],
          },
        },

        {
          label: "完成时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      toolbar: [
        // {
        //   label: "添加供应商",
        //   type: "primary",
        //   click: this.addType,
        //   key: "add",
        // },
      ],
      opCols: [
        {
          text: "审核",
          click: this.audit,
          icon: "",
          key: "audit",
          isHide: function (record) {
            if (record.isAuthentication === 0 && record.authStatus === 1) {
              return false;
            }
            return true;
          },
        },
        // {
        //   text: "删除",
        //   click: this.delete,
        //   icon: "detail",
        //   key: "detail",
        // },
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
          title: "联系人",
          dataIndex: "contacter",
        },
        {
          title: "手机号码",
          dataIndex: "phoneNumber",
          customRender: (text) => {
            return text || "/";
          },
        },
        {
          title: "分销类型",
          dataIndex: "type",
          customRender: (text, record) => {
            let obj = {
              live: "直播",
              online: "电商",
              offline: "线下门店",
              staff: "员工",
            };
            return obj[record.type] || "/";
          },
        },
        {
          title: "认证情况",
          dataIndex: "isAuthentication",
          customRender: (text, record) => {
            if (record.authStatus === 3) {
              return "认证未通过";
            } else if (text === 1 && record.authStatus === 2) {
              return "已认证";
            } else if (text === 0 && record.authStatus === 1) {
              return "待审核";
            } else {
              return "未认证";
            }
          },
        },
        {
          title: "选品数量",
          dataIndex: "selectedCount",
        },
        {
          title: "订单数量",
          dataIndex: "orderCount",
        },
        {
          title: "销售商品数量",
          dataIndex: "productQuantity",
        },
        {
          title: "订单总金额",
          dataIndex: "productAmount",
        },
        {
          title: "注册时间",
          dataIndex: "addTime",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      distributorList: [],
      auditId: "",
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "distributionDetail/" + record.id,
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
  watch: {},
  computed: {},
  methods: {
    ...mapActions("distribution", ["getDistributorList", "distributorExamine"]),
    audit(row) {
      this.auditId = row.id;
      this.$refs.modalRef.showModal();
    },
    onExamineOk(value) {
      this.distributorExamine({
        distributorId: this.auditId,
        ...value,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.$refs.modalRef.handleCancel();
        this.$message.success("审核完成");
        this.onRefresh();
      });
    },
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
      this.getDistributorList({
        conditions: conditions,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            this.loading = false;
            return;
          }
          this.distributorList = res.data.rows;
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
  },
};
</script>

<style scoped></style>
