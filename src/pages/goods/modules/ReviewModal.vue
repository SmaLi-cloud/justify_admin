<template>
  <CustomModal :title="'产品' + typeName" :visible="visible" :destroyOnClose="true" :confirm-loading="confirmLoading"
    :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
      <a-form-model-item :label="typeName + '结果'" prop="result">
        <a-select v-model="form.result">
          <a-select-option :value="1">
            {{ typeName + "通过" }}
          </a-select-option>
          <a-select-option :value="0">
            {{ typeName + "不通过" }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="typeName + '详情'" prop="detail">
        <a-textarea v-model="form.detail" :autoSize="{ maxRows: 5, minRows: 3 }" />
      </a-form-model-item>
      <div v-if="status === 1">
        <a-form-model-item v-for="(item) in checkLabel" :label="item.name" :key="item.id" :prop="item.id">
          <a-checkbox-group v-model="form[item.id]">
            <a-checkbox v-for="(selectItem, selectIndex) in item.selectItems.check" :value="selectItem.id"
              :key="selectIndex">
              {{ selectItem.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item v-for="(item) in radioLabel" :label="item.name" :key="item.id" :prop="item.id">
          <a-radio-group v-model="form[item.id]">
            <a-radio v-for="(selectItem, selectIndex) in item.selectItems.radio" :value="selectItem.id"
              :key="selectIndex">
              {{ selectItem.name }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-for="(item) in mixLabel" :label="item.name" :key="item.id" :prop="item.id">
          <a-radio-group v-model="form[item.id]" @change="e => onChange(e, item.id)">
            <a-radio v-for="(selectItem2) in item.selectItems.radio" :value="selectItem2.id" :key="selectItem2.id">
              {{ selectItem2.name }}
            </a-radio>
          </a-radio-group>
          <a-checkbox-group v-model="form['mixcheck']" @change="e => onChange1(e, item.id)">
            <a-checkbox v-for="(selectItem1) in item.selectItems.check" :value="selectItem1.id" :key="selectItem1.id">
              {{ selectItem1.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </div>

      <a-form-model-item v-if="status === 2" label="视频地址" prop="assessUrl">
        <a-input v-model="form.assessUrl" />
      </a-form-model-item>
    </a-form-model>
  </CustomModal>
</template>

<script>
const type = {
  1: "审核",
  2: "测评",
};
import { mapActions } from "vuex";
import CustomModal from "@/components/modal/CustomModal.vue";
export default {
  components: {
    CustomModal,
  },
  props: {
    status: {
      type: Number,
      default: -1,
    },
    defaultValue: {
      type: Object,
      default: () => { },
    },
  },

  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form: {
        result: "",
        detail: "",
        assessUrl: "",
      },
      parentIdList: [],
      visible: false,
      confirmLoading: false,
      mixLabel: [],
      checkLabel: [],
      radioLabel: [],
    };
  },
  mounted() { },
  computed: {
    typeName() {
      const type = {
        1: "审核",
        2: "测评",
      };
      return type[this.status] || "";
    },
    rules() {
      let obj = {}
      if (this.radioLabel) {
        this.radioLabel.forEach(item => {
          obj[item.id] = [
            {
              required: true,
              message: "打分项必填",
              trigger: ["blur", "change"],
            },
          ]
        });
      }
      let mix = {}
      if (this.mixLabel) {
        this.mixLabel.forEach(item => {
          mix[item.id] = [
            {
              required: true,
              message: "打分项必填",
              trigger: ["blur", "change"],
            },
          ]
        });
      }
      return {
        result: [
          {
            required: true,
            message: type[this.status] + "结果必填",
            trigger: ["blur", "change"],
          },
        ],
        detail: [
          {
            required: true,
            message: type[this.status] + "详情必填",
            trigger: ["blur", "change"],
          },
        ],
        ...obj,
        ...mix
      };
    },
  },
  methods: {
    ...mapActions("product", ["getTypeByLevel"]),
    showModal(value) {
      if (value) {
        this.form = { ...value };
        let mixArray = [];
        let checkArray = [];
        let radioArray = [];
        if (value.gradeName) {
          value.gradeName.forEach(item => {
            if (item.type == 'mix') {
              mixArray.push(item);
            } else if (item.type == 'check') {
              checkArray.push(item);
            } else if (item.type == 'radio') {
              radioArray.push(item);
            }
          })
        }
        this.mixLabel = mixArray;
        this.checkLabel = checkArray;
        this.radioLabel = radioArray;
      }
      this.visible = true;
    },
    onChange(e, id) {
      this.$forceUpdate();
    },
    onChange1(checkedValue, id) {
      this.$forceUpdate();
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("onOk", this.form);
        }
      });
    },
    handleCancel() {
      this.form = {
        result: "",
        detail: "",
        assessUrl: "",
      };
      this.$refs.ruleForm.clearValidate();
      this.confirmLoading = false;
      this.visible = false;
    },
  },
  watch: {
    defaultValue(value) {
      this.form = value;
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .ant-checkbox-wrapper+.ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
