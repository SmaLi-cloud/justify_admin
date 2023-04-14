<template>
  <a-modal
    wrapClassName="custom-modal"
    :dialog-style="{ top: '150px' }"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :width="width"
    :keyboard="keyboard"
    :maskClosable="maskClosable"
    :closable="false"
    :maskStyle="maskStyle"
    :destroyOnClose="destroyOnClose"
  >
    <div slot="title" class="custom-modal-title">
      <div class="custom-modal-title-text">{{ title }}</div>
      <div class="custom-modal-close" @click="handleCancel">
        <SvgIcon iconClass="icon-guanbi" />
      </div>
    </div>
    <slot></slot>
    <div slot="footer" class="custom-modal-footer">
      <a-space :size="20" v-if="isButton">
        <a-button type="primary" @click="handleOk" :loading="confirmLoading">{{ okText }}</a-button>
        <a-button @click="handleCancel">{{ cancelText }}</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import SvgIcon from '../iconFont/SvgIcon.vue';
export default {
  name: 'CustomModal',
  props: {
    title: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    okText: {
      type: String,
      default: '确定',
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 500,
    },
    keyboard: {
      type: Boolean,
      default: false,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    isButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      maskStyle: {
        background: 'rgba(0, 0, 0, 0.2)'
      }
    };
  },
  methods: {
    handleOk() {
      this.$emit('ok');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
  components: { SvgIcon },
};
</script>

<style lang="less">
.custom-modal {
  .ant-modal-content {
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
    border-radius: 0;
  }
  .ant-modal-header {
    padding: 20px;
    border: none;
  }
  .ant-modal-body {
    padding: 0 20px;
  }
  .ant-modal-footer {
    padding: 20px;
    border: none;
  }
  .custom-modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .custom-modal-title-text {
      font-size: 16px;
      color: #333;
    }
    .custom-modal-close {
      width: 24px;
      height: 24px;
      line-height: 22px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: #e8e9e9;
      }
    }
    .icon {
      font-size: 14px;
    }
  }
  .custom-modal-footer {
    text-align: center;
  }
}
</style>