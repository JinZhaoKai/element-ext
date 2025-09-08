<template>
  <div>
    <el-dialog :visible.sync="value" :title="dialogTitle" :width="dialogWidth"
               :close-on-click-modal="false">
      <component ref="magnifier" v-bind:is="customDialogComponent" :lsxm-value-key="lsxmValueKey"
                 :search-param-prop="searchParamProp" :table-column-prop="tableColumnProp"
                 :enable-page="enablePage" :multiple="$attrs.multiple"
                 :table-height="tableHeight" :table-remote-method="tableRemoteMethod"
                 @lsxm-confirm="lsxmConfirm"></component>
      <div slot="footer">
        <el-button size="small" @click="onCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ElLsxmMagnifierDialog',
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
    // 自定义dialog组件
    customDialogComponent: {
      type: String,
      default: 'ElLsxmMagnifierDefaultPage'
    },
    // 表格远程查询函数
    tableRemoteMethod: Function,
    // 确认函数
    lsxmConfirm: {
      type: Function,
      required: true
    }
  },
  methods: {
    onCancel() {
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.magnifier.triggerLsxmConfirm();
    }
  }
};
</script>

<style scoped>

</style>