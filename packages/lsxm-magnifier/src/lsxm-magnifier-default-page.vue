<template>
  <div class="el-lsxm-magnifier-dialog-page">
    <el-form size="mini" inline v-if="searchParamProp && searchParamProp.length > 0">
      <el-form-item v-for="item in searchParamProp" :key="item.value" :label="item.label">
        <el-input v-model="searchParams[item.value]" @blur="startSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="startSearch">查询</el-button>
        <el-button size="mini" @click="clearSearchParams">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="lsxm-el-table-content">
      <el-table ref="searchTable" v-loading="loading" :data="tableData" style="width: 100%" :height="tableHeight"
                highlight-current-row @selection-change="tableSelectionChange" @row-click="tableRowClick"
                @row-dblclick="tableRowDbClick">
        <el-table-column v-if="multiple" type="selection" width="55"></el-table-column>
        <el-table-column :prop="item.value" :label="item.label" v-for="item in tableColumnProp"
                         :key="item.value" :width="item.width ? item.width : 'auto'"
                         show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div v-if="enablePage" class="lsxm-el-pagination-content">
      <el-pagination :background="true" layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 20, 50, 100]" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize" :total="pagination.totalCount"
                     @current-change="handleCurrentPageChange" @size-change="handleSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import {parsePageTotal} from './utils';

export default {
  name: 'ElLsxmMagnifierDefaultPage',

  props: {
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 已选中的内容
    selValue: {
      default: ''
    },
    // 输入框中返回的属性名
    lsxmValueKey: {
      type: String,
      required: true
    },
    // 检索参数配置
    searchParamProp: {
      type: Array,
      default() {
        return [];
      }
    },
    // 表格列配置
    tableColumnProp: {
      type: Array,
      default() {
        return [];
      }
    },
    // 表格高度
    tableHeight: {
      type: String,
      default: '300px'
    },
    // 表格是否开启分页
    enablePage: Boolean,
    // 表格是否支持多选
    multiple: Boolean,
    // 选项总数
    optionsTotal: {
      type: Number,
      default: 0
    },
    // 表格远程查询函数
    tableRemoteMethod: Function
  },
  data() {
    return {
      searchParams: {},
      loading: false,
      // 已选行
      selectedRow: null,
      // 已选行集合
      selectedRowList: [],
      // 分页参数
      pagination: {
        pageSize: 10,
        currentPage: 1,
        totalCount: this.optionsTotal
      }
    };
  },
  watch: {
    selValue: {
      handler(nv, ov) {
        if (nv) {
          if (nv instanceof Array) {
            const valList = this.tableData.filter(item => {
              return nv.findIndex(nItem => item[this.lsxmValueKey] === nItem) > -1;
            });
            this.tableSelectionChange(valList);
            this.$nextTick(() => {
              valList.forEach(row => {
                this.$refs.searchTable.toggleRowSelection(row, true);
              });
            });
          } else {
            const val = this.tableData.findIndex(item => item[this.lsxmValueKey] === nv);
            this.$nextTick(() => {
              this.tableRowClick(val);
            });
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initSearchParams();
  },
  methods: {
    /**
     * 初始化查询参数
     */
    initSearchParams() {
      const obj = {};
      this.searchParamProp.forEach(item => {
        obj[item.value] = null;
      });
      this.searchParams = obj;
    },
    tableSelectionChange(selection) {
      this.selectedRowList = selection;
    },
    tableRowClick(row) {
      if (this.multiple) {
        const index = this.selectedRowList.findIndex(item => item === row);
        if (index > -1) {
          this.selectedRowList.splice(index, 1);
          this.$refs.searchTable.toggleRowSelection(row, false);
        } else {
          this.selectedRowList.push(row);
          this.$refs.searchTable.toggleRowSelection(row, true);
        }
      } else {
        if (this.selectedRow && this.selectedRow === row) {
          this.selectedRow = null;
          this.$refs.searchTable.setCurrentRow();
        } else {
          this.selectedRow = row;
          this.$refs.searchTable.setCurrentRow(row);
        }
      }
    },
    tableRowDbClick(row) {
      if (!this.multiple) {
        this.tableRowClick(row);
        this.triggerLsxmConfirm();
      }
    },

    loadTableData() {
      let params;
      if (this.enablePage) {
        params = {
          start: this.pagination.pageSize * (this.pagination.currentPage - 1),
          limit: this.pagination.pageSize,
          ...this.searchParams
        };
      } else {
        params = this.searchParams;
      }
      if (this.tableRemoteMethod) {
        this.loading = true;
        this.tableRemoteMethod(params, (list, pageInfo) => {
          if (this.enablePage) {
            this.pagination.totalCount = parsePageTotal(pageInfo);
          }
          this.$emit('set-options', list);
          this.loading = false;
        });
      }
    },

    startSearch() {
      this.pagination.currentPage = 1;
      this.loadTableData();
    },
    clearSearchParams() {
      this.searchParams = {};
    },

    handleCurrentPageChange(pageNo) {
      this.pagination.currentPage = pageNo;
      this.loadTableData();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.loadTableData();
    },

    triggerLsxmConfirm() {
      this.$emit('lsxm-confirm', this.multiple ? this.selectedRowList : this.selectedRow);
    }

  }
};
</script>

<style scoped>

</style>
