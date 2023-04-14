<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="'#'+iconClass"></use>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      required: true,
      type:String,
    },
  },
};
</script>

<style lang="less" scoped>
</style>