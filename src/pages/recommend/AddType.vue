<template>
  <CustomModal
    title="添加/修改商品推荐"
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
      <a-form-model-item label="推荐类型" prop="recType">
        <a-select v-model="form.recType" allowClear :options="recommendType">
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.recType === 'pro_type'"
        label="一级类型"
        prop="proTypeId"
      >
        <a-select v-model="form.proTypeId" allowClear>
          <a-select-option v-for="item in primaryTypeList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.recType" label="选择商品" prop="productId">
        <a-select
          show-search
          :disabled="false"
          :value="form.productId"
          placeholder="输入商品名字片段"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          @search="handleSearch"
          @change="handleChange"
        >
          <a-select-option v-for="d in proData" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.recType === 'pro_type'"
        label="展示名称"
        prop="showName"
      >
        <a-input v-model="form.showName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="排序顺序" prop="order">
        <a-select v-model="form.order" allowClear>
          <a-select-option v-for="d in snList" :key="d">
            {{ d }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.recType && form.recType !== 'new_pro'"
        label="展示图片"
        class="itemWidth"
        prop="attach"
      >
        <upload-img
          :fileList="form.attach || []"
          @ok="attachChange"
          :multiple="false"
          :dragging="false"
          :showTip="false"
          :limitNum="1"
          :maxFileSize="5"
        />
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
import { recommendType } from "./type";
import _ from "lodash";
export default {
  components: {
    CustomModal,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      recommendType,
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      rules: {
        recType: [
          {
            required: true,
            message: "请选择推荐类型",
            trigger: ["blur", "change"],
          },
        ],
        proTypeId: [
          {
            required: true,
            message: "请选择一级类型",
            trigger: ["blur", "change"],
          },
        ],
        productId: [
          {
            required: true,
            message: "选择商品必选",
            trigger: ["blur", "change"],
          },
        ],
        order: [
          {
            required: true,
            message: "请选择推荐位置",
            trigger: ["blur", "change"],
          },
        ],
        attach: [
          {
            required: true,
            message: "请上传展示图片",
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {
        name: "",
        level: "",
        parentId: "",
        attach: [],
        productId: "",
      },
      proData: [],
      primaryTypeList: [],
      parentIdList: [],
      visible: false,
      confirmLoading: false,
    };
  },
  created() {
    this.getPrimaryType();
  },
  methods: {
    ...mapActions("recommend", [
      "recommendGetProduct",
      "recommendGetPrimaryType",
    ]),
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("onOk", this.form);
        }
      });
    },
    handleSearch(value) {
      if (!value) {
        return;
      }
      this.getProduct(value);
    },
    getProduct: _.debounce(function (name) {
      this.recommendGetProduct({
        conditions: {
          proName: name,
          proTypeId: this.form.proTypeId || "",
        },
        page: 1,
        size: 15,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        let hasRepeat = res.data.some((item) => {
          return item.id === this.form.productId;
        });
        if (!hasRepeat || !res.data.length) {
          this.form.productId = "";
        }
        this.proData = res.data || [];
      });
    }, 500),
    handleChange(value) {
      this.form.productId = value;
    },
    handleCancel() {
      this.form = {
        level: "",
        parentId: "",
        attach: [],
      };
      this.proData = [];
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
    attachChange(value) {
      this.form = {
        ...this.form,
        attach: value,
      };
    },
    deleteAttachsImg(data) {
      const { deleteData, list } = data;
      this.setBaseInfo({
        ...this.baseInfo,
        attachs: list,
      });
    },
    getPrimaryType() {
      this.recommendGetPrimaryType({}).then((res) => {
        if (!res.success) {
          return;
        }
        this.primaryTypeList = res.data;
      });
    },
  },
  computed: {
    snList() {
      if (this.form.recType === "pro_type") {
        return [1, 2, 3, 4, 5, 6];
      } else if (this.form.recType === "new_pro") {
        return [1, 2, 3, 4];
      } else if (this.form.recType === "main_pro") {
        return [1, 2, 3, 4, 5];
      } else {
        return [];
      }
    },
  },
  watch: {
    snList: {
      handler(newValue, oldValue) {
        if (newValue.length) {
          if (this.form.order > newValue.length) {
            this.form.order = newValue.length;
          }
        }
      },
    },
    "form.recType": {
      handler(newVal) {
        let form = {
          attach: [],
        };
        if (newVal === "main_pro") {
          form = {
            recType: newVal,
            productId: this.form.productId || "",
            attach: this.form.attach || [],
            order: this.form.order || "",
          };
        } else if (newVal === "new_pro") {
          form = {
            recType: newVal,
            productId: this.form.productId || "",
            order: this.form.order || "",
          };
        } else if (newVal === "pro_type") {
          form = {
            recType: newVal,
            proTypeId: this.form.proTypeId || "",
            productId: this.form.productId || "",
            showName: this.form.showName || "",
            order: this.form.order || "",
            attach: this.form.attach || [],
          };
        }
        if (this.form.id) {
          form.id = this.form.id;
        }
        this.form = form;
      },
    },
    "form.proTypeId": {
      handler(newValue) {
        if (newValue) {
          this.getProduct("");
        }
      },
    },
    defaultValue(value) {
      value = { ...value };
      // this.getProduct(value.productName || "");
      this.form = value;
      this.proData = [{ id: value.productId, name: value.productName }];
    },
  },
};
</script>
<style scoped></style>
