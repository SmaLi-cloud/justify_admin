<template>
  <div class="sub-item-wrap" :style="{left:collapsed ? '80px' : '220px'}" v-if="visible">
    <!-- :style="{top: top + 'px',left:collapsed ? '80px' : '220px'}" -->
    <div class="sub-item-content" >
      <div class="item-box">
        <div class="item-list" v-for="(item, index) in subMenuData" :key="index">
          <div class="sub-item" :class="{'parent-node':subItem.hasChild,'child-node':!subItem.hasChild,'active':$route.path == subItem.fullPath}" v-for="(subItem, i) in item" :key="i" @click.stop="handleRouter(subItem)">
            <span>{{subItem.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    list: Array,
    index: Number
  },
  data() {
    return {
      visible: false,
      subMenuData: [],
      top: 77,
    }
  },
  mounted() {
    this.showSubItem(this.list, this.index);
  },
  methods: {
    showSubItem(data, index) {
      let top = 64 + 13 + index * 74; // 头部高度+搜索高度+当前点击下标*菜单高度
      const arr = this.getMenuData(JSON.parse(JSON.stringify(data)));
      const num = arr.length;
      const contentHeight = 40 * num; // 子菜单内容高度
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight; // 可视区高度
      if (top + contentHeight + 16 + 5 <= clientHeight) {
        this.top = top;
      } else {
        if (contentHeight + 16 + 64 <= clientHeight) {
          this.top = clientHeight - contentHeight - 16 - 5;
        } else {
          this.top = 69;
        }
      }
      this.visible = true;
      // 处理多列子菜单
      let subMenuData = [];
      let i = 0;
      subMenuData[i] = [];
      arr.forEach((item, index) => {
        subMenuData[i].push(item);
        if ((index + 1) % 6 == 0) {
          i++;
          if (arr[index+1]) {
            subMenuData[i] = [];
          }
        }
      })
      this.subMenuData = subMenuData;
    },
    getMenuData(data) {
      const arr = [];
      data.forEach((item,i) => {
        if (!item.meta?.invisible) {
          arr.push({
            ...item,
            hasChild: item.children?.length > 0,
          })
          if (item.children && item.children.length > 0) {
            arr.push(...this.getMenuData(item.children))
          }
        }
      })
      return arr;
    },
    handleRouter(v) {
      if (v.hasChild) return;
      if (this.$route.fullPath == v.fullPath) {
        return false;
      }
      this.$router.push(v.fullPath);
    }
  }
}
</script>

<style lang="less" scoped>
.sub-item-wrap {
  position: relative;
  top: -52px;
  .sub-item-content {
    width: 200px;
    // height: calc(100vh - 84px);
    padding: 8px 10px;
    box-sizing: border-box;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    overflow: auto;
    background-color: #fff;
    // background-color: #f90;
    border-radius: 10px;
    position: fixed;  
  }
  .sub-item-close {
    position: absolute;
    top: 12px;
    right: 14px;
  }
  .sub-item {
    height: 40px;
    padding: 0 38px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .parent-node {
    font-size: 14px;
    color: @primary-color;
    justify-content: flex-start;
    color:#999999;
    padding-left:20px;
    &::before{
      content:'';
      display: block;
      width:5px;
      height:5px;
      background:#999999;
      border-radius: 50%;
      margin-right:6px;
    }
  }
  .child-node {
    color: #333;
    cursor: pointer;
    padding-left: 44px;
    &:hover {
      color: #f90 !important;
      background-color: #F5F5F5;
      border-radius: 4px;
    }
  }
  .sub-item.active {
    color: #f90 !important;
    // background-color: #f90;
    border-radius: 4px;
  }
}
</style>