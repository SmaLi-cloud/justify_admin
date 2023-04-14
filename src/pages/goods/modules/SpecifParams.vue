<template>
  <div class="spe_box">
    <h2>规格参数</h2>
    <div class="specif">
      <div
        class="flex"
        v-for="(item, index) in specifications"
        :key="index"
        style="
          border-bottom: rgb(217, 217, 217) solid 2px;
          padding-bottom: 10px;
          padding-top: 10px;
        "
      >
        <div style="flex: 1">
          <div style="margin-bottom: 15px">
            <span>规格名</span>
            <a-select
              :disabled="
                status > 3 || (item.tags && item.tags.length) ? true : false
              "
              style="width: 220px; margin-left: 10px"
              v-model="item.name"
              @change="handlerChange($event, index)"
            >
              <a-select-option
                :value="specif.value"
                v-for="specif in specifList"
                :key="specif.id"
                >{{ specif.value }}</a-select-option
              >value
            </a-select>
          </div>
          <div style="display: flex; flex-wrap: wrap">
            <span style="margin-right: 10px; line-height: 30px">规格值 </span>
            <span
              style="
                border: rgb(217, 217, 217) solid 1px;
                border-radius: 3px;
                padding-left: 10px;
                padding-right: 10px;
                background-color: #fff;
                margin-right: 15px;
                line-height: 30px;
              "
              v-for="(value, itemIndex) in item['tags']"
              :key="value.value"
            >
              {{ value.value }}
              <a-icon
                type="close"
                style="padding-left: 20px"
                @click="deleteValue(value.value, index, itemIndex)"
              />
            </span>
            <span
              class="specif_add"
              style="color: #ff9900; line-height: 30px"
              @click="addSpecif(item, index)"
              >添加规格值</span
            >
          </div>
        </div>

        <a-icon
          type="delete"
          theme="filled"
          @click="deleteItem(item, index)"
          v-if="status === 3"
        />
      </div>
      <a-button
        v-if="status === 3"
        type="dashed"
        :style="specifications.length ? 'margin-top:20px' : 'margin-top:0px'"
        @click="addItem"
      >
        添加规格
      </a-button>
    </div>
    <add-specif-value ref="modalRef" @onOk="onOk" />
    <a-table
      :columns="columns"
      :data-source="skus"
      bordered
      :pagination="false"
    >
      <template slot="name" slot-scope="text">
        <a>{{ text }}</a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import AddSpecifValue from "./AddSpecifValue.vue";
