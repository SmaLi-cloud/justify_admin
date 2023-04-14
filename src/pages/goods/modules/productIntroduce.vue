<template>
  <div class="introduce_content">
    <h2>商品介绍</h2>
    <a-form-model
      ref="ruleForm"
      :model="introInfo"
      :labelCol="{ span: 4 }"
      :rules="rules"
      :wrapperCol="{ span: 14 }"
    >
      <a-form-model-item
        label="是否支持一件代发"
        class="itemWidth"
        prop="supportDropshipping"
      >
        <a-select
          :options="[
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ]"
          v-model="introInfo.supportDropshipping"
        />
      </a-form-model-item>
      <a-form-model-item
        label="是否支持OEM"
        class="itemWidth"
        prop="supportOem"
      >
        <a-input v-model="introInfo.supportOem" />
      </a-form-model-item>
      <a-form-model-item
        help='填写产品已取得的认证名称，如"3C认证"，多个认证中间用"、"隔开'
        label="认证情况"
        class="itemWidth"
        prop="attestation"
      >
        <a-input v-model="introInfo.attestation"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="单包尺寸" prop="size">
        <div style="display: flex; align-items: center">
          <span style="margin-right: 10px">长</span>
          <a-input-number
            :min="0"
            v-model="introInfo.size[0]"
            style="margin-right: 40px"
          ></a-input-number>
          <span style="margin-right: 10px">宽</span>
          <a-input-number
            :min="0"
            v-model="introInfo.size[1]"
            style="margin-right: 40px"
          ></a-input-number>
          <span style="margin-right: 10px">高</span>
          <a-input-number
            :min="0"
            v-model="introInfo.size[2]"
            style="margin-right: 10px"
          ></a-input-number>
          <span>（单位：mm）</span>
        </div>
      </a-form-model-item>
      <a-form-model-item
        label="箱规（台/箱）"
        class="itemWidth"
        prop="boxSpecs"
      >
        <a-input v-model="introInfo.boxSpecs"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="产品净重" class="itemWidth" prop="netWeight">
        <a-input suffix="单位（kg）" v-model="introInfo.netWeight"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="颜色" class="itemWidth" prop="color">
        <a-input v-model="introInfo.color"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="上市时间" class="itemWidth" prop="listingTime">
        <a-date-picker v-model="introInfo.listingTime" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
   
    const sizeVaildator = (rule, value, callback) => {
      if (!value || value.length !== 3) {
        callback(new Error("请填写完整单包尺寸"));
      }
      let hasEmpty = value.some((item) => !item);
      if (hasEmpty) {
        callback(new Error("请填写完整单包尺寸"));
      }
      callback();
    };

    return {
      rules: {
        supportDropshipping: [
          {
            required: true,
            message: "请选择是否指出一键代发",
            trigger: ["blur", "change"],
          },
        ],
        supportOem: [
          {
            required: true,
            message: "请输入是否支持OEM",
            trigger: ["blur", "change"],
          },
        ],
        attestation: [
          {
            required: true,
            message: "请输入认证情况",
            trigger: ["blur", "change"],
          },
        ],
        size: [
          {
            required: true,
            message: "请输入单包尺寸",
            trigger: ["blur", "change"],
          },
          { validator: sizeVaildator, trigger: ["blur", "change"] },
        ],
        boxSpecs: [
          {
            required: true,
            message: "请输入箱规",
            trigger: ["blur", "change"],
          },
        ],
        netWeight: [
          {
            required: true,
            message: "请输入产品净重",
            trigger: ["blur", "change"],
          },
        ],
        color: [
          {
            required: true,
            message: "请输入颜色",
            trigger: ["blur", "change"],
          },
        ],
        listingTime: [
          {
            required: true,
            message: "请选择上市时间",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("goods", ["introInfo"]),
  },
  methods: {
    modify() {
      let result = true;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          result = false;
          this.$message.error("请补充完整商品介绍信息");
        }
      });
      return result;
    },
  },
};
</script>
<style scoped lang="less">
.introduce_content {
  background-color: #fff;
  padding: 20px;
  table {
    // margin: 0 auto;
    thead {
      background: #e8e8e8;
      .thead_tr {
        border-width: 1px;
        border-color: #e8e8e8;
        border-style: solid;
        height: 40px;
        td {
          width: 220px;
          text-align: center;
        }
      }
    }
    tbody {
      text-align: center;
      tr {
        height: 50px;
        border-width: 1px;
        border-color: #e8e8e8;
        border-style: solid;
        td:first-child {
          padding-left: 10px;
          padding-right: 10px;
          border-right-color: #e8e8e8;
          border-right-width: 1px;
          border-right-style: solid;
        }
        td:nth-child(2) {
          padding-left: 10px;
          padding-right: 10px;
          border-right-color: #e8e8e8;
          border-right-width: 1px;
          border-right-style: solid;
        }
      }
      .opcol {
        color: #ff9900;
        vertical-align: middle;
      }
      .opcol:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
