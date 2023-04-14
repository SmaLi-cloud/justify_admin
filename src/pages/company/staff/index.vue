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
    <StaffEdit ref="staffEdit" @ok="onRefresh" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import StaffEdit from "./modules/StaffEdit";

export default {
  components: { SearchTable, StaffEdit },
  data() {
    return {
      permission: "co.staff.list",
      conditions: {
        trueName: "",
        nickname: "",
        staffId: "",
        phone: "",
        lastLoginTime: [],
        enable: "",
      },
      searchs: [
        {
          label: "状态",
          type: "select",
          key: "status",
          props: {
            style: "width:150px",
            options: [
              {
                label: "全部",
                value: "",
              },
              {
                label: "启用",
                value: 1,
              },
              {
                label: "禁用",
                value: 0,
              },
            ],
          },
        },
        {
          label: "部门",
          type: "tree-select",
          key: "deptId",
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
              label: "deptName",
              val: "deptNo",
              parentDisabled: false,
            },
            data: [],
            ref: "dept",
          },
        },
        {
          label: "姓名",
          type: "input",
          key: "trueName",
        },
        {
          label: "工号",
          type: "input",
          key: "staffId",
        },
        {
          label: "手机号",
          type: "input",
          key: "phone",
        },
      ],
      toolbar: [
        {
          label: "添加员工",
          type: "primary",
          click: this.onAddStaff,
          key: "add",
        },
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
          title: "状态",
          dataIndex: "status",
          customRender: (text) => {
            return text == 1 ? "启用" : "禁用";
          },
        },
        {
          title: "头像",
          dataIndex: "avatar",
          customRender: (text) => {
            let children = [];
            let src = "https://file.yth.jiepei.com/integration/avatar/default.png"
            if(text&&text.attachPath){
              src = text.attachPath
            }
            children.push(
              this.$createElement("img", {
                domProps: {
                  src
                },
                style: {
                  width: "50px",
                  height: "50px",
                  marginRight: "5px",
                },
              })
            );
            const obj = {
              children,
              attrs: {},
            };
            return children.length ? obj : "/";
          },
        },
        {
          title: "工号",
          dataIndex: "staffId",
        },
        {
          title: "姓名",
          dataIndex: "trueName",
        },
        {
          title: "花名",
          dataIndex: "nickname",
        },
        {
          title: "部门",
          dataIndex: "deptName",
          customRender: (text) => {
            if (text) {
              return text.toString();
            }
            return "";
          },
        },
        {
          title: "岗位",
          dataIndex: "title",
          customRender: (text) => {
            if (text) {
              return text.toString();
            }
            return "";
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      staffList: [],
      customRow: (record) => {
        return {
          on: {
            // 事件
            click: (event) => {
              // this.$router.push({ path: '/company/staff/detail', query: { id: record.id } })
            }, // 点击行
          },
        };
      },
    };
  },
  mounted() {
    this.getStaffList();
    this.init();
  },
  computed: {
    ...mapGetters("staff", { userInfo: "staffInfo" }),
  },
  methods: {
    ...mapActions("staff", ["searchStaff", "deleteStaff"]),
    ...mapActions("dept", ["getDeptList"]),
    init() {
      this.getDeptList({}).then((res) => {
        if (res.success) {
          this.$refs.searchTable.$refs.dept.rawData = res.data;
        }
      });
    },
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

      this.searchStaff({
        conditions: conditions,
        page: page,
        size: pageSize,
      }).then((res) => {
        this.staffList = res.data.rows;
        this.page = page;
        this.total = res.data.count;
        this.pageSize = pageSize;
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
      (this.conditions = {
        trueName: "",
        nickname: "",
        staffId: "",
        phone: "",
        lastLoginTime: [],
      }),
        this.getStaffList();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getStaffList();
    },
    onEdit(row) {
      this.$refs.staffEdit.showModal(row);
      return false;
    },
    onAddStaff() {
      this.$refs.staffEdit.showModal({}, "add");
    },
    onDelete(row) {
      this.$confirm({
        title: "确定删除该员工?",
        onOk: () => {
          this.deleteStaff({ staffId: row.id }).then((res) => {
            if (res.success) {
              this.$message.success("删除成功");
              this.onRefresh();
            }
          });
        },
      });
      return false;
    },
    //洗数据
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "sex") {
            return v[j] == 1 ? "男" : "女";
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>

<style scoped></style>
