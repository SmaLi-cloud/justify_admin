<template>
  <div>
    <div class="box">
      <h2>基本信息</h2>
      <div class="flex" style="margin-left:40px">
        <div
          :key="key"
          style="width:50%;line-height:30px"
          v-for="(value, key) in baseInfo"
        >
          <span>{{ key }} ：</span>
          <span>{{ value }}</span>
        </div>
        <div class="flex" style="width:100%;margin-top:10px">
          <span>
            封面 ：
          </span>
          <upload-img
            :showDelete="false"
            :showTip="false"
            :fileList="cover"
            :limitNum="cover.length"
          />
        </div>
      </div>
    </div>
    <div class="box" style="margin-top:20px">
      <h2>正文</h2>
      <div class="content">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImg from "@/components/upload/UploadImg";
import { mapActions } from "vuex";
export default {
  components: { UploadImg },
  data() {
    return {
      id: this.$route?.params?.id,
      baseInfo: {
        标题: "",
        摘要: "",
        推荐置顶: "",
        状态: "",
      },
      content: "",
      cover: [],
    };
  },
  mounted() {
    this.getDetailData();
  },
  methods: {
    ...mapActions("news", ["newsListDetail"]),
    getDetailData() {
      this.newsListDetail({
        newsId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const data = res.data;
        this.cover = [
          {
            url: data.cover.attachPath,
            fileId: data.cover.fileId,
            thumbnailPath: data.cover.thumbnailPath,
          },
        ];
        this.content = data.content;
        let baseInfo = {
          标题: data.title,
          摘要: data.summary,
          状态: !data.isOffline ? "已上线" : "未上线",
          推荐置顶: data.isTop ? "是" : "否",
        };
        if (data.isTop) {
          baseInfo = {
            ...baseInfo,
            推荐指数: data.topSn,
          };
        }
        this.baseInfo = baseInfo;
      });
    },
  },
};
</script>
<style scoped>
.box {
  padding: 20px;
  background-color: #fff;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
.content {
  padding: 20px;
  margin-left: 40px;
  border-width: 1px;
  border-color: rgb(232, 232, 232);
  border-style: solid;
  border-radius: 8px;
}
</style>
