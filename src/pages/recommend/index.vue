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
    <add-type
      ref="addTypeRef"
      :defaultValue="addTypeDefaultValue"
      @onOk="commitRecommend"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SearchTable from "@/components/table/SearchTable";
import { recommendType } from "./type";
import AddType from "./AddType";
export default {
  components: { SearchTable, AddType },
  data() {
    return {
      permission: "pro.recommend",
      addTypeDefaultValue: {},
      conditions: {},
      searchs: [
        {
          label: "推荐类型",
          type: "select",
          key: "recType",
          props: {
            style: "width:200px",
            options: recommendType,
          },
        },
        {
          label: "商品名称",
          type: "input",
          key: "productName",
        },
      ],
      toolbar: [
        {
          label: "添加推荐商品",
          type: "primary",
          click: this.add,
          key: "add",
        },
      ],
      opCols: [
        {
          text: "编辑",
          click: this.edit,
          icon: "edit",
          key: "edit",
        },
        {
          text: "删除",
          click: this.delete,
          icon: "delete",
          key: "delete",
          isHide: function (record) {
            if (record.recType === "main_pro") {
              return false;
            }
            return true
          },
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
          title: "推荐类型",
          dataIndex: "recType",
          customRender: (text) => {
            let showText = "";
            recommendType.some((item) => {
              if (item.value === text) {
                showText = item.label;
                return true;
              }
            });
            return showText;
          },
        },
        {
          title: "商品名称",
          dataIndex: "productName",
        },
        {
          title: "展示图片",
          dataIndex: "attach",
          customRender: (text) => {
            if (text && text.fileId) {
              return (
                <img src={text.thumbnailPath} style="height:40px; width:40px" />
              );
            }
          },
        },
        // {
        //   title: "是否展示",
        //   dataIndex: "isShow",
        //   customRender: (text) => {
        //     return text ? "是" : "否";
        //   },
        // },
        {
          title: "展示名称",
          dataIndex: "showName",
          customRender: (text) => {
            return text || "/";
          },
        },

        { title: "一级类型", dataIndex: "primaryName" },
        {
          title: "排序顺序",
          dataIndex: "order",
        },
      ],
      staffList: [],
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
    this.getStaffList();
    this.$bus.$off("newsListRefresh").$on("newsListRefresh", () => {
      this.onRefresh();
    });
  },
  computed: {},
  methods: {
    ...mapActions("recommend", [
      "recommendList",
      "recommendDelete",
      "recommendSave",
    ]),
    add() {
      this.$refs.addTypeRef.showModal();
    },
    delete(record) {
      this.$confirm({
        title: "确定删除该推荐展示?",
        onOk: () => {
          this.recommendDelete({
            recomId: record.id,
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
      let attach = [];
      if (record.attach && record.attach.fileId) {
        attach[0] = {
          fileId: record.attach.fileId,
          url: record.attach.attachPath,
        };
      }
      this.addTypeDefaultValue = {
        ...record,
        attach,
        proTypeId: record.primaryId || "",
      };
      console.log(this.addTypeDefaultValue);
      this.$refs.addTypeRef.showModal();
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
      this.recommendList({
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
    commitRecommend(value) {
      let recomInfo = { ...value };
      let type = recomInfo["recType"];
      if (recomInfo.attach && recomInfo.attach.length) {
        let attach = recomInfo.attach[0];
        if (recomInfo.id) {
          if (attach.fileId) {
            recomInfo.attach = {
              fileId: [attach.fileId],
              add: [],
            };
          } else {
            recomInfo.attach = {
              fileId: [],
              add: [attach.url],
            };
          }
        } else {
          recomInfo.attach = attach.url;
        }
      } else {
        delete recomInfo.attach;
      }
      this.recommendSave({
        type,
        recomInfo,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.onRefresh();
        this.$refs.addTypeRef.handleCancel();
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
