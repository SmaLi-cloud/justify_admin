<template>
  <a-layout-sider
    :theme="sideTheme"
    :class="['side-menu', isMobile ? null : 'shadow']"
    width="220px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <div :class="['logo', theme]">
      <router-link to="/dashboard/workplace">
        <img src="@/assets/img/logo.png" />
        <h1>{{ systemName }}</h1>
      </router-link>
    </div>
    <div :class="['side-menu-content', 'beauty-scroll']">
      <MenuItem
        :theme="theme"
        :collapsed="collapsed"
        :options="menuData"
        @select="onSelect"
        class="menu"
      />
    </div>
  </a-layout-sider>
</template>

<script>
import MenuItem from './MenuItem';
import { mapState } from 'vuex';
export default {
  name: 'SideMenu',
  components: { MenuItem },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark';
    },
    ...mapState('setting', ['isMobile', 'systemName']),
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj);
    },
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>
