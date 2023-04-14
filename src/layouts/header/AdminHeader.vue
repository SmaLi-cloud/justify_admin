<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <!-- <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{systemName}}</h1>
      </router-link> -->
      <div class="admin-header-wide-item">
        <header-avatar class="header-item"/>
        <a-input class="user-search" v-model="searchKey" placeholder="搜索">
          <SvgIcon slot="prefix" iconClass="icon-sousuo"></SvgIcon>
        </a-input>
      </div>
      <!-- <a-divider v-if="isMobile" type="vertical" /> -->
      <!-- <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/> -->
      <!-- <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect"/>
      </div> -->
      <div class="admin-header-wide-item">
        <div class="module-wrap">
          <div class="module-item">
            <!-- <a-badge count="5"> -->
              <img src="@/assets/img/icon-wait.png" width="26">
            <!-- </a-badge> -->
            <span class="module-text">待办</span>
          </div>
          <div class="module-item">
            <img src="@/assets/img/icon-date.png" width="26">
            <span class="module-text">日历</span>
          </div>
          <div class="module-item">
            <!-- <a-badge count="5"> -->
              <img src="@/assets/img/icon-notice.png" width="26">
            <!-- </a-badge> -->
            <span class="module-text">通知</span>
          </div>
        </div>
        <div class="weather-wrap">
          <div id="he-plugin-simple"></div>
          <!-- <div>
            <div class="wather-info">8℃  晴</div>
            <div>
              <span>1月12日</span>
              <span>16 : 48 : 56</span>
            </div>
          </div>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png" width="40"> -->
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderAvatar from './HeaderAvatar'
// import IMenu from '@/components/menu/menu'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'AdminHeader',
  components: {
    // IMenu,
    HeaderAvatar
  },
  props: ['collapsed', 'menuData'],
  data() {
    return {
      langList: [
        {key: 'CN', name: '简体中文', alias: '简体'},
        {key: 'HK', name: '繁體中文', alias: '繁體'},
        {key: 'US', name: 'English', alias: 'English'}
      ],
      searchActive: false,
      searchKey: ''
    }
  },
  mounted() {
    window.WIDGET = {
      'CONFIG': {
        'modules': '01234',
        'background': '5',
        'tmpColor': 'FFFFFF',
        'tmpSize': '16',
        'cityColor': 'FFFFFF',
        'citySize': '16',
        'aqiColor': 'FFFFFF',
        'aqiSize': '16',
        'weatherIconSize': '24',
        'alertIconSize': '18',
        'padding': '20px 10px 20px 10px',
        'shadow': '0',
        'language': 'auto',
        'borderRadius': '5',
        'fixed': 'false',
        'vertical': 'top',
        'horizontal': 'left',
        'key': '7a359ad9c3e547779a3c8eed7cb26b98'
      }
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
    document.getElementsByTagName('head')[0].appendChild(script)
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    headerTheme () {
      if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    langAlias() {
      let lang = this.langList.find(item => item.key == this.lang)
      return lang.alias
    },
    menuWidth() {
      const {layout, searchActive} = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