export default {
  components: { AddSpecifValue },
  props: {
    status: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      columns: [],
      specifList: [],
      tempIndex: -1,
      tempMaxIndex: 0,
    };
  },
  mounted() {
    this.getAllProductSpecif();
  },
  methods: {
    ...mapMutations("goods", ["setSpecifications", "setSkus"]),
    ...mapActions("file", ["batchUpload"]),
    ...mapActions("goods", ["allProductSpecif"]),
    getAllProductSpecif() {
      this.allProductSpecif({}).then((res) => {
        if (!res.success) {
          return;
        }
        this.specifList = res.data;
      });
    },
    handlerChange(value, index) {
      if (!value) {
        return;
      }
      let data = this.specifications.concat([]);
      let hasRepeat = data.some(
        (item, i) => item.name && i !== index && item.name === value
      );
      if (hasRepeat) {
        this.$message.error("参数名重复");
        data[index].name = "";
        this.setSpecifications(data);
      }
    },
    deleteValue(value, index, itemIndex) {
      let data = this.specifications.concat([]);
      let tag = data[index]["name"];
      let tags = data[index]["tags"];
      let newTagsData = [];
      tags.forEach((item, i) => {
        if (item.addIndex) {
          if (i < itemIndex) {
            newTagsData.push(item);
          } else if (i > itemIndex) {
            newTagsData.push({
              ...item,
              addIndex: item.addIndex - 1,
            });
          }
        } else {
          if (i !== itemIndex) {
            newTagsData.push(item);
          }
        }
      });
      data[index]["tags"] = newTagsData;
      this.setSpecifications(data);
      if (!newTagsData.length) {
        const newSkus = this.skus.map((item) => {
          let hasOwnProperty = Object.prototype.hasOwnProperty.call(item, tag);
          if (hasOwnProperty && item[tag]["value"] === value) {
            delete item[tag];
          } else {
            newTagsData.some((tagItem) => {
              if (item[tag]["value"] === tagItem.value) {
                item[tag] = {
                  value: tagItem.value,
                  index: tagItem.addIndex || tagItem.index,
                };
                return true;
              }
            });
          }
          return item;
        });
        this.setSkus(newSkus);
        return;
      }
      const newSkus = this.skus.filter((item) => {
        let hasOwnProperty = Object.prototype.hasOwnProperty.call(item, tag);
        if (hasOwnProperty && item[tag]["value"] === value) {
          return false;
        } else {
          newTagsData.some((tagItem) => {
            if (item[tag]["value"] === tagItem.value) {
              item[tag] = {
                value: tagItem.value,
                index: tagItem.addIndex || tagItem.index,
              };
              return true;
            }
          });
        }
        return true;
      });
      this.setSkus(newSkus);
    },
    addSpecif(item, index) {
      if (!item.name) {
        this.$message.warning("请先选择规格名");
        return;
      }
      let isRepeat = this.specifications.some(
        (specifItem, specifIndex) =>
          specifIndex !== index &&
          item.name &&
          specifItem.name &&
          item.name === specifItem.name
      );
      if (isRepeat) {
        this.$message.warning("规格名重复");
        return;
      }
      this.tempIndex = index;
      this.$refs.modalRef.showModal();
    },
    addItem() {
      if (this.specifications.length < 3) {
        let data = this.specifications.concat([]);
        data.push({
          name: "",
          maxIndex: 0,
          tags: [],
        });
        this.setSpecifications(data);
      } else {
        this.$message.warning("最多只能三个规格");
      }
    },
    modify() {
      let result = true;
      let specifVerify = this.specifications.some((item) => {
        if (!item.name || !item.tags || !item.tags.length) {
          return true;
        }
      });
      if (!this.skus.length) {
        return false;
      }
      for (let index in this.skus) {
        let ele = this.skus[index];
        let value = true;
        for (const key in ele) {
          const element = ele[key];
          if (
            key === "status" ||
            key === "supModelNo" ||
            key === "productModelNo"
          ) {
            continue;
          }
          if (!element && element !== "0" && element !== 0 && ele.status) {
            value = false;
            break;
          }
        }
        if (!value) {
          result = false;
          break;
        }
      }
      return result && !specifVerify;
    },
    getInsertData(data, value) {
      /**
       * 插入新数据功能开发
       */
      let insertData = [];
      if (!data[this.tempIndex]["tags"].length) {
        if (this.tempIndex === 0 && this.skus.length === 0) {
          let obj = {
            status: 0,
            specifImg: [],
            supModelNo: "",
            distributionPrice: "",
            retailPrice: "",
            samplePrice: "",
            settlementPrice: "",
            reserve: "",
          };
          obj[data[this.tempIndex]["name"]] = value;
          // this.setSkus([obj]);
          return [obj];
        } else {
          let skus = this.skus.map((item) => {
            let obj = {};
            obj[data[this.tempIndex]["name"]] = value;
            return Object.assign(item, obj);
          });
          // this.setSkus(skus);
          return skus;
        }
      }
      const { space, count, num, fillArr } = data.reduce(
        (prev, item, index) => {
          let { space, count, num, fillArr } = prev;
          const { name, tags } = item;
          let length = item.tags?.length || 1;
          if (index < this.tempIndex) {
            if (insertData.length) {
              let newInserData = [];
              insertData.map((insertItem) => {
                tags.map((ele) => {
                  let obj = {
                    ...insertItem,
                  };
                  obj[name] = ele;
                  newInserData.push(obj);
                });
              });
              insertData = newInserData;
            } else {
              let objArr = tags.map((ele) => {
                let obj = {};
                obj[name] = ele;
                return obj;
              });
              insertData = objArr;
            }
            count = count * length;
          } else if (index == this.tempIndex) {
            space = space * length;
          } else if (index > this.tempIndex) {
            num = num * length;
            space = space * length;
            if (fillArr.length) {
              let newFillArr = [];
              fillArr.forEach((fillItem) => {
                tags.forEach((item) => {
                  let obj = { ...fillItem };
                  obj[name] = item;
                  newFillArr.push(obj);
                });
              });
              fillArr = newFillArr;
            } else {
              fillArr = tags.map((item) => {
                let obj = {};
                obj[name] = item;
                return obj;
              });
            }
          }
          return { space, count, num, fillArr };
        },
        {
          space: 1, // 隔
          count: 1, // 次
          num: 1, //补,
          fillArr: [],
        }
      );
      let newSkus = this.skus.concat([]);
      let insertIndex = [];
      for (let i = 1; i <= count; i++) {
        insertIndex.push(space * i - 1);
      }
      for (let i = newSkus.length - 1; i >= 0; i--) {
        if (insertIndex.includes(i)) {
          let obj = insertData.pop() || {};
          obj[data[this.tempIndex]["name"]] = value;
          let arr = [];
          if (fillArr.length) {
            arr = fillArr.map((item) => {
              return {
                ...item,
                ...obj,
                status: 0,
                specifImg: [],
                supModelNo: "",
                distributionPrice: "",
                retailPrice: "",
                samplePrice: "",
                settlementPrice: "",
                reserve: "",
              };
            });
          } else {
            arr = new Array(num).fill({
              ...obj,
              status: 0,
              specifImg: [],
              supModelNo: "",
              distributionPrice: "",
              retailPrice: "",
              samplePrice: "",
              settlementPrice: "",
              reserve: "",
            });
          }
          newSkus.splice(i + 1, 0, ...arr);
        }
      }
      // this.setSkus(newSkus)
      return newSkus;
      /**
       * 结束
       */
    },
    onOk(value) {
      if (this.tempIndex != -1) {
        let data = this.specifications.concat([]);
        let isRepeat = data[this.tempIndex]["tags"].some((item) => {
          return value.specifValue === item.value;
        });
        if (isRepeat) {
          this.$message.error("规格值重复，请修改");
          return;
        }
        const maxIndex = data[this.tempIndex]["maxIndex"];
        let addIndex = maxIndex || 0;
        data[this.tempIndex]["tags"].forEach((item) => {
          if (item.addIndex > addIndex) {
            addIndex = item.addIndex;
          }
        });
        let newSkus = this.getInsertData(data, {
          value: value.specifValue,
          index: addIndex + 1,
        });
        this.setSkus(newSkus);
        data[this.tempIndex]["tags"].push({
          value: value.specifValue,
          addIndex: addIndex + 1,
        });
        this.setSpecifications(data);
        this.$refs.modalRef.handleCancel();
      }
    },
    deleteItem(row, index) {
      let data = this.specifications.concat([]);
      if (data[index]["tags"].length) {
        this.formatData();
      }
      data.splice(index, 1);
      if (!data.length) {
        this.setSkus([]);
      }
      this.setSpecifications(data);
    },
    formatData() {
      let newValue = this.specifications.concat([]).reverse();
      let allLength = newValue.reduce((prev, item) => {
        return (item.tags.length || 0) * prev;
      }, 1);
      let data = [];
      if (allLength) {
        data = new Array(allLength).fill({
          status: 0,
          specifImg: [],
          supModelNo: "",
          distributionPrice: "",
          retailPrice: "",
          samplePrice: "",
          settlementPrice: "",
          reserve: "",
        });
      }
      data = this.getData(data, newValue, allLength);
      this.setSkus(data.concat([]));
    },
    getData(initData, add, allLength) {
      initData = initData.concat([]);
      let result = add.reduce(
        (prev, item, index) => {
          let { prevLength, prevInitData } = prev;
          let length = item.tags.length * prevLength;
          let data = prevInitData.map((value, i) => {
            let a = parseInt(i / prevLength) % item.tags.length;
            value[item.name] = item.tags[a];
            return {
              ...value,
            };
          });
          return {
            prevLength: length,
            prevInitData: data,
          };
        },
        {
          prevLength: 1,
          prevInitData: initData,
        }
      );
      return result.prevInitData;
    },
    caculateDistribution(row, index) {
      const { settlementPrice, retailPrice } = row;
      if (!settlementPrice) {
        this.$message.error("请填写成本价");
        return;
      }
      if (!retailPrice) {
        this.$message.error("请填写零售价");
        return;
      }
      let hundredDis = 0;
      let percentDis = 0;
      let dis = 0;
      hundredDis = retailPrice - 100;
      percentDis = retailPrice / 1.2;
      if (hundredDis <= 0) {
        dis = Math.floor(percentDis);
      } else {
        if (1 < retailPrice / (1.2 * settlementPrice)) {
          dis = Math.floor(percentDis);
        } else {
          dis = Math.floor(hundredDis);
        }
      }
      let benefit = dis / settlementPrice;
      if (benefit > 1.3) {
        dis = Math.floor(settlementPrice * 1.3);
      } else if (benefit >= 1) {
      } else {
        this.$message.error("该商品没有合适的供货价");
        return;
      }
      let newSkus = this.skus.concat([]);
      if (newSkus[index]) {
        newSkus[index].distributionPrice = dis;
        // newSkus[index].samplePrice = dis
        this.setSkus(newSkus);
      }
    },
  },
  watch: {
    specifications: {
      deep: true,
      immediate: true,
      handler(newValue, oldvalue) {
        this.columns = [
          {
            title: "操作",
            dataIndex: "status",
            customRender: (text, row, index) => {
              if (text) {
                return (
                  <span
                    onClick={() => {
                      let newData = this.skus.concat([]);
                      newData[index]["status"] = 0;
                      this.setSkus(newData);
                      this.$message.success("已禁用");
                    }}
                  >
                    禁用
                  </span>
                );
              }
              return (
                <span
                  style={{ color: "#ff9900" }}
                  onClick={() => {
                    let newData = this.skus.concat([]);
                    newData[index]["status"] = 1;
                    this.setSkus(newData);
                    this.$message.success("已启用");
                  }}
                >
                  启用
                </span>
              );
            },
          },
          {
            title: "计算",
            dataIndex: "setPrice",
            customRender: (text, row, index) => {
              return (
                <span
                  style={{ color: "#ff9900" }}
                  onClick={() => {
                    this.caculateDistribution(row, index);
                  }}
                >
                  计算分销值
                </span>
              );
            },
          },
          {
            title: "规格图片",
            dataIndex: "specifImg",
            customRender: (text, row, index) => {
              let fileList = [];
              if (text && text.length) {
                fileList = [{ ...text[0], url: text[0].attachPath }];
              }
              return (
                <upload-img
                  showTip={false}
                  fileList={fileList}
                  onDeleteImg={() => {
                    let newData = this.skus.concat([]);
                    newData[index]["specifImg"] = [];
                    this.setSkus(newData);
                  }}
                  onOnChange={(obj) => {
                    const { file } = obj;
                    let files = [];
                    if (file && !file.fileId) {
                      files.push({
                        fileName: file.name,
                        extension: file.type.split("/")[1],
                        fileContent: file.url,
                        thumbnail: true,
                      });
                    }
                    this.batchUpload({ files }).then((res) => {
                      if (!res.success) {
                        return;
                      }
                      const { data } = res;
                      let newFile = {
                        fileId: data[0].fileId,
                        thumbnailPath: data[0].thumbnailPath,
                        attachPath: data[0].imagePath,
                      };
                      let newData = this.skus.concat([]);
                      newData[index]["specifImg"] = [newFile];
                      this.setSkus(newData);
                    });
                  }}
                  limitNum={1}
                />
              );
            },
          },
          {
            title: "分销价",
            dataIndex: "distributionPrice",
            customRender: (text, row, index) => {
              return (
                <a-input
                  style={{ width: "100px" }}
                  value={text}
                  onChange={(e) => {
                    let newData = this.skus.concat([]);
                    newData[index]["distributionPrice"] = e.target.value;
                    this.setSkus(newData);
                  }}
                />
              );
            },
          },
          {
            title: "零售价",
            dataIndex: "retailPrice",
            customRender: (text, row, index) => {
              return (
                <a-input
                  style={{ width: "100px" }}
                  value={text}
                  onChange={(e) => {
                    let newData = this.skus.concat([]);
                    newData[index]["retailPrice"] = e.target.value;
                    this.setSkus(newData);
                  }}
                />
              );
            },
          },
          {
            title: "样品价",
            dataIndex: "samplePrice",
            customRender: (text, row, index) => {
              return (
                <a-input
                  style={{ width: "100px" }}
                  value={text}
                  onChange={(e) => {
                    let newData = this.skus.concat([]);
                    newData[index]["samplePrice"] = e.target.value;
                    this.setSkus(newData);
                  }}
                />
              );
            },
          },
          {
            title: "成本价",
            dataIndex: "settlementPrice",
            customRender: (text, row, index) => {
              return (
                <a-input
                  style={{ width: "100px" }}
                  value={text}
                  onChange={(e) => {
                    let newData = this.skus.concat([]);
                    newData[index]["settlementPrice"] = e.target.value;
                    this.setSkus(newData);
                  }}
                />
              );
            },
          },
          {
            title: "库存",
            dataIndex: "reserve",
            customRender: (text, row, index) => {
              return (
                <a-input
                  style={{ width: "100px" }}
                  value={text}
                  onChange={(e) => {
                    let newData = this.skus.concat([]);
                    newData[index]["reserve"] = e.target.value;
                    this.setSkus(newData);
                  }}
                />
              );
            },
          },
        ];
        let allLength = newValue.reduce((prev, item) => {
          return (item.tags.length || 0) * prev;
        }, 1);
        newValue = newValue.concat([]).reverse();
        for (let j = 0; j < allLength; j++) {}
        let col = newValue.reduce(
          (prev, item) => {
            let length = (item.tags.length || 1) * prev.length;
            let prevLength = prev.length;
            let column = [
              {
                title: item.name,
                dataIndex: item.name,
                customRender: (text, row, index) => {
                  const obj = {
                    children: text?.value||"",
                    attrs: {},
                  };
                  if ((index + prevLength) % prevLength == 0) {
                    obj.attrs.rowSpan = prevLength;
                  } else {
                    obj.attrs.rowSpan = 0;
                  }
                  return obj;
                },
              },
            ].concat(prev.arr);
            return {
              length: length,
              arr: column,
            };
          },
          { arr: [], length: 1 }
        );
        this.columns = [...col.arr, ...this.columns];
      },
    },
  },
  computed: {
    ...mapState("goods", ["specifications", "skus"]),
  },
};
</script>
<style lang="less" scoped>
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

.spe_box {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
.flex {
  display: flex;
  align-items: center;
}
.specif {
  // width: 60%;
  background-color: rgb(250, 250, 250);
  padding: 20px;
  margin-bottom: 20px;
  .specif_add:hover {
    cursor: pointer;
  }
}
</style>
