## DraggableTable 拖动表格

在el-table的基础上扩展的列拖动排序、自定义列的功能，拖动功能基于Sortable实现，当前文档只描述拖动表格的用法和配置，如需原生表格的用法，请参考原生文档。

### 拖动表格

表格列可以拖动的用法展示。

:::demo 当`draggable-table`元素中注入`data`对象数组后，在`el-table-column`中用`prop`属性来对应对象中的键名即可填入数据，用`label`属性来定义表格的列名。可以使用`width`属性来定义列宽。通过`draggable`属性开启拖动功能，使用`columns`传入当前动态列，通过`all-columns`配置所有动态列。
```html
  <template>
    <draggable-table
      :data="tableData"
      style="width: 100%;margin-top: 20px"
      border 
      draggable
      :columns="myArray" 
      :allColumns="allColumns">
      <el-table-column v-for="item in myArray" :key="item.id" :prop="item.prop" 
                       :label="item.label" :width="item.width">
      </el-table-column>
    </draggable-table>
  </template>

  <script>
    export default {
      data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '家'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
                tag: '家'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                tag: '家'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
                tag: '家'
            }],
            myArray: [{
                id: 1,
                label: '日期',
                prop: 'date',
                width: '100',
            }, {
                id: 2,
                label: '名称',
                prop: 'name',
                width: '100',
            }, {
                id: 3,
                label: '地址',
                prop: 'address',
                width: '300',
            }],
            allColumns: [{
                id: 1,
                label: '日期',
                prop: 'date',
                width: '100',
            }, {
                id: 2,
                label: '名称',
                prop: 'name',
                width: '100',
            }, {
                id: 3,
                label: '地址',
                prop: 'address',
                width: '300',
            }, {
                id: 4,
                label: '标签',
                prop: 'tag',
                width: '100',
            }]
        }
      }
    }
  </script>
```
:::

### Table Attributes
| 参数      | 说明     | 类型      | 可选值        | 默认值 |
|---------- |--------|---------|------------|--|
| draggable | 是否启用拖动 | boolean | true/false | false |
| table-ref | 真实表格的ref | string | -- | draggableTable |
| setting-btn | 设置按钮是否显示，不开启拖动模式无法显示 | boolean | true/false | true |
| setting-position | 设置按钮位置 | string | left-top/right-top | left-top |
| filter-draggable-selector | 过滤不能拖动的列 | string | 类选择器 | .el-table-column--selection,.el-table-column--index,.el-table__expand-column |
| columns | 用于显示的动态表格列 | array | -- | -- |
| all-columns | 可选的所有表格列，也就是设置按钮中可选的列 | array | -- | -- |
| popover-height | 设置按钮弹出层高度 | string | -- | 30vh |

### Table Events
| 事件名                   | 说明 | 参数 |
|-----------------------|--| ---- |
| handle-columns-change | 表格列发生变化和列宽发生变化时都会触发 | columns |
| header-column-width-change | 表格列宽发生变化时触发（基于原生的header-dragend实现） | newWidth, oldWidth, column, event |