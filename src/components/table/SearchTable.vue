<template>
  <div>
    <a-card v-if="searchs.length != 0">
      <a-form layout="inline" :model="conditions">
        <template v-for="(item, index) in searchs">
          <a-form-item
            v-if="checkUserPermission(permission + '.search.' + item.key)"
            :label="item.label"
            :key="index"
          >
            <a-input
              v-if="item.type === 'input'"
              v-model="conditions[item.key]"
            ></a-input>
            <a-select
              v-else-if="item.type === 'select'"
              v-bind="item.props"
              v-model="conditions[item.key]"
            ></a-select>
            <tree-select
              v-else-if="item.type === 'tree-select'"
              v-bind="item.props"
              v-model="conditions[item.key]"
            ></tree-select>
            <a-tree-select
              v-else-if="item.type === 'a-tree-select'"
              v-bind="item.props"
              v-model="recordConditions[item.key]"
            ></a-tree-select>
            <a-time-range-picker
              v-else-if="item.type === 'time-range-picker'"
              v-model="conditions[item.key]"
              v-bind="item.props"
            ></a-time-range-picker>
            <a-range-picker
              v-else-if="item.type === 'range-picker'"
              v-model="conditions[item.key]"
              v-bind="item.props"
            ></a-range-picker>
            <a-time-picker
              v-else-if="item.type === 'time-picker'"
              v-model="conditions[item.key]"
              v-bind="item.props"
            ></a-time-picker>
          </a-form-item>
        </template>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="onSearch">
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-space>
        <template v-for="(item, index) in toolbar">
          <a-button
            ghost
            v-if="checkUserPermission(permission + '.tool_bar.' + item.key)"
            :type="item.type"
            :key="index"
            @click="item.click"
            >{{ item.label }}</a-button
          >
        </template>
      </a-space>
    </a-card>
    <standard-table
      style="margin-top: 12px"
      :columns="perColumns"
      :data-source="dataSource"
      :loading="loading"
      :customRow="customRow"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      @reset="onReset"
      :pagination="pagination"
      :scroll="scroll"
      :selectedRows.sync="selectedRowsTemp"
      @selectedRowChange="selectedRowChange"
      :rowSelection="rowSelection"
    >
      <div
        slot="action"
        slot-scope="{ text, record }"
        style="white-space: nowrap"
      >
        <template v-for="(item, index) in opCols">
          <a
            style="margin-right: 8px"
            :key="index"
            v-if="
              checkUserPermission(permission + '.op.' + item.key) &&
              !(item.isHide && item.isHide(record))
            "
            @click.stop="item.click(record)"
          >
            <a-icon :type="item.icon" />{{ item.text }}
          </a>
        </template>
      </div>
    </standard-table>
  </div>
</template>
<script>
import StandardTable from "@/components/table/StandardTable";
import { checkUserPermission, getChildPermissions } from "@/utils/permission";
import TreeSelect from "@/components/select/TreeSelect.vue";

export default {
  name: "SearchTable", //组件名
  components: { StandardTable, TreeSelect },
  props: {
    searchs: Array,
    conditions: Object,
    columns: Array,
    dataSource: Array,
    toolbar: Array,
    opCols: Array,
    pagination: {
      type: [Object, Boolean],
      default: true,
    },
    onSearch: Function,
    onReset: Function,
    onRefresh: Function,
    customRow: Function,
    loading: Boolean,
    permission: String,
    scroll: {
      type: Object,
      default: () => ({}),
    },
    selectedRows: Array,
    rowSelection: Object,
  },
  data() {
    return {
      selectedRowsTemp: this.selectedRows,
    };
  },
  computed: {
    perColumns() {
      let columns = this.columns || [];
      const permissions = getChildPermissions(this.permission);
      for (let i = 0; i < permissions.length; i++) {
        let permission = permissions[i];
        if (checkUserPermission(permission)) {
          continue;
        }
        let permissionNode = permission
          .replace(this.permission + ".", "")
          .split(".");
        if (permissionNode[0] == "cols") {
          const index = this.getObjIndex(
            columns,
            "dataIndex",
            permissionNode[1]
          );
          if (index >= 0 && permissionNode.length == 2) {
            columns.splice(index, 1);
          }
        }
      }
      return columns;
    },
  },
  methods: {
    checkUserPermission(code) {
      return checkUserPermission(code);
    },
    selectedRowChange(selectedRowKeys, selectedRows) {},
    getObjIndex(objList, attribute, value) {
      for (let i = 0; i < objList.length; i++) {
        if (objList[i][attribute] == value) {
          return i;
        }
      }
      return -1;
    },
  },
  watch: {
    selectedRowsTemp(val) {
      this.$emit("update:selectedRows", val);
    },
  },
};
</script>

<style scoped lang="less">
.standard-table {
  .alert {
    margin-bottom: 16px;
    .message {
      a {
        font-weight: 600;
      }
    }
    .clear {
      float: right;
    }
  }
}
</style>
