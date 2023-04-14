<template>
  <div>
    <search-table
      :conditions="conditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="productList"
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

    <add-in-out
      ref="addInOutRef"
      :type="addType"
      @onOk="onSubmit"
      :stockProduct="stockProduct"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import addInOut from "./modules/addInOut.vue";
export default {
  components: { SearchTable, addInOut },
  data() {
    return {
      permission: "",
      addType: "",
      conditions: {
        storageTime: [],
      },
      searchs: [
        {
          label: "产品名称",
          type: "input",
          key: "name",
        },
        {
          label: "型号",
          type: "input",
          key: "supModel",
        },
        {
          label: "产品类目",
          type: "tree-select",
          key: "productType",
          props: {
            style: "width:200px",
            keyFieldName: "id",
            parentFieldName: "parentId",
            rootParentValue: "",
            props: {
              widthParentId: true,
              treeCheckable: false,
            },
            data: [],
            ref: "productTypeRef",
            config: {
              label: "name",
              val: "id",
              parentDisabled: false,
            },
          },
        },
        {
          label: "处理人",
          type: "input",
          key: "storageStaffName",
        },
        {
          label: "入库时间",
          type: "range-picker",
          key: "storageTime",
        },
      ],
      toolbar: [
        {
          label: "新增入库",
          type: "primary",
          click: this.addIn,
          key: "add",
        },
        {
          label: "新增出库",
          type: "primary",
          click: this.addOut,
          key: "add",
        },
      ],
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
          title: "产品名称",
          dataIndex: "name",
        },
        {
          title: "产品图片",
          dataIndex: "attachs",
          customRender: (text, row, index) => {
            if (text) {
              return (
                <img
                  src={text.thumbnailPath}
                  style={{ width: "40px", height: "40px" }}
                />
              );
            }
            return "";
          },
        },
        {
          title: "类型",
          dataIndex: "primaryTypeName",
          customRender: (text, rows) => {
            return (
              (text || "") +
              ((rows.secondaryTypeName || "") && "—" + rows.secondaryTypeName)
            );
          },
        },
        {
          title: "型号",
          dataIndex: "supModel",
        },
        {
          title: "捷配编码",
          dataIndex: "jpModel",
        },
        {
          title: "零售价",
          dataIndex: "retailPrice",
        },
        {
          title: "库位",
          dataIndex: "locationId",
        },
        // {
        //   title: "数量",
        //   dataIndex: "storageQuantity",
        // },
        {
          title: "样品数量",
          dataIndex: "sampleQuantity",
        },
        {
          title: "样品金额",
          dataIndex: "sampleAmount",
        },
        {
          title: "入库时间",
          dataIndex: "storageTime",
          customRender: (text, record) => {
            if (record.sampleStorageInfo) {
              return record.sampleStorageInfo.addTime;
            }
          },
        },
        {
          title: "处理人",
          dataIndex: "storageStaffName",
          customRender: (text, record) => {
            if (record.sampleStorageInfo) {
              return record.sampleStorageInfo.staffName;
            }
          },
        },
        // {
        //   title: "操作",
        //   scopedSlots: { customRender: "action" },
        // }
      ],
      productList: [],
      stockProduct: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "sampleDetail/" + record.id,
              });
            },
          },
        };
      },
    };
  },
  mounted() {
    this.getList();
    this.getAllTypeList();
  },
  watch: {},
  methods: {
    ...mapActions("technology", [
      "technologyList",
      "beStockProduct",
      "inStockProduct",
      "outStockAdd",
      "inStockAdd",
      "proModel",
    ]),
    ...mapActions("product", ["getAllProductType"]),
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        this.searchs[2].props.data = res.data;
        this.$refs.searchTable.$refs.productTypeRef.rawData = res.data;
      });
    },

    onSubmit(value) {
      if (this.addType === "in") {
        this.inStockAdd({ inInfo: { ...value } }).then((res) => {
          if (res.success) {
            this.$message.success("新增入库成功");
            this.onRefresh();
            this.$refs.addInOutRef.handleCancel();
          }
        });
      } else if (this.addType === "out") {
        this.outStockAdd({ ...value }).then((res) => {
          if (res.success) {
            this.$message.success("新增出库成功");
            this.onRefresh();
            this.$refs.addInOutRef.handleCancel();
          }
        });
      }
    },
    addIn() {
      this.addType = "in";
      this.$refs.addInOutRef.showModal();
    },
    addOut() {
      this.addType = "out";
      this.$refs.addInOutRef.showModal();
    },
    getList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = Object.assign({}, this.conditions);
      if (conditions.storageTime && conditions.storageTime.length > 0) {
        conditions.storageTime = {
          start: conditions.storageTime[0].format("YYYY-MM-DD 00:00:00"),
          end: conditions.storageTime[1].format("YYYY-MM-DD 23:59:59"),
        };
      } else {
        delete conditions.storageTime;
      }
      this.technologyList({
        conditions: conditions,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            this.loading = false;
            return;
          }
          this.productList = res.data.rows;
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
