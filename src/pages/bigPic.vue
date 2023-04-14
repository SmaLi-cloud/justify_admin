<template>
  <a-modal wrapClassName="custom-modal" :dialog-style="{ top: '150px' }" :visible="visible" :width="width"
    :maskClosable="maskClosable" :closable="false" :destroyOnClose="destroyOnClose" @cancel="handleCancel">
    <div slot="title" class="custom-modal-title">
      <div class="custom-modal-title-text">{{ title }}</div>
      <div class="custom-modal-close" @click="handleCancel">
        <SvgIcon iconClass="icon-guanbi" />
      </div>
    </div>
    <img :src="src" width="100%" class="img"/>
    <div slot="footer" class="custom-modal-footer"></div>
  </a-modal>
</template>

<script>
import SvgIcon from "@/components/iconFont/SvgIcon.vue";
export default {
  components: { SvgIcon },
  props: {
    title: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 800,
    },
    height: {
      type: Number,
      default: 800,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    };
  },
  mounted() { },
  methods: {
    handleCancel() {
      this.$emit("cancel");
    },
  },
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

  .img {
    border-radius: 10px;
  }

}
</style>
