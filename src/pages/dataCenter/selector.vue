<template>
  <div class="selector">
    <h2>选品官排行</h2>
    <div class="selector_item" v-for="item in selectorList" :key="item.id">
      <div class="selector_avatar">
        <!-- <div class="serial">{{ index + 1 }}</div> -->
        <img :src="item.avatar" alt="" />
      </div>
      <div class="content">
        <div class="name">{{ item.trueName }}</div>
        <div class="flex">
          供 应 商 数 量：<span>{{ item.supQuantity }}</span>
        </div>
        <div class="flex">
          上架样品数量：
          <div style="flex: 1">{{ item.sampleQuantity }}</div>
        </div>
        <div class="flex">
          上架样品金额：
          <div style="flex: 1">{{ item.sampleAmount }}</div>
        </div>
        <div class="flex">
          产品所属类型：
          <div style="flex: 1">{{ item.proTypeName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      selectorList: [{}],
    };
  },
  mounted() {
    this.getSelectorRank();
  },
  methods: {
    ...mapActions("statistic", ["selectorData"]),
    getSelectorRank() {
      this.selectorData({}).then((res) => {
        if (!res.success) {
          return;
        }
        this.selectorList = res.data.filter((item, index) => {
          if (index > 2) {
            return false;
          }
          return {
            ...item,
            avatar:
              item.avatar ||
              "https://file.yth.jiepei.com/integration/avatar/default.png",
          };
        });
      });
    },
  },
};
</script>
<style scoped>
.selector {
  background: #fff;
  padding: 20px 40px 0 40px;
  border-radius: 5px;
  min-width: 420px;
  max-width: 450px;
}
.selector_avatar {
  position: relative;
  width: 100px;
}
.serial {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background-color: #ff8800;
  border-radius: 100px;
  height: 25px;
  width: 25px;
  text-align: center;
  line-height: 25px;
  font-size: 18px;
  color: #fff;
}
.selector_item {
  display: flex;
  padding: 20px 0px;
  border-bottom: 1px solid rgb(232, 232, 232);
}
.selector_item:last-child {
  border-bottom: none;
}
.selector_item:first-of-type {
  padding-top: 10px;
}
.content {
  line-height: 28px;
  margin-left: 30px;
}
.name {
  font-size: 18px;
}
img {
  max-height: 150px;
  width: 100px;
  border-radius: 9px;
  border: 1px dashed rgb(232, 232, 232);
}
.flex {
  display: flex;
}
</style>
