<template>
    <div>
      <search-table :conditions="conditions" :searchs="searchs" :columns="columns" :dataSource="roleList"
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
      <RoleEdit ref="roleEdit" @ok="onRefresh" />
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import SearchTable from "@/components/table/SearchTable";
  import RoleEdit from "./modules/RoleEdit";

  export default {
    components: { SearchTable, RoleEdit },
    data() {
      return {
        permission: "sys.role.list",
        conditions: {
          name: "",
          code: "",
          platform: "",
        },
        sourceList: [],
        searchs: [
          {
            label: "角色名称",
            type: "input",
            key: "name",
          },
          {
            label: "拥有权限",
            type: "tree-select",
            key: "permissions",
            props: {
              style: "width:150px",
              keyFieldName: "id",
              parentFieldName: "parentId",
              rootParentValue: "",
              props: {
                widthParentId: true,
                treeCheckable: false,
              },
              config: {
                label: "name",
                val: "id",
                parentDisabled: false,
              },
              data: [],
              ref: "permission"
            },
          }
        ],
        toolbar: [
          {
            label: "添加角色",
            type: "primary",
            click: this.onAddRole,
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
            title: "拥有权限",
            dataIndex: "permissionNames",
            customRender: (text) => {
                return text.toString();
            },
          },
          {
            title: "描述",
            dataIndex: "desc",
          },
          {
            title: "操作",
            scopedSlots: { customRender: "action" },
          },
        ],
        roleList: [],
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
      this.getRoleList();
      this.init();
    },
    computed: {
    },
    methods: {
      ...mapActions("sys", ["searchRole", "getPermissionList", "saveRole", "deleteRole"]),
      init() {
        this.getPermissionList({ }).then((res) => {
        if (res.success) {
          this.$refs.searchTable.$refs.permission.rawData = res.data;
        }
      });
      },
      getRoleList() {
        this.loading = true;
        const { page, pageSize } = this;
        let conditions = Object.assign({}, this.conditions);
        this.searchRole({
          conditions: conditions,
          page: page,
          size: pageSize,
        }).then((res) => {
          this.roleList = res.data.rows;
          this.page = page;
          this.total = res.data.count;
          this.pageSize = pageSize;
          this.loading = false;
        });
      },
      onSearch() {
        this.page = 1;
        this.getRoleList();
      },
      onSizeChange(current, size) {
        this.page = 1;
        this.pageSize = size;
        this.getRoleList();
      },
      onRefresh() {
        this.getRoleList();
      },
      onReset() {
        (this.conditions = {
          name: "",
          code: "",
          platform: "",
        }),
          this.getRoleList();
      },
      onPageChange(page, pageSize) {
        this.page = page;
        this.pageSize = pageSize;
        this.getRoleList();
      },
      onEdit(row) {
        this.$refs.roleEdit.showModal(row);
        return false;
      },
      onAddRole() {
        this.$refs.roleEdit.showModal({}, "add");
      },
      onDelete(row) {
        this.$confirm({
          title: "确定删除该角色?",
          onOk: () => {
            this.deleteRole({ roleId: row.id }).then((res) => {
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
  