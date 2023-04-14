<template>
  <CustomModal
    :title="type == 'in' ? '新增入库' : '新增出库'"
    :visible="visible"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item label="产品名称" prop="proId">
        <a-select
          show-search
          :disabled="false"
          :value="form.proId"
          placeholder="请输入产品名字片段"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          @search="handleSearch"
          @change="handleChange"
        >
          <a-select-option v-for="d in stockProduct" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="产品规格" prop="proModelId" v-if="form.proId">
        <a-select v-model="form.proModelId">
          <a-select-option v-for="item in proModelList" :key="item.id">{{
            item.specification
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="库位" prop="locationId">
        <a-input v-if="type == 'in'" v-model="form.locationId" />
        <a-select v-else v-model="form.locationId">
          <a-select-option v-for="item in locationList" :key="item">{{
            item
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="数量" prop="quantity">
        <a-input v-model="form.quantity" />
      </a-form-model-item>

      <a-form-model-item
        v-if="manageType == 'sample'"
        :label="type == 'in' ? '入库金额' : '出库金额'"
        prop="amount"
      >
        <a-input v-model="form.amount" />
      </a-form-model-item>

      <a-form-model-item
        v-if="manageType == 'stock' && type == 'in'"
        label="单价"
        prop="unitPrice"
      >
        <a-input v-model="form.unitPrice" />
      </a-form-model-item>

      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="form.remark"
          :autoSize="{ maxRows: 5, minRows: 3 }"
        />
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import CustomModal from "@/components/modal/CustomModal.vue";
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  components: {
    CustomModal,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    manageType: {
      type: String,
      default: "sample",
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入大于0的整数"));
      }
      return callback();
    };
    return {
      proModelList: [],
      locationList: [],
      stockProduct: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      rules: {
        proId: [
          {
            required: true,
            message: "产品名称必选",
            trigger: ["blur"],
          },
        ],
        proModelId: [
          {
            required: true,
            message: "产品规格必选",
            trigger: ["blur"],
          },
        ],
        locationId: [
          {
            required: true,
            message: "库位必填",
            trigger: ["blur"],
          },
        ],
        quantity: [
          {
            required: true,
            message: "数量必填",
            trigger: ["blur"],
          },
          { validator: checkNumber, trigger: ["change"] },
        ],
        amount: [
          {
            required: true,
            message: "金额必填",
            trigger: ["blur"],
          },
        ],
        unitPrice: [
          {
            required: true,
            message: "金额必填",
            trigger: ["blur"],
          },
        ],
      },
      form: {},
      visible: false,
      confirmLoading: false,
    };
  },
  mounted() {},
  methods: {
    ...mapActions("technology", [
      "proModel",
      "outStorageLocationId",
      "techStockOutLocationId",
      "beStockProduct",
      "inStockProduct",
      "techStockInProduct",
      "techStockOutProduct",
    ]),
    handleChange(value) {
      this.form = {
        ...this.form,
        proId: value,
      };
    },
    handleSearch(value) {
      if (!value) {
        this.stockProduct = [];
        return;
      }
      this.getStockProduct(value);
    },
    getStockProduct: _.debounce(function (name) {
      if (this.type === "in") {
        this.getBeStockProduct(name);
      } else {
        this.getInStockProduct(name);
      }
    }, 500),
    getBeStockProduct(name) {
      const requestApi = {
        sample: "beStockProduct",
        stock: "techStockInProduct",
      };
      let apiName = requestApi[this.manageType];
      if (!apiName) {
        return;
      }
      this[apiName]({
        name,
        page: 1,
        size: 20,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.stockProduct = res.data;
      });
    },
    getInStockProduct(name) {
      const requestApi = {
        sample: "inStockProduct",
        stock: "techStockOutProduct",
      };
      let apiName = requestApi[this.manageType];
      if (!apiName) {
        return;
      }
      this[apiName]({
        name,
        page: 1,
        size: 20,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        this.stockProduct = res.data;
      });
    },
    showModal() {
      this.visible = true;
    },
    getLocationList() {
      this.form = {
        ...this.form,
        locationId: "",
      };
      if (!this.form.proId || !this.form.proModelId) {
        this.locationList = [];
        return;
      }
      const requestApi = {
        sample: "outStorageLocationId",
        stock: "techStockOutLocationId",
      };
      let apiName = requestApi[this.manageType];
      if (!apiName) {
        return;
      }
      this[apiName]({
        proId: this.form.proId,
        proModelId: this.form.proModelId,
      }).then((res) => {
        if (!res.success) {
          this.locationList = [];
          return;
        }
        this.locationList = res.data;
      });
    },

    getProModel(proId) {
      this.form = {
        ...this.form,
        proModelId: "",
      };
      if (!this.form.proId) {
        this.proModelList = [];
        return;
      }
      this.proModel({ proId: proId }).then((res) => {
        if (!res.success) {
          this.proModelList = [];
          return;
        }
        this.proModelList = res.data;
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("onOk", this.form);
        }
      });
    },
    handleCancel() {
      this.form = {};
      this.stockProduct = [];
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
  },
  watch: {
    defaultValue(value) {
      this.form = value;
    },
    "form.proId": {
      handler(value) {
        this.getProModel(value);
      },
    },
    "form.proModelId": {
      handler(value) {
        this.getLocationList();
      },
    },
  },
};
</script>
<style scoped></style>
