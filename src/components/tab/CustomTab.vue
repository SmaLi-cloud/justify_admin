<template>
  <div>
    <div :class="['search-head', layout, pageWidth]">
      <div style="padding: 0 24px; margin-top: 15px">
        <a-tabs
          :tabBarStyle="{ margin: 0 }"
          @change="navigate"
          :activeKey="activeKey"
        >
          <template v-for="(item) in tabs">
            <a-tab-pane
              v-if="checkUserPermission(permission + '.' + item.key)"
              :tab="item.label"
              :key="item.key"
            ></a-tab-pane>
          </template>
        </a-tabs>
      </div>
    </div>
    <div class="search-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { checkUserPermission } from "@/utils/permission";
export default {
  name: "CustomTab", //组件名
  props: {
    tabs: Array,
    permission: String,
  },
  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    activeKey() {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.$route.path == this.tabs[i].path) {
          return this.tabs[i].key;
        }
      }
      return this.tabs[0].key;
    },
  },
  methods: {
    navigate(key) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (key == this.tabs[i].key) {
          this.$router.push({path:this.tabs[i].path,query:this.tabs[i].query});
          break;
        }
      }
    },
    checkUserPermission(code) {
      return checkUserPermission(code);
    },
  },
};
</script>

<style lang="less" scoped>
.search-head {
  background-color: @base-bg-color;
  margin: -24px;
  &.head.fixed {
    margin: -24px 0;
  }
  .search-input {
    text-align: center;
  }
}
.search-content {
  margin-top: 48px;
}
</style>