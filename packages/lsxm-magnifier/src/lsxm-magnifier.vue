<template>
  <div class="el-lsxm-magnifier">
    <el-select v-model="magnifierValue" v-bind="$attrs" v-on="$listeners"
               filterable remote reserve-keyword default-first-option
               :remote-method="lsxmRemoteMethod" :loading="selectLoading"
               :style="{width: '100%'}">
      <div class="el-lsxm-magnifier-dropdown__item">
        <el-row type="flex" justify="space-between">
          <el-col v-for="tableColumn in tableColumnProp" :key="tableColumn.label">
            {{ tableColumn.label }}
          </el-col>
        </el-row>
      </div>
      <el-option v-for="item in options" :key="getForKey(item)" :label="item[labelKey]" :value="item[lsxmValueKey]">
        <el-row type="flex" justify="space-between">
          <el-col v-for="tableColumn in tableColumnProp" :key="tableColumn.value">
            {{ item[tableColumn.value] }}
          </el-col>
        </el-row>
      </el-option>
      <i slot="suffix-inner" class="el-select__caret el-input__icon el-icon-search is-reverse"
         @click.stop="dialogVisible = true"></i>
    </el-select>

    <el-lsxm-magnifier-dialog v-model="dialogVisible" :dialog-title="dialogTitle" :dialog-width="dialogWidth"
                              :custom-page-component="customPageComponent"
                              :search-param-prop="searchParamProp" :table-column-prop="tableColumnProp"
                              :lsxm-value-key="lsxmValueKey" :enable-page="enablePage" :multiple="$attrs.multiple"
                              :table-height="tableHeight" :table-remote-method="tableRemoteMethod"
                              :lsxm-confirm="handleLsxmConfirm" :sync-list-fun="handleSyncListFun"
                              :init-load="initLoad" :init-load-params="initLoadParams"></el-lsxm-magnifier-dialog>
  </div>
</template>

<script>
import {parsePageTotal} from './utils';

export default {
  name: 'ElLsxmMagnifier',
  props: {
    value: {
      required: true
    },
    // 输入框中返回的属性名
    lsxmValueKey: {
      type: String,
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
      default: '50%'
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
    enablePage: {
      type: Boolean,
      default: true
    },
    // 下拉框加载状态
    selectLoading: {
      type: Boolean,
      default: false
    },
    // 自定义dialog page组件
    customPageComponent: {
      type: String,
      default: 'ElLsxmMagnifierDefaultPage'
    },
    // 表格远程查询函数
    tableRemoteMethod: Function,
    // 组件渲染完成默认加载下拉数据
    initLoad: {
      type: Boolean,
      default: true
    },
    // 初始化加载参数
    initLoadParams: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      magnifierValue: this.value,
      dialogVisible: false,
      initOptions: [],
      basicOptions: [],
      enableInitParams: true,
      searchParams: {},
      total: 0
    };
  },
  computed: {
    options: {
      get() {
        return this.basicOptions.concat(this.initOptions).reduce((acc, item) => {
          const res = acc.some((obj) => {
            const valueKey = this.$attrs['value-key'];
            if (valueKey) {
              return (obj[this.lsxmValueKey][valueKey] === item[this.lsxmValueKey][valueKey]);
            } else {
              return obj[this.lsxmValueKey] === item[this.lsxmValueKey];
            }
          });
          if (!res) {
            acc.push(item);
          }
          return acc;
        }, []);
      },
      set(val) {
        if (this.enableInitParams) {
          this.initOptions = val;
        } else {
          this.basicOptions = val;
        }
      }
    }
  },
  watch: {
    value(nv, ov) {
      this.magnifierValue = this.value;
    },
    initLoad: {
      handler(nv) {
        if (nv) {
          this.lsxmRemoteMethod('');
        }
      },
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

    lsxmRemoteMethod(query) {
      const remoteMethod = this.$attrs['remote-method'];
      if (remoteMethod && typeof remoteMethod === 'function') {
        remoteMethod(query, (array, pageInfo) => {
          if (Array.isArray(array)) {
            this.options = array;
            this.total = parsePageTotal(pageInfo);
          } else {
            console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array');
          }
        },
        {
          initLoadParams: this.enableInitParams ? this.initLoadParams : {}
        });
      }
    },

    handleLsxmConfirm(tabSelVal) {
      if (tabSelVal) {
        let val = '';
        if (tabSelVal instanceof Array) {
          val = tabSelVal.map(item => item[this.lsxmValueKey]);
        } else {
          val = tabSelVal[this.lsxmValueKey];
        }
        this.magnifierValue = val;
        this.$emit('input', val);
        this.$emit('change', val);
        this.dialogVisible = false;

        if (this.$listeners && this.$listeners.select) {
          const {select} = this.$listeners;
          if (typeof select === 'function') {
            select(tabSelVal);
          }
        }
      }
    },

    handleSyncListFun(array) {
      if (Array.isArray(array) && array.length > 0) {
        this.basicOptions = array;
      }
    },

    getForKey(item) {
      const val = item[this.lsxmValueKey];
      return typeof val === 'object' ? val[this.$attrs['value-key']] : val;
    }

  }
};
</script>
