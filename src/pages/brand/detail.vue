<template>
  <div>
    <div class="toolbar" v-if="status === 1">
      <a-button
        type="primary"
        :loading="downLoading"
        @click="onExamine"
        style="margin-right: 20px"
        >审核</a-button
      >
    </div>

    <div class="base_info">
      <h2>品牌信息</h2>
      <div class="content">
        <div
          v-for="(value, key) in baseInfo"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 140px">{{ key }} ：</div>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="image" v-if="attachs.length">
      <div class="content">
        <span> 商标注册证书 ： </span>
        <upload-img
          :showDelete="false"
          :showTip="false"
          :fileList="attachs"
          :limitNum="attachs.length"
        />
      </div>
    </div>
    <div v-if="status !== 1" class="box" style="marginTop: 20px">
      <h2>审核信息</h2>
      <div class="content flex">
        <div
          v-for="(value, key) in examineResult"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 140px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
    </div>
    <review-modal ref="modalRef" :status="status" @onOk="onExamineOk" />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import ReviewModal from "./modules/ReviewModal.vue";
import UploadImg from "@/components/upload/UploadImg";
export default {
  components: { UploadImg, ReviewModal },
  data() {
    return {
      status: -1,
      id: this.$route.params?.id,
      attachs: [],
      baseInfo: {},
      examineResult: {},
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapActions("brand", ["brandExamine", "getBrandDetail"]),
    onExamine() {
      this.$refs.modalRef.showModal();
    },
    onExamineOk(value) {
      this.brandExamine({
        brandId: this.id,
        ...value,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.$refs.modalRef.handleCancel()
        this.onRefresh();
      });
    },
    getDetail() {
      this.getBrandDetail({
        brandId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { attachs, status } = res.data;
        attachs.url = attachs.imagePath;
        this.attachs = [res.data.attachs];
        this.status = status;
        let typeName = {
          own: "自创品牌",
          license: "授权品牌",
        };
        let statusName = ["", "待审核", "通过", "不通过"];
        let baseInfo = {
          品牌名称: res.data.name,
          状态: statusName[res.data.status],
          类型: typeName[res.data.type],
        };
        if(res.data.acountName){
          baseInfo["公司名称"] = res.data.acountName;
        }
        if (res.data.trademarkNumber) {
          baseInfo["注册商标号"] = res.data.trademarkNumber||'/';
        }
        if (res.data.validStartTime&&res.data.validEndTime) {
          baseInfo["商标有效时间"] = res.data.validStartTime+' -- '+res.data.validEndTime;
        }
        this.baseInfo = baseInfo;
        if (status === 2 || status === 3) {
          let examineResult = {
            审核结果: statusName[res.data.status],
            审核详情: res.data.failCause,
            审核时间: res.data.examineTime,
            审核人员: res.data.staffName,
          };
          if(status ===2){
            delete examineResult['审核详情']
          }
          this.examineResult = examineResult
        }
      });
    },
    onRefresh() {
      this.getDetail();
    },
  },
};
</script>

<style scoped lang="less">
.toolbar {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
}
.box {
  background-color: #fff;
  padding: 20px;
  .content {
    margin-left: 20px;
    padding-right: 40px;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
}
.base_info {
  background: #fff;
  padding: 20px;
  padding-bottom: 0;
  .content {
    padding-left: 20px;
    padding-right: 40px;
    display: flex;
    flex-wrap: wrap;
    .detail {
      flex: 1;
      margin-bottom: 20px;
      padding: 20px;
      border-width: 1px;
      border-color: rgb(232, 232, 232);
      border-style: solid;
      border-radius: 8px;
    }
  }
}
.image {
  background: #fff;
  padding: 20px;
  padding-top: 10px;
  .content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 37px;
    padding-right: 40px;
  }
  .content:first-of-type {
    margin-bottom: 0px;
  }
}
</style>
