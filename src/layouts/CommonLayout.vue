<template>
  <div class="common-layout">
    <div class="content"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: 'CommonLayout'
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  // flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: url(../assets/img/login_bg.png) no-repeat center;
  // background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  // background-repeat: no-repeat;
  // background-position-x: center;
  // background-position-y: 110px;
  .content{
    @media (max-width:1200px){
      width:70%;
    }
  }
}
</style>
