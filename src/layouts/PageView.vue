<template>
  <page-layout :desc="desc" :linkList="linkList">
    <div v-if="this.extraImage && !isMobile" slot="extra" class="extraImg">
      <img :src="extraImage" />
    </div>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <router-view ref="page" />
    </page-toggle-transition>
  </page-layout>
</template>

<script>
import PageLayout from './PageLayout';
import PageToggleTransition from '../components/transition/PageToggleTransition';
import { mapState } from 'vuex';

export default {
  name: 'PageView',
  components: { PageToggleTransition, PageLayout },
  data() {
    return {
      page: {},
    };
  },
  computed: {
    ...mapState('setting', ['isMobile', 'multiPage', 'animate']),
    desc() {
      return this.page && this.page.desc;
    },
    linkList() {
      return this.page && this.page.linkList;
    },
    extraImage() {
      return this.page && this.page.extraImage;
    },
  },
  mounted() {
    this.page = this.$refs.page;
  },
  updated() {
    this.page = this.$refs.page;
  },
};
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
</style>
<style lang="less">
.page-content{
  background:transparent !important;
  padding:0 !important;//添加此项不确定是否对其他布局有影响
}
.operator {
  margin-bottom: 18px;
  button {
    margin-right: 5px;
  }
}
</style>
