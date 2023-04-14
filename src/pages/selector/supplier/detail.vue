<template>
  <div>
    <div class="base_info">
      <h2>注册信息</h2>
      <div class="content flex">
        <div
          v-for="(value, key) in detailTextList"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 90px">{{ key }}：</div>
          <div style="flex: 1">{{ value }}</div>
        </div>
      </div>
    </div>
    <div class="image" v-if="attestationAttachs.length">
      <div class="content" v-if="attestationAttachs.length">
          <span> 营业执照 ： </span>
          <upload-img
            :showDelete="false"
            :showTip="false"
            :fileList="attestationAttachs"
            :limitNum="attestationAttachs.length"
          />
        </div>
    </div>
    <div class="brand_info">
      <h2>品牌信息</h2>
      <div
        v-for="(item, index) in brandInfo"
        :key="index"
        class="brand_info_item"
      >
        <div class="content flex" v-if="item.text">
          <div
            v-for="(value, key) in item.text"
            :key="key"
            style="width: 50%; display: flex; line-height: 30px"
          >
            <div style="text-align: right; width: 120px">{{ key }}：</div>
            <div style="flex: 1">{{ value }}</div>
          </div>
        </div>
        <div class="content" v-if="item.attachs.length">
          <span style="text-align: right; width: 120px"> 商标注册证 ： </span>
          <upload-img
            :showDelete="false"
            :showTip="false"
            :fileList="item.attachs"
            :limitNum="item.attachs.length"
          />
        </div>
      </div>
    </div>
    <div style="background-color: #fff; padding: 20px; margin-top: 20px">
      <h2>产品信息</h2>
      <a-table
        :columns="columns"
        :data-source="supplierList"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UploadImg from "@/components/upload/UploadImg";

export default {
  components: { UploadImg },
  data() {
    return {
      permission: "warehouse.consumable.quality",
      conditions: {},
      src: "",
      attestationAttachs: [],
      visible: false,
      detailTextList: {},
      brandInfo: [],
      loading: false,
      // page: 1,
      // pageSize: 10,
      // total: 0,
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "产品图片",
          dataIndex: "attach",
          customRender: (record) => {
            let children = [];
            children.push(
              this.$createElement("img", {
                domProps: {
                  src: record,
                },
                style: {
                  width: "50px",
                  height: "50px",
                  marginRight: "5px",
                },
              })
            );
            const obj = {
              children,
              attrs: {},
            };
            return children.length ? obj : "/";
          },
        },
        {
          title: "产品名称",
          dataIndex: "name",
        },
        {
          title: "状态",
          dataIndex: "status",
          customRender: (text, record) => {
            switch (record.status) {
              case 1:
                return "待审核";
              case 2:
                return "待测评";
              case 3:
                return "待完善";
              case 4:
                return "未通过";
              case 5:
                return "上架";
              case 6:
                return "下架";
              default:
                return "/";
            }
          },
        },
        {
          title: "类目",
          dataIndex: "",
          customRender: (text, record) => {
            let tempName;
            if (record.primaryTypeName) {
              tempName = record.primaryTypeName;
              if (record.secondaryTypeName) {
                tempName += "-" + record.secondaryTypeName;
              } else {
                tempName += "-/";
              }
            }
            return tempName || "/-/";
          },
        },
        {
          title: "成本价",
          dataIndex: "originSettlementPrice",
          customRender: (text, record) => {
            return text || "/";
          },
        },
        {
          title: "零售价",
          dataIndex: "retailPrice",
          customRender: (text, record) => {
            return text || "/";
          },
        },
        {
          title: "毛利率",
          dataIndex: "grossMargin",
          customRender: (text) => {
            return text || "/";
          },
        },
        {
          title: "带货人数",
          dataIndex: "distributorCount",
        },
        {
          title: "订单数量",
          dataIndex: "orderCount",
        },
        {
          title: "订单金额",
          dataIndex: "productAmount",
        },
      ],

      supplierList: [],
      customRow: (record) => {
        return {
          // on: {
          //   // 事件
          //   click: (event) => {
          //   }, // 点击行
          // },
        };
      },
    };
  },
  mounted() {
    this.getRows();
  },
  watch: {},
  methods: {
    ...mapActions("supplier", ["supplierDetail"]),
    getRows() {
      let obj = {
        factory: "工厂端",
        solution: "方案商",
        brand: "品牌商",
      };
      this.loading = true;
      this.supplierDetail({ supplierId: this.$route.params.id }).then((res) => {
        let detailTextList = {
          企业名称: res.data.regInfo.company,
          供应商编号: res.data.regInfo.supplierNo,
          类型: obj[res.data.regInfo.type] || "/",
          联系人: res.data.regInfo.contacter || "/",
          手机号码: res.data.regInfo.phoneNumber || "/",
          注册时间: res.data.regInfo.addTime || "/",
        };
        this.supplierList = res.data.prodInfo;
        if (res.data.regInfo.attestationAttachs) {
          detailTextList["认证时间"] = res.data.regInfo.attestationTime || "/";
          this.attestationAttachs = [
            {
              ...res.data.regInfo.attestationAttachs,
              url: res.data.regInfo.attestationAttachs.imagePath,
            },
          ];
        }
        this.detailTextList = detailTextList;
        // 品牌信息
        const { brandInfo } = res.data;
        if (brandInfo && brandInfo.length) {
          let typeName = {
            own: "自创品牌",
            license: "授权品牌",
          };
          let statusName = ["", "待审核", "通过", "不通过"];
          this.brandInfo = brandInfo.map((item) => {
            let data = {
              text: {},
              attachs: [],
            };
            data.text = {
              状态: statusName[item.status],
              类型: typeName[item.type],
              品牌名称: item.name,
              商标有效时间: item.validStartTime + " -- " + item.validEndTime,
            };
            if (item.attachs) {
              data.attachs = [
                {
                  ...item.attachs,
                  url: item.attachs.imagePath,
                },
              ];
            }
            return data;
          });
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
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
.brand_info {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  .brand_info_item {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 20px;
    padding-top: 10px;

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
  .brand_info_item:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
  .brand_info_item:first-child {
    padding-top: 0;
  }
}
/deep/.ant-table table {
  border-spacing: 0 0;
}
/deep/.ant-table-thead {
  tr {
    th {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      text-align: left;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
    }
    td {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}
/deep/.ant-table-tbody {
  tr {
    td {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}
</style>
