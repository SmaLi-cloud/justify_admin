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
          key: "isOffline",
          props: {
            style: "width:200px",
            options: [
              { label: "已上线", value: 0 },
              { label: "未上线", value: 1 },
            ],
          },
        },
        {
          label: "标题",
          type: "input",
          key: "title",
        },
        {
          label: "摘要",
          type: "input",
          key: "summary",
        },
      ],
      toolbar: [
        {
          label: "添加新闻",
          type: "primary",
          click: this.addNews,
          key: "add",
        },
      ],
      opCols: [
        {
          text: "下线",
          click: this.offLine,
          icon: "detail",
          key: "detail",
          isHide: function(record) {
            if (!record.isOffline) {
              return false;
            }
            return true;
          },
        },
        {
          text: "上线",
          click: this.onLine,
          icon: "detail",
          key: "detail",
          isHide: function(record) {
            if (!record.isOffline) {
              return true;
            }
            return false;
          },
        },
        {
          text: "编辑",
          click: this.edit,
          icon: "detail",
          key: "detail",
          isHide: function(record) {
            if (!record.isOffline) {
              return true;
            }
            return false;
          },
        },
        {
          text: "删除",
          click: this.delete,
          icon: "detail",
          key: "detail",
          isHide: function(record) {
            if (!record.isOffline) {
              return true;
            }
            return false;
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
          title: "状态",
          dataIndex: "isOffline",
          customRender: (text) => {
            if (!text) {
              return "已上线";
            } else {
              return "未上线";
            }
          },
        },
        {
          title: "标题",
          dataIndex: "title",
        },
     
        {
          title: "封面",
          dataIndex: "cover",
          customRender: (text) => {
            if (text && text.fileId) {
              return (
                <img
                  src={text.thumbnailPath}
                  style={{ width: "40px", height: "40px" }}
                />
              );
            }
            return (
              <img
                src={require("@/assets/img/loading_failed.jpg")}
                style={{ width: "40px", height: "40px" }}
              />
            );
          },
        },
        {
          title: "推荐置顶",
          dataIndex: "isTop",
          customRender: (text) => {
            if (text) {
              return "是";
            } else {
              return "否";
            }
          },
        },
        {
          title: "置顶序号",
          dataIndex: "topSn",
          customRender:(text)=>{
            if(!text&&text!==0&&text!=='0'){
            return '/'
            }
            return text
          }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
      ],
      staffList: [],
      customRow: (record) => {
        return {
          on: {
            click: (event) => {
              this.$router.push({
                path: "newsDetail/" + record.id,
              });
            },
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
    ...mapActions("news", ["getNewsList", "newsListDelete", "newsListPublish"]),
    addNews() {
      this.$router.push({
        path: "/news/addNews",
      });
    },
    onLine(record) {
      this.newsListPublish({
        newsId: record.id,
        isOffline: 0,
      }).then((res) => {
        if (res.success) {
          this.$message.success("发布成功");
          this.onRefresh();
          return;
        }
      });
    },
    offLine(record) {
      this.newsListPublish({
        newsId: record.id,
        isOffline: 1,
      }).then((res) => {
        if (res.success) {
          this.$message.success("已下线");
          this.onRefresh();
          return;
        }
      });
    },

    delete(record) {
      this.$confirm({
        title: "确定删除该新闻?",
        onOk: () => {
          this.newsListDelete({
            newsId: record.id,
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
      this.$router.push({
        path: "/news/addNews",
        query: {
          id: record.id,
        },
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
      this.getNewsList({
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
