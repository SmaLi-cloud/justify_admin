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
    <add-type ref="addTypeRef" :defaultValue="addTypeValue" @onOk="typeSave" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import addType from "./modules/AddType.vue";
export default {
  components: { SearchTable, addType },
  data() {
    return {
      permission: "client",
      conditions: {},
      searchs: [
        {
          label: "分类",
          type: "select",
          key: "level",
          props: {
            style: "width:200px",
            options: [
              { label: "一级类目", value: 1 },
              { label: "二级类目", value: 2 },
            ],
          },
        },
        {
          label: "类目名称",
          type: "input",
          key: "name",
        },
      ],
      toolbar: [
        {
          label: "添加类目",
          type: "primary",
          click: this.addType,
          key: "add",
        },
      ],
      opCols: [
        {
          text: "编辑",
          click: this.edit,
          icon: "detail",
          key: "detail",
        },
        {
          text: "删除",
          click: this.delete,
          icon: "detail",
          key: "detail",
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
          title: "操作",
          scopedSlots: {
            customRender: "action",
          },
        },
        {
          title: "图标",
          dataIndex: "icon",
          customRender: (text) => {
            if (text && text.fileId) {
              return (
                <img
                  src={text.attachPath}
                  style={{ width: "40px", height: "40px" }}
                />
              );
            }else {
              return "/"
            }
          },
        },
        {
          title: "类目",
          dataIndex: "level",
          customRender: (text) => {
            let type = ["一级类目", "二级类目"];
            return type[text - 1] || "/";
          },
        },
        {
          title: "类目名称",
          dataIndex: "name",
        },
        {
          title: "上级类目",
          dataIndex: "parentName",
        },
        {
          title: "创建时间",
          dataIndex: "addTime",
        },
      ],
      addTypeValue: {},
      productList: [],
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
    this.getList();
  },
  computed: {},
  methods: {
    ...mapActions("product", ["getTypeList", "typeListDelete", "typeListSave"]),
    addType() {
      this.$refs.addTypeRef.showModal();
    },
    typeSave(value) {
      value = {
        ...value,
      };
      const { icon } = value;
      if (icon && icon.length) {
        let iconData = icon[0];
        if (iconData.fileId) {
          value.iconFileId = iconData.fileId;
          delete value.icon;
        } else {
          value.icon = iconData.url;
        }
      } else {
        delete value.icon;
      }
      this.typeListSave({ saveInfo: value }).then((res) => {
        if (!res.success) {
          return;
        }
        this.$message.success("添加/修改类目成功");
        this.$refs.addTypeRef.handleCancel();
        this.onRefresh();
      });
    },
    delete(record) {
      this.$confirm({
        title: "确定删除该类目?",
        onOk: () => {
          this.typeListDelete({
            proTypeId: record.id,
          }).then((res) => {
            if (!res.success) {
              return;
            }
            this.$message.success("删除成功");
            this.onRefresh();
          });
        },
      });
    },
    edit(record) {
      let icon = [];
      if (record.icon && record.icon.fileId) {
        icon[0] = {
          fileId: record.icon.fileId,
          url: record.icon.attachPath,
        };
      }
      this.addTypeValue = {
        ...record,
        icon,
      };
      this.$refs.addTypeRef.showModal();
    },
    getList() {
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
      this.getTypeList({
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
