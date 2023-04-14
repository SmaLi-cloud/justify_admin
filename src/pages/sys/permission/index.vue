<template>
    <div>
      <search-table :conditions="conditions" :searchs="searchs" :columns="columns" :dataSource="permissionList"
        :loading="loading" :onSearch="onSearch" :onRefresh="onRefresh" :onReset="onReset" :toolbar="toolbar"
        :opCols="opCols" :permission="permission" :customRow="customRow" :pagination="{
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
        }" ref="searchTable">
      </search-table>
      <PermissionEdit ref="permissionEdit" @ok="onRefresh" />
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import SearchTable from "@/components/table/SearchTable";
  import PermissionEdit from "./modules/PermissionEdit";

  export default {
    components: { SearchTable, PermissionEdit },
    data() {
      return {
        permission: "sys.permission.list",
        conditions: {
          name: "",
          code: "",
          platform: "",
        },
        sourceList: [],
        searchs: [
          {
            label: "名称",
            type: "input",
            key: "name",
          },
          {
            label: "权限编号",
            type: "input",
            key: "code",
          },
          {
            label: "平台",
            type: "select",
            key: "platform",
            props: {
              style: "width:150px",
              options: [
                {
                  label: "pc端",
                  value: "pc",
                },
                {
                  label: "移动端",
                  value: "app",
                }
              ]
            },
          },
        ],
        toolbar: [
          {
            label: "添加权限",
            type: "primary",
            click: this.onAddPermission,
            key: "add",
          }
        ],
        opCols: [
          {
            text: "编辑",
            click: this.onEdit,
            icon: "edit",
            key: "edit",
          },
          {
            text: "删除",
            click: this.onDelete,
            icon: "delete",
            key: "delete",
          },
        ],
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
          {
            title: "名称",
            dataIndex: "name",
          },
          {
            title: "权限编码",
            dataIndex: "code",
          },
          {
            title: "平台",
            dataIndex: "platform",
          },
          {
            title: "层级",
            dataIndex: "level",
          },
          {
            title: "排序",
            dataIndex: "orderNo",
          },
          {
            title: "操作",
            scopedSlots: { customRender: "action" },
          },
        ],
        permissionList: [],
        customRow: (record) => {
          return {
            on: {
              // 事件
              click: (event) => { 
              }, 
            },
          };
        },
      };
    },
    mounted() {
      this.getPermissionList();
      this.init();
    },
    computed: {
    },
    methods: {
      ...mapActions("sys", ["searchPermission", "deletePermission", "savePermission"]),
      init() {
      },
      getPermissionList() {
        this.loading = true;
        const { page, pageSize } = this;
        let conditions = Object.assign({}, this.conditions);
  
        this.searchPermission({
          conditions: conditions,
          page: page,
          size: pageSize,
        }).then((res) => {
          this.permissionList = res.data.rows;
          this.page = page;
          this.total = res.data.count;
          this.pageSize = pageSize;
          this.loading = false;
        });
      },
      onSearch() {
        this.page = 1;
        this.getPermissionList();
      },
      onSizeChange(current, size) {
        this.page = 1;
        this.pageSize = size;
        this.getPermissionList();
      },
      onRefresh() {
        this.getPermissionList();
      },
      onReset() {
        (this.conditions = {
          name: "",
          code: "",
          platform: "",
        }),
          this.getPermissionList();
      },
      onPageChange(page, pageSize) {
        this.page = page;
        this.pageSize = pageSize;
        this.getPermissionList();
      },
      onEdit(row) {
        this.$refs.permissionEdit.showModal(row);
        return false;
      },
      onAddPermission() {
        this.$refs.permissionEdit.showModal({}, "add");
      },
      onDelete(row) {
        this.$confirm({
          title: "确定删除该权限?",
          onOk: () => {
            this.deletePermission({ permissionId: row.id }).then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.onRefresh();
              }
            });
          },
        });
        return false;
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  