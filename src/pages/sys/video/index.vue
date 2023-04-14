<template>
    <div>
      <search-table :conditions="conditions" :searchs="searchs" :columns="columns" :dataSource="videoList"
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
      <AddVideo ref="addVideo" @ok="onRefresh" />
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import SearchTable from "@/components/table/SearchTable";
  import AddVideo from "./modules/AddVideo";

  export default {
    components: { SearchTable, AddVideo },
    data() {
      return {
        permission: "sys.role.list",
        conditions: {
          device: ""
        },
        sourceList: [],
        searchs: [
          {
            label: "设备名称",
            type: "input",
            key: "device",
          }
        ],
        toolbar: [
          {
            label: "添加视频",
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
            title: "设备名称",
            dataIndex: "device",
          },
          {
            title: "视频地址",
            dataIndex: "src",
          },
          {
            title: "视频格式",
            dataIndex: "type",
            customRender: (text) => {
            return text || "/";
          },
          },
          {
            title: "播放顺序",
            dataIndex: "ordinal",
          },
          {
            title: "操作",
            scopedSlots: { customRender: "action" },
          },
        ],
        videoList: [],
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
      this.getVideoList();
    },
    computed: {
    },
    methods: {
      ...mapActions("sys", ["searchVideo", "getPermissionList", "saveRole", "deleteVideo"]),
      getVideoList() {
        this.loading = true;
        const { page, pageSize } = this;
        let conditions = Object.assign({}, this.conditions);
        this.searchVideo({
          conditions: conditions,
          page: page,
          size: pageSize,
        }).then((res) => {
          this.videoList = res.data.rows;
          this.page = page;
          this.total = res.data.count;
          this.pageSize = pageSize;
          this.loading = false;
        });
      },
      onSearch() {
        this.page = 1;
        this.getVideoList();
      },
      onSizeChange(current, size) {
        this.page = 1;
        this.pageSize = size;
        this.getVideoList();
      },
      onRefresh() {
        this.getVideoList();
      },
      onReset() {
        (this.conditions = {
          device: ""
        }),
          this.getVideoList();
      },
      onPageChange(page, pageSize) {
        this.page = page;
        this.pageSize = pageSize;
        this.getVideoList();
      },
      onEdit(row) {
        this.$refs.addVideo.showModal(row);
        return false;
      },
      onAddRole() {
        this.$refs.addVideo.showModal({}, "add");
      },
      onDelete(row) {
        this.$confirm({
          title: "确定删除该视频?",
          onOk: () => {
            this.deleteVideo({ videoId: row.id }).then((res) => {
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
  