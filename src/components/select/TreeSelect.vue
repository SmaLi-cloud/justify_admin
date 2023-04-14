<template>
  <a-tree-select
    :showCheckedStrategy="showCheckedStrategy"
    v-model="sValue"
    :tree-data="treeData"
    v-bind="props"
    @change="onChange"
  />
</template>
<script>
export default {
  name: "CustomTab", //组件名
  data() {
    return {
      treeData: [],
      sValue: this.value,
      rawData: this.data,
    };
  },
  props: {
    value: {
      type: [Array, String, Object],
    },
    showCheckedStrategy:{
      type:String,
      require:false,
      default:()=>"SHOW_CHILD"
    },
    props: Object,
    keyFieldName: String,
    parentFieldName: String,
    rootParentValue: String,
    data: Array,
    config: {
      type: Object,
      default() {
        return {
          label: "name",
          val: "id",
          parentDisabled: false,
          parentUniqueProp: "",
        };
      },
    },
  },
  mounted() {
    this.init();
  },
  computed: {},
  watch: {
    value(val) {
      this.sValue = val;
    },
    rawData(newVal, oldVal) {
      if (oldVal != newVal) {
        this.init();
      }
    },
  },
  methods: {
    onChange(v) {
      this.$emit("input", v);
      this.$emit("change", v);
    },
    init() {
      this.treeData = this.buildTree(
        this.rawData,
        this.keyFieldName,
        this.parentFieldName,
        this.rootParentValue
      );
    },
    buildTree(data, keyFieldName, parentFieldName, parentKeyFieldValue) {
      let tree = [];
      for (let i = 0; i < data.length; i++) {
        data[i]["title"] = data[i][this.config.label];
        data[i]["value"] = data[i][this.config.val];
        if (data[i][parentFieldName] === parentKeyFieldValue) {
          let childrens = this.buildTree(
            data,
            keyFieldName,
            parentFieldName,
            data[i][keyFieldName]
          );
          if (childrens.length) {
            data[i]["children"] = childrens;
          }
          if (data[i][this.config.parentUniqueProp] === true) {
            data[i]["disabled"] = this.config.parentDisabled;
          }
          tree.push(data[i]);
        }
      }
      return tree;
    },
  },
};
</script>

<style lang="less" scoped></style>
