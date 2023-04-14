<template>
  <div>
    <div class="base_info">
      <h2>产品信息</h2>
      <div class="content">
        <div
          v-for="(value, key) in baseInfo"
          :key="key"
          style="width: 50%; display: flex; line-height: 30px"
        >
          <div style="text-align: right; width: 120px">{{ key }} ：</div>
          <span style="flex: 1">{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="image">
      <div class="content">
        <span> 产品图片 ： </span>
        <upload-img
          :showDelete="false"
          :showTip="false"
          :fileList="attachs"
          :limitNum="attachs.length"
        />
      </div>
    </div>
    <div class="box margin_T_20">
      <h2>产品规格</h2>
      <a-table
        :columns="productColumns"
        :data-source="specif"
        bordered
        :pagination="false"
      >
        <template slot="name" slot-scope="text">
          <div>{{ text }}</div>
        </template>
      </a-table>
    </div>
    <div class="box margin_T_20">
      <h2>出入库记录</h2>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
      >
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      productColumns: [
        {
          title: "规格名",
          dataIndex: "specification",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "规格产品图",
          dataIndex: "specifImg",
          customRender: (text, record) => {
            let src = "";
            let children = [];
            if (text && text.length) {
              src = text[0].thumbnailPath || text[0].attachPath || "";
            }
            if (!src) {
              return {
                children: "",
                attrs: { rowSpan: record.rowSpan },
              };
            }
            children.push(
              this.$createElement("img", {
                domProps: {
                  src,
                },
                style: {
                  width: "80px",
                  height: "80px",
                  marginRight: "5px",
                },
              })
            );
            const obj = {
              children,
              attrs: { rowSpan: record.rowSpan },
            };
            return children.length ? obj : "/";
          },
        },
        {
          title: "产品规格型号",
          dataIndex: "productModelNo",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "零售价",
          dataIndex: "retailPrice",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: record.rowSpan },
            };
          },
        },
        {
          title: "库位",
          dataIndex: "locationId",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "库存",
          dataIndex: "storageQuantity",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "入库时间",
          dataIndex: "storageTime",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "操作人",
          dataIndex: "storageStaffName",
          customRender: (text, record) => {
            return {
              children: text || "",
              attrs: { rowSpan: 1 },
            };
          },
        },
      ],
      columns: [
        {
          title: "类型",
          dataIndex: "status",
          customRender: (text) => {
            return text ? "入库" : "出库";
          },
          filters: [
            {
              text: "出库",
              value: 0,
            },
            {
              text: "入库",
              value: 1,
            },
          ],
          onFilter: (value, record) => record.status === value,
        },
        {
          title: "规格名",
          dataIndex: "proName",
        },
        {
          title: "规格产品图",
          dataIndex: "proImg",
          customRender: (text) => {
            if (text && text.fileId) {
              const src = text.thumbnailPath || text.attachPath || "";
              return <img src={src} style="height:40px;width:40px" />;
            }
            return "";
          },
        },
        {
          title: "产品规格型号",
          dataIndex: "productModelNo",
        },
        {
          title: "库位",
          dataIndex: "locationId",
        },

        {
          title: "数量",
          dataIndex: "quantity",
        },
        {
          title: "下单时间",
          dataIndex: "addTime",
        },
        {
          title: "处理人",
          dataIndex: "staffName",
        },
        {
          title: "备注",
          dataIndex: "remark",
        },
      ],
      dataSource: [],
      specif: [],
      attachs: [],
      status: -1,
      id: this.$route.params.id,
      baseInfo: {
        产品名称: "",
        类目: "",
        型号: "",
        捷配编码: "",
        产品卖点: "",
        供应商名称: "",
        选品官: "",
        零售价: "",
        数量: "",
        入库时间: "",
        处理人: "",
      },
    };
  },
  mounted() {
    this.getDetailValue();
  },
  computed: {},
  methods: {
    ...mapActions("technology", ["techStockDetail"]),
    getDetailValue() {
      this.techStockDetail({
        proId: this.id,
      }).then((res) => {
        if (!res.success) {
          return;
        }
        const { productInfo, inOutWarehouse } = res.data;
        const { attachs, primaryTypeName, secondaryTypeName, specif } =
          productInfo;
        let baseInfo = {
          产品名称: productInfo.name,
          类目:
            primaryTypeName + (secondaryTypeName && "—" + secondaryTypeName),
          型号: productInfo.supModel,
          捷配编码: productInfo.jpModel,
          产品卖点: productInfo.sellingPoint,
          供应商名称: productInfo.supName,
          选品官: productInfo.selectorName,
          零售价: productInfo.retailPrice,
          // 库位: productInfo.locationId,
          数量: productInfo.storageQuantity,
          入库时间: productInfo.storageTime,
          处理人: productInfo.storageStaffName,
        };
        if (attachs && attachs.fileId) {
          this.attachs = [{ ...attachs, url: attachs.attachPath }];
        }
        // this.specif = specif;
        let specifList = [];
        specif.map((item) => {
          const { locationInfo } = item;
          if (locationInfo && locationInfo.length) {
            locationInfo.map((locationItem, index) => {
              let obj = {
                ...item,
                ...locationItem,
              };
              if (locationInfo.length > 1) {
                if (index === 0) {
                  obj.rowSpan = locationInfo.length;
                } else {
                  obj.rowSpan = 0;
                }
              } else {
                obj.rowSpan = 1;
              }
              specifList.push(obj);
            });
          } else {
            specifList.push({
              ...item,
              rowSpan: 1,
            });
          }
        });
        this.specif = specifList;
        this.baseInfo = baseInfo;
        this.dataSource = inOutWarehouse;
      });
    },
    onRefresh() {
      this.getDetailValue();
    },
  },
};
</script>
<style lang="less" scoped>
.margin_T_20 {
  margin-top: 20px;
}
.btn_box {
  position: sticky;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 2;
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
    padding-left: 67px;
    padding-right: 40px;
  }
  .content:first-of-type {
    margin-bottom: 0px;
  }
}
.box {
  background-color: #fff;
  padding: 20px;
  .content {
    margin-left: 20px;
    padding-right: 40px;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
}
::v-deep .ant-descriptions-item-label {
  width: 25%;
}
::v-deep .ant-descriptions-item-content {
  width: 25%;
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
/deep/.ant-table-tbody {
  tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) {
    td {
      background-color: #fff;
    }
  }
}
</style>
