<template>
  <a-descriptions
    :title="title"
    :bordered="bordered"
    :column="column"
    :size="size"
    :class="isStyle ? 'des' : className"
  >
    <a-descriptions-item
      v-for="(item, index) in info"
      :key="index"
      :label="item.label"
      :span="item.span"
    >
      <template v-if="item.type === 'array'">
        <div v-for="(row, i) in item.value" :key="i">
          {{ row }}
          <br />
        </div>
      </template>
      <div v-if="item.type !== 'array'">
        {{ item.value }}
      </div>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
export default {
  name: "descriptions",
  props: {
    title: {
      type: String,
      default: "info",
    },
    size: {
      type: String,
      default: "default",
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    column: {
      type: Number,
      default: 2,
    },
    info: {
      type: Array,
      default: () => [],
    },
    isStyle: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less">
.des {
    margin-bottom: 20px;
  .ant-descriptions-title {
    font-weight: normal !important;
  }
  .ant-descriptions-view {
    .ant-descriptions-row {
      .ant-descriptions-item-label {
        background-color: #fbfbfa;
      }
      .ant-descriptions-item-content {
        background-color: #fff;
      }
    }
  }
}
</style>