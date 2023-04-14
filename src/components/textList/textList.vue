<template>
  <div class="box">
    <div v-for="(item, key, index) in list" :key="index" class="item">
      <div>{{ key }}:</div>
      <div class="right">
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "textList",
  data() {
    return {};
  },
  props: {
    list: Object,
  },
};
</script>
<style scoped lang="less">
.box {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;

  .item {
    flex: 0 0 25%;
    width: 25%;
    display: flex;
    align-items: cneter;
    align-content: center;
    justify-content: flex-start;
    padding-right: 10px;
    box-sizing: border-box;

    div {
      min-width: 20%;
    }

    .right {
      flex-grow: 1;
      word-break: break-all;
    }
  }
}
</style>
