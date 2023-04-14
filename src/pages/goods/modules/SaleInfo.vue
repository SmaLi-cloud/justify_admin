<template>
  <div class="sale_content">
    <h2>价格信息</h2>
    <a-form-model
      ref="ruleForm"
      :model="saleInfo"
      :labelCol="{ span: 4 }"
      :rules="rules"
      :wrapperCol="{ span: 14 }"
    >
      <a-form-model-item label="价格类型" prop="costPriceType">
        <a-radio-group
          v-model="saleInfo.costPriceType"
          @change="priceTypeChange"
        >
          <a-radio value="unify">
            统一价格
          </a-radio>
          <a-radio value="tiered">
            阶梯价格
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        v-if="saleInfo.costPriceType === 'unify'"
        label="成本价"
        class="itemWidth"
        prop="costPrice"
      >
        <a-input v-model="saleInfo.costPrice" />
      </a-form-model-item>
      <a-form-model-item
        v-if="saleInfo.costPriceType === 'tiered'"
        label="成本价"
        class="itemWidth"
        prop="costPrice"
      >
        <div>
          <table>
            <thead>
              <tr class="thead_tr">
                <td style="width:400px">数量</td>
                <td>价格</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in saleInfo.costPrice" :key="index">
                <td>
                  <a-input-number :min="1" v-model="item.minQuantity" />
                  <span>(包含) —— </span>
                  <a-input-number :min="1" v-model="item.maxQuantity" />
                </td>
                <td>
                  <a-input v-model="item.price" />
                </td>
                <td>
                  <div class="opcol" @click="deleteItme(index)">删除</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button">
            <a-button class="button" type="dashed" @click="addPrice">
              <a-icon type="plus" />
              新增参数
            </a-button>
          </div>
        </div>
      </a-form-model-item>

      <a-form-model-item label="零售价" class="itemWidth" prop="retailPrice">
        <a-input v-model="saleInfo.retailPrice"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="样品价" class="itemWidth" prop="samplePrice">
        <a-input v-model="saleInfo.samplePrice"> </a-input>
      </a-form-model-item>
      <a-form-model-item
        label="成本价"
        class="itemWidth"
        prop="settlementPrice"
      >
        <a-input v-model="saleInfo.settlementPrice"> </a-input>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  data() {
    const isPriceVlidator = (rule, value, callback) => {
      var pattern = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      if (!pattern.test(value)) {
        return callback(new Error("只能输入数字且最大保留两位小数"));
      } else return callback();
    };
    return {
      rules: {
        costPriceType: [
          {
            required: true,
            message: "请选择价格类型",
            trigger: ["blur", "change"],
          },
        ],
        costPrice: [
          {
            required: true,
            message: "请输入成本价",
            trigger: ["blur", "change"],
          },
          { validator: this.priceChange, trigger: "change" },
        ],
        retailPrice: [
          {
            required: true,
            message: "请输入零售价",
            trigger: ["blur", "change"],
          },
          { validator: isPriceVlidator, trigger: ["blur"] },
        ],
        samplePrice: [
          {
            required: true,
            message: "请输入样品价",
            trigger: ["blur", "change"],
          },
          { validator: isPriceVlidator, trigger: ["blur"] },
        ],
        settlementPrice: [
          {
            required: true,
            message: "请输入成本价",
            trigger: ["blur", "change"],
          },
          { validator: isPriceVlidator, trigger: ["blur"] },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("goods", ["resetSalePrice", "setSaleInfo"]),
    ...mapActions("file", ["batchUpload"]),
    priceChange(rules, data, callback) {
      if (this.saleInfo.costPriceType !== "tiered") {
        var pattern = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (!pattern.test(data)) {
          return callback(new Error("只能输入数字且最大保留两位小数"));
        } else {
          callback();
        }
      }
      let has = data.some(
        (item) =>
          item.minQuantity === null ||
          item.minQuantity === undefined ||
          item.maxQuantity === null ||
          item.maxQuantity === undefined ||
          item.price === "" ||
          item.price === undefined
      );
      if (has) {
        callback(new Error("请输入规格参数"));
        return;
      }
      callback();
    },
    addPrice() {
      let list = this.saleInfo.costPrice.concat([
        { maxQuantity: "", minQuantity: "", price: "" },
      ]);
      this.setSaleInfo({
        ...this.saleInfo,
        costPrice: list,
      });
    },
    deleteItme(index) {
      const list = [...this.saleInfo.costPrice];
      list.splice(index, 1);
      this.setSaleInfo({
        ...this.saleInfo,
        costPrice: list,
      });
    },
    priceTypeChange(e) {
      this.resetSalePrice(e.target.value);
    },
    modify() {
      let result = true;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          result = false;
          this.$message.error("请补充完整销售信息");
        }
      });
      return result;
    },
  },
  computed: {
    ...mapState("goods", ["saleInfo"]),
  },
};
</script>

<style scoped lang="less">
.sale_content {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
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
  .button {
    margin-left: 20px;
    margin-top: 10px;
    width: 600px;
  }
}
</style>
