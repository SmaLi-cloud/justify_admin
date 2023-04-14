<template>
  <div class="hid">
    <div class="box">
      <a-button @click="choiceAll" :loading="printAllLoading"
        >打印全部</a-button
      >
      <a-button type="primary" @click="print" :loading="printLoading"
        >打印</a-button
      >
    </div>
    <search-table
      :conditions="conditions"
      :searchs="searchs"
      :columns="columns"
      :dataSource="goods"
      :loading="loading"
      :onSearch="onSearch"
      :onRefresh="onRefresh"
      :onReset="onReset"
      :toolbar="toolbar"
      :opCols="opCols"
      :permission="permission"
      :pagination="{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
      ref="searchTable"
      :rowSelection="{
        selectedRowKeys,
        onChange: onSelectChange,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
      }"
    >
    </search-table>
    <div id="printJS-table" ref="table">
      <div
        v-for="(item, index) of tableData"
        :key="index"
        class="break"
        style="height: 123px; page-break-after: always"
      >
        <table align="left" cellspacing="0" cellpadding="0" class="print_table">
          <tr>
            <td colspan="10" class="border_bottom">
              <div class="f24">
                {{ item.name }}
              </div>
            </td>
            <td class="border_bottom logo_td">
              <img src="/static/img/logo.png" class="logo" />
            </td>
          </tr>
          <tr>
            <td width="35%" class="margin_top_5">
              <div class="one">产品型号</div>
            </td>
            <td colspan="5" class="margin_top_5" width="65%">
              <div class="one">
                {{ item.supModel ? item.supModel : "/" }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="one">捷配编号</div>
            </td>
            <td colspan="5">
              <div class="one">
                {{ item.jpModel ? item.jpModel : "/" }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="one">一件代发</div>
            </td>
            <td colspan="5">
              <div class="one">
                {{
                  item.introduce
                    ? item.introduce.supportDropshipping
                      ? "支持"
                      : "不支持"
                    : "/"
                }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="one">是否支持OEM</div>
            </td>
            <td colspan="5">
              <div class="one">
                {{ item.introduce ? item.introduce.supportOem : "/" }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="one">认证情况</div>
            </td>
            <td colspan="5">
              <div class="one">
                {{ item.introduce ? item.introduce.attestation : "/" }}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="one">产品颜色</div>
            </td>
            <td colspan="5">
              <div class="two">
                {{ item.introduce ? item.introduce.color : "/" }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="12" class="margin_top_10">
              <div class="img_flex">
                <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
                <img src="/static/img/dou_logo.png" class="dou_logo" />
              </div>
              <div class="img_flex">
                <span class="label">扫码了解商品信息</span>
                <span class="label" style="margin-left: 30px"
                  >扫码关注我们</span
                >
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import printGoods from "@/utils/printGoods";
import QRCode from "qrcodejs2";
import SearchTable from "@/components/table/SearchTable";
import { buildTree } from "@/utils/util";

export default {
  name: "print",
  components: { SearchTable },
  data() {
    return {
      tableData: [],
      goods: [],
      selectedRows: [],
      printLoading: false,
      printAllLoading: false,

      selectedRowKeys: [],
      conditions: {
        name: "",
        productType: "",
        supName: "",
      },
      permission: "client",
      searchs: [
        {
          label: "产品名称",
          type: "input",
          key: "name",
        },
        {
          label: "产品类目",
          type: "tree-select",
          key: "productType",
          props: {
            style: "width:200px",
            keyFieldName: "id",
            parentFieldName: "parentId",
            rootParentValue: "",
            props: {
              widthParentId: true,
              treeCheckable: false,
            },
            config: {
              label: "name",
              val: "id",
              parentDisabled: false,
            },
            data: [],
            ref: "primaryDept",
          },
        },
        {
          label: "供应商名称",
          type: "input",
          key: "supName",
        },
        {
          label: "创建时间",
          type: "range-picker",
          key: "addTime",
        },
      ],
      toolbar: [],
      opCols: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "产品名称",
          dataIndex: "name",
        },
        {
          title: "类目",
          dataIndex: "primaryTypeName",
          customRender: (text, rows) => {
            return (
              (text || "") +
              ((rows.secondaryTypeName || "") && "—" + rows.secondaryTypeName)
            );
          },
        },
        {
          title: "供应商名称",
          dataIndex: "supName",
          customRender: (text, record) => {
            return text;
          },
        },
        {
          title: "创建时间",
          dataIndex: "addTime",
        },
      ],
      typeList: [],
    };
  },
  methods: {
    ...mapActions("goods", ["getPrintList"]),
    ...mapMutations("goods", ["setAllProductType"]),
    ...mapActions("product", ["getAllProductType"]),
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelect(record, selected, selectedRows) {
      if (selected) {
        this.selectedRows.push(record);
      }
      if (!selected) {
        const delIndex = this.selectedRows.findIndex((val) => {
          return val.id === record.id;
        });
        this.selectedRows.splice(delIndex, 1);
      }
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        this.selectedRows = this.selectedRows.concat(changeRows);
      }
      if (!selected) {
        let selectedRows = JSON.parse(JSON.stringify(this.selectedRows));
        const delIndex = [];
        selectedRows.forEach((item, index) => {
          changeRows.forEach((val, itemIndex) => {
            if (item.id === val.id) {
              delIndex.push(index);
            }
          });
        });
        delIndex.forEach((item) => {
          delete selectedRows[item];
        });
        selectedRows = selectedRows.filter((item) => {
          return item !== undefined;
        });
        this.selectedRows = selectedRows;
      }
    },
    getList() {
      this.loading = true;
      const { page, pageSize } = this;
      let conditions = Object.assign({}, this.conditions);
      if (conditions.addTime && conditions.addTime.length > 0) {
        conditions.addTime = {
          start: conditions.addTime[0].format("YYYY-MM-DD 00:00:00"),
          end: conditions.addTime[1].format("YYYY-MM-DD 23:59:59"),
        };
      } else {
        delete conditions.addTime;
      }
      this.getPrintList({
        conditions,
        page: page,
        size: pageSize,
      })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.goods = res.data.rows;
          this.page = page;
          this.total = res.data.count;
          this.pageSize = pageSize;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handlePrint() {
      setTimeout(() => {
        let newstr = document.getElementById("printJS-table").innerHTML; //newstr为打印的页面
        printGoods(newstr); //调用引入的文件方法printHtml
        this.printLoading = false;
        this.printAllLoading = false;
      }, 200);
    },
    print() {
      if (!this.selectedRows.length) {
        this.$message.error("请至少选择一个商品后再打印！");
        return false;
      }
      this.printLoading = true;
      this.tableData = this.selectedRows;
      this.$nextTick(() => {
        this.tableData.forEach((item, index) => {
          let code = document.getElementsByClassName("qrcode");
          code[index].innerHTML = "";
          var qrcode = new QRCode(code[index], {
            text: item.url, //二维码内容
            width: 100 * 5,
            height: 100 * 5,
            colorDark: "#000", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.M, //容错率，L/M/H
          });
        });
        this.handlePrint();
      });
    },
    choiceAll() {
      this.printAllLoading = true;
      let conditions = Object.assign({}, this.conditions);
      if (conditions.addTime && conditions.addTime.length > 0) {
        conditions.addTime = {
          start: conditions.addTime[0].format("YYYY-MM-DD 00:00:00"),
          end: conditions.addTime[1].format("YYYY-MM-DD 23:59:59"),
        };
      } else {
        delete conditions.addTime;
      }
      this.getPrintList({
        conditions,
        page: 1,
        size: 9999999,
      })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.tableData = res.data.rows;
          this.$nextTick(() => {
            this.tableData.forEach((item, index) => {
              let code = document.getElementsByClassName("qrcode");
              code[index].innerHTML = "";
              var qrcode = new QRCode(code[index], {
                text: item.url, //二维码内容
                width: 100 * 5,
                height: 100 * 5,
                colorDark: "#000", //二维码颜色
                colorLight: "#ffffff", //二维码背景色
                correctLevel: QRCode.CorrectLevel.M, //容错率，L/M/H
              });
            });
            this.handlePrint();
          });
        })
        .catch((err) => {
          this.printAllLoading = false;
        });
    },
    getAllTypeList() {
      this.getAllProductType({}).then((res) => {
        if (!res.success) {
          return;
        }
        let treeData = buildTree(res.data, "id", "parentId", "children", "");
        this.$refs.searchTable.$refs.primaryDept.rawData = res.data;
      });
    },
    onSearch() {
      this.page = 1;
      this.getList();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.pageSize = size;
      this.getList();
    },
    onRefresh() {
      this.page = 1;
      this.getList();
    },
    onReset() {
      this.conditions = {
        name: "",
        productType: "",
        supName: "",
      };
      this.getList();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.pageSize = pageSize;
      this.getList();
    },
  },
  mounted() {
    this.getList();
    this.getAllTypeList();
  },
};
</script>

<style scoped lang="less">
.hid {
  height: 1000px;
  overflow: hidden;
  position: relative;
}
.box {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  padding: 20px;
  flex-wrap: wrap;

  .ant-btn {
    margin-right: 20px;
  }
  margin-bottom: 20px;
}

.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.item {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 95%;
  margin-bottom: 10px;
}

#printJS-table {
  width: 300px;
  max-height: 200px;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

@media print {
  @page {
    size: auto;
  }

  body,
  html {
    height: auto !important;
  }
}
</style>
