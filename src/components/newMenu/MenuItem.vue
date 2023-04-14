<template>
  <div class="menu-wrap">
    <div class="menu-item-wrap" v-for="(item, index) in menuData" :key="`menu-${index}`">
      <div class="menu-item" :class="{'active': item.active}" @click="handleRouter(item)">
        <SvgIcon class="menu-icon" v-if="item.meta && item.meta.icon" :iconClass="item.meta.icon" />
        <div class="menu-text">{{item.name}}</div>
        <SubItem class="menu-sub-item" v-if="item.children && item.children.length > 0 && item.meta.type != 'link'" :list="item.children" :index="index" :collapsed="collapsed" />
      </div>
    </div>
  </div>
</template>

<script>
import SubItem from './SubItem';
export default {
  components: {
    SubItem
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  watch: {
    $route() {
      this.menuData.forEach(item => {
        let active = false;
        if (this.$route.fullPath.startsWith(item.fullPath)) {
          active = true;
        }
        item.active = active;
      })
    }
  },
  data() {
    return {
      menuData: [],
      openSelect: false
    }
  },
  created() {
    this.menuData = JSON.parse(JSON.stringify(this.options)).map(item => {
      let active = false;
      if (this.$route.fullPath.startsWith(item.fullPath)) {
        active = true;
      }
      return {
        ...item,
        active: active
      }
    }).filter(item => {
      if (item.meta.type == 'link') {
        return true;
      }
      if (item.meta.invisible) {
        return false;
      }
      if (item.children?.length > 0) {
        return this.isShow(item.children);
      } else if (item.children) {
        return false;
      } else {
        return true;
      }
    })
  },
  methods: {
    isShow(list) {
      return list.some(item => {
        if (item.children?.length > 0) {
          return this.isShow(item.children);
        } else {
          return (item.meta && item.meta.invisible !==  undefined) ? !item.meta.invisible : true;
        }
      })
    },
    handleRouter(item) {
      if (item.meta.type == 'link') {
        this.$router.push(item.fullPath);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.menu-wrap {
  position: relative;
  padding-top: 13px;
  .menu-item {
    // width: 64px;
    height: 64px;
    padding-top: 12px;
    margin: 0 0 10px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    .menu-icon {
      font-size: 20px;
      color: #fff;
    }
    .menu-text {
      color: #fff;
      font-size: 14px;
      line-height: 19px;
    }
    .menu-sub-item {
      display: none;
    }
  }
  .menu-item-wrap {
    &:hover {
      .menu-item {
        background-color: #2B3E51;
      }
      .menu-sub-item {
        display: block;
      }
    }
  }
  .menu-item.active {
    background-color: #2B3E51;
  }
}
</style>