<template>
  <div class="lsxm-el-select">
    <el-select v-model="magnifierValue" v-bind="$attrs" v-on="$listeners"
               filterable remote reserve-keyword :remote-method="lsxmRemoteMethod"
               :loading="loading">
      <div class="lsxm-el-select-dropdown__item">
        <el-row type="flex" justify="space-between">
          <el-col v-for="tableColumn in tableColumnProp" :key="tableColumn.label">
            {{ tableColumn.label }}
          </el-col>
        </el-row>
      </div>
      <el-option v-for="item in tableData" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]">
        <el-row type="flex" justify="space-between">
          <el-col v-for="tableColumn in tableColumnProp" :key="tableColumn.value">
            {{ item[tableColumn.value] }}
          </el-col>
        </el-row>
      </el-option>
      <i slot="suffix" class="el-select__caret el-input__icon el-icon-search is-reverse"
         @click.stop="dialogVisible = true"></i>
    </el-select>
  </div>
</template>

<script>
import ElSelect from 'element-ui/packages/select';

export default {
  name: 'ElLsxmMagnifier',

  components: {
    ElSelect
  },

  props: {
    value: {
      required: true
    },
    // 对话框标题
    dialogTitle: {
      type: String,
      default: '放大镜'
    },
    // 对话框宽度
    dialogWidth: {
      type: String,
      default: '800px'
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
    // 输入框中显示的键名
    labelKey: {
      type: String,
      default: 'value'
    },
    // 表格是否开启分页
    enablePage: Boolean,
    // 表格远程查询函数
    tableRemoteMethod: Function,
    // 表格加载状态
    tableLoading: Boolean
  },
  data() {
    return {
      magnifierValue: this.value,
      dialogVisible: false,
      searchParams: {},
      tableData: [],
      loading: true,
      // 已选行
      selectedRow: null,
      // 作为 value 唯一标识的键名，绑定值为对象类型时必填
      valueKey: 'value',

      // 分页参数
      pagination: {
        pageSize: 20,
        currentPage: 1,
        totalCount: 0
      }
    };
  },
  computed: {},
  created() {
    this.initSearchParams();
  },
  mounted() {
    if (this.$attrs['value-key']) {
      this.valueKey = this.$attrs['value-key'];
    }
    this.lsxmRemoteMethod();
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

    tableRowClick(row) {
      if (this.selectedRow && this.selectedRow === row) {
        this.selectedRow = null;
        this.$refs.searchTable.setCurrentRow();
      } else {
        this.selectedRow = row;
        this.$refs.searchTable.setCurrentRow(row);
      }
    },
    tableRowDbClick(row) {
      this.tableRowClick(row);
      this.onConfirm();
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
      this.tableRemoteMethod && this.tableRemoteMethod(params, (list, pageInfo) => {
        if (this.enablePage) {
          this.pagination.totalCount = pageInfo.total;
        }
        this.tableData = list;
      });
    },

    startSearch() {
      this.pagination.currentPage = 1;
      this.loadTableData();
    },
    clearSearchParams() {
      this.searchParams = {};
    },

    lsxmRemoteMethod(query) {
      const remoteMethod = this.$attrs['remote-method'];
      if (remoteMethod && typeof remoteMethod === 'function') {
        remoteMethod(query, array => {
          this.loading = false;
          if (Array.isArray(array)) {
            this.tableData = array;
          } else {
            console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array');
          }
        });
      }
    },

    visibleChange(res) {
      if (res) {
        this.lsxmRemoteMethod();
      }
    },

    handleCurrentPageChange(pageNo) {
      this.pagination.currentPage = pageNo;
      this.loadTableData();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.loadTableData();
    },

    onConfirm() {
      if (this.selectedRow) {
        this.$emit('input', this.selectedRow[this.valueKey]);
        this.dialogVisible = false;

        if (this.$listeners && this.$listeners.select) {
          const {select} = this.$listeners;
          if (typeof select === 'function') {
            select(this.selectedRow);
          }
        }
      }
    }

  }
};
</script>
