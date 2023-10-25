<template>
  <div class="setting">
    <el-table :ref="tableRef" :class="draggable ? 'draggable-table' : ''" v-bind="$attrs" v-on="$listeners"
      @header-dragend="defaultColumnWidthChange" v-if="showTable">
      <slot></slot>
    </el-table>
    <el-popover width="150" trigger="click">
      <div class="setting__checkbox">
        <el-scrollbar v-if="allColumns && allColumns.length > 0" 
          :style="'height: ' + popoverHeight" class="checkbox-scrollbar">
          <el-checkbox-group v-model="selColumnProps">
            <el-checkbox v-for="item in allColumns" :label="item.prop" :key="item.prop">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
        <div v-else class="checkbox-empty">暂无可选的动态列</div>
      </div>
      <div v-if="draggable && settingBtn" slot="reference" :class="settingPositionClass">
        <em class="el-icon-setting"></em>
      </div>
    </el-popover>
  </div>
</template>

<script>
import ElTable from 'element-ui/packages/table';
import ElPopover from 'element-ui/packages/popover';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
import Scrollbar from 'element-ui/packages/scrollbar';
import Sortable from 'sortablejs';

export default {
  name: 'DraggableTable',
  components: {
    ElTable,
    ElPopover,
    ElCheckbox,
    ElCheckboxGroup,
    Scrollbar
  },
  data() {
    return {
      // 是否显示表格,主要功能是拖动列后通过隐藏再显示的方式实现刷新表格的功能
      showTable: true
    };
  },
  props: {

    // 拖动模式
    draggable: {
      type: Boolean,
      default: false
    },

    // 内部ElTable组件的ref
    tableRef: {
      type: String,
      default: 'draggableTable'
    },

    // 设置按钮是否显示，必须开启拖动模式
    settingBtn: {
      type: Boolean,
      default: true
    },

    // 设置按钮位置
    settingPosition: {
      type: String,
      default: 'left-top'
    },

    // 配置不能拖动的属性，通过CSS选择器的方式配置
    filterDraggableSelector: {
      type: String,
      default: '.el-table-column--selection,.el-table-column--index,.el-table__expand-column'
    },

    // 表格列，当前显示的列
    columns: {
      type: Array,
      default: []
    },

    // 表格可选的列
    allColumns: {
      type: Array,
      default: []
    },

    // 设置按钮弹出层高度
    popoverHeight: {
      type: String,
      default: '30vh'
    },

    // 处理表格列变更
    handleColumnsChange: {
      type: Function,
      default: null
    },

    // 处理表格列宽变化
    headerColumnWidthChange: {
      type: Function,
      default: null
    }

  },
  computed: {

    /**
     * 计算选中的表格列
     * @returns {*[]}
     */
    selColumnProps: {
      get() {
        return this.columns.map(item => item.prop);
      },
      set(columnProps) {
        this.columns.splice(0, this.columns.length);
        columnProps.forEach(columnProp => {
          let index = this.allColumns.findIndex(allColumn => columnProp === allColumn.prop);
          if (index > -1) {
            this.columns.push(this.allColumns[index]);
          }
        });
        this.defaultColumnsChange(this.columns);
      }
    },

    /**
     * 设置按钮类属性计算
     * @returns {string}
     */
    settingPositionClass() {
      return 'setting__content is-fixed ' + this.settingPosition;
    }

  },
  mounted() {
    this.initSortable();
  },
  methods: {

    /**
     * 初始化拖动功能
     */
    initSortable() {
      // 需要支持拖动效果的列表容器，在这里我们设置为el-table组件的tbody，
      // 注意：最前面的一段为前面el-table的class: draggable-table，主要为了防止如果页面有多个table，多个table同时实现拖拽效果
      // 当然，如果多个table都需要拖拽效果，选择器中最前面的.draggable-table可以去除。
      const tr = document.querySelector('.draggable-table .el-table__header-wrapper thead tr');
      this.sortable = new Sortable(tr, {
        animation: 150,
        // 哪些元素不能拖动
        filter: this.filterDraggableSelector,
        // 哪些元素可以拖动
        draggable: '.el-table__cell',
        // 需要在odEnd方法中处理原始eltable数据，使原始数据与显示数据保持顺序一致
        onEnd: this.sortableOnEnd,
        onMove: this.sortableOnMove
      });
    },

    /**
     * 拖动结束
     * @param e
     */
    sortableOnEnd(e) {
      // 得到当前表格列移动的索引。
      // 这是表格列的索引，不一定是动态表格的索引，因为表格选择列、序号列不在动态表格中，如果直接使用表格索引，索引会不一致。
      let { newIndex, oldIndex } = e;
      // 通过虚拟dom获取表格列数
      let tableColumns = this.$refs[this.tableRef].columns;
      // 当用户拖动到会改变顺序时才触发
      if (newIndex !== oldIndex) {
        // 获取表格列的属性名称
        let newProp = tableColumns[newIndex].property;
        let oldProp = tableColumns[oldIndex].property;
        // 根据属性名称获取属性的索引，这才是动态列表的索引
        let newPropIndex = this.columns.findIndex(column => column.prop === newProp);
        let oldPropIndex = this.columns.findIndex(column => column.prop === oldProp);
        // 通过动态列表的索引驱动列表改变顺序
        this.showTable = false;
        const targetRow = this.columns[oldPropIndex];
        this.columns.splice(oldPropIndex, 1);
        this.columns.splice(newPropIndex, 0, targetRow);
        this.$nextTick(() => {
          this.showTable = true;
          this.$nextTick(() => {
            this.initSortable();
          });
          // 表格列顺序发生变化，触发变更
          this.defaultColumnsChange(this.columns);
        });
      }
    },

    /**
     * 在列表中或列表之间移动项目时的事件
     * @param evt
     * @returns {boolean|number} false：取消停靠；-1：在目标前插入；1：在目标后插入。
     */
    sortableOnMove(evt) {
      // 不允许停靠在标签黑名单中
      if (Sortable.utils.is(evt.related, this.filterDraggableSelector)) {
        return false;
      }
      // false：取消停靠；-1：在目标前插入；1：在目标后插入。
      return evt.willInsertAfter ? 1 : -1;
    },

    /**
     * 表格列变化默认实现
     *
     * @param columns
     */
    defaultColumnsChange(columns) {
      // 如果传递了函数，那么使用用户自定义的函数
      if (typeof this.handleColumnsChange === 'function') {
        this.handleColumnsChange(columns);
      }
    },

    /**
     * 表格列宽变化默认实现
     * @param newWidth 新宽度
     * @param oldWidth 旧宽度
     * @param column 列
     * @param event event
     */
    defaultColumnWidthChange(newWidth, oldWidth, column, event) {
      // 如果传递了函数，那么使用用户自定义的函数
      if (typeof this.headerColumnWidthChange === 'function') {
        this.headerColumnWidthChange(newWidth, oldWidth, column, event);
      } else {
        // 否则使用默认的实现
        let columnKey = column.columnKey;
        if (columnKey) {
          let index = this.columns.findIndex(item => item.prop === columnKey);
          this.columns[index].width = String(newWidth);
          // 表格列宽度发生变化，触发变更
          this.defaultColumnsChange(this.columns);
        } else {
          console.error('请设置column-key属性,并保持唯一');
        }
      }
    }

  }

};
</script>
