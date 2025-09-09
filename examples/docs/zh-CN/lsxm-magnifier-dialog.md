## LsxmMagnifierDialog 放大镜对话框
打开一个展示详细数据，支持检索和选择数据的对话框。

### 基本用法

通过参数配置即可打开一个动态渲染的页面。

:::demo 需要设置`v-model`属性，它接收`Boolean`，当为`true`时显示 Dialog。通过`search-param-prop`和`table-column-prop`属性即可动态渲染出一个简单的页面。配置`table-remote-method`函数接收页面查询参数开启远程搜索功能（接口返回的值内容通过`table-remote-method`第二个回调函数参数传递到组件中，第一个参数是查询参数）。

```html
<template>
    <el-button type="text" @click="dialogVisible = true">点击打开 Lsxm Magnifier Dialog</el-button>

    <el-lsxm-magnifier-dialog v-model="dialogVisible" :search-param-prop="magnifierOptions.searchParamProp"
                              :table-column-prop="magnifierOptions.tableColumnProp"
                              :table-remote-method="handleQueryTableSearchAsync" 
                              :lsxm-confirm="handleLsxmConfirm"></el-lsxm-magnifier-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        magnifierOptions: {
            "searchParamProp": [{
                "label": "代码",
                "value": "code"
            }, {
                "label": "名称",
                "value": "name"
            }],
            "tableColumnProp": [{
                "label": "代码",
                "value": "code"
            }, {
                "label": "名称",
                "value": "name"
            }],
            loading: false
        },
        list: [],
        states: ["Alabama", "Alaska", "Arizona",
            "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida",
            "Georgia", "Hawaii", "Idaho", "Illinois",
            "Indiana", "Iowa", "Kansas", "Kentucky",
            "Louisiana", "Maine", "Maryland",
            "Massachusetts", "Michigan", "Minnesota",
            "Mississippi", "Missouri", "Montana",
            "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York",
            "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania",
            "Rhode Island", "South Carolina",
            "South Dakota", "Tennessee", "Texas",
            "Utah", "Vermont", "Virginia",
            "Washington", "West Virginia", "Wisconsin",
            "Wyoming"]
      };
    },
    mounted() {
        this.list = this.states.map(item => {
            return { id: item, code: `code:${item}`, name: `name:${item}` };
        });
    },
    methods: {
        handleQueryTableSearchAsync(searchParams, cb) {
            if (searchParams.name && searchParams.name !== '') {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    const arr = this.list.filter(item => item.name.toLowerCase().indexOf(searchParams.name.toLowerCase()) > -1);
                    cb(arr.slice(searchParams.start, searchParams.limit + searchParams.start), arr.length)
                }, 1000);
            } else {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    cb(this.list.slice(searchParams.start, searchParams.limit + searchParams.start), this.states.length)
                }, 1000);
            }
        },
        handleLsxmConfirm(val) {
            console.log(val)
            this.dialogVisible = false
        }
    }
  };
</script>
```
:::

### 自定义页面

有时默认的动态页面无法满足需求或者希望定制页面样式，对话框组件同样支持自定义其中的页面，只需要按照`LsxmMagnifierPage 放大镜页面`的指引开发组件，然后引入并且配置到对话框组件的`custom-dialog-component`属性即可展示自定义组件效果。

:::demo 需要设置`v-model`属性，它接收`Boolean`，当为`true`时显示 Dialog。通过`search-param-prop`和`table-column-prop`属性即可动态渲染出一个简单的页面。配置`table-remote-method`函数接收页面查询参数开启远程搜索功能（接口返回的值内容通过`table-remote-method`第二个回调函数参数传递到组件中，第一个参数是查询参数）。

```html
<template>
    <el-button type="text" @click="dialogVisible = true">点击打开自定义 Lsxm Magnifier Dialog</el-button>

    <el-lsxm-magnifier-dialog v-model="dialogVisible" :custom-dialog-component="'el-empty'" :lsxm-confirm="handleLsxmConfirm"></el-lsxm-magnifier-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
        handleLsxmConfirm(val) {
            alert(val)
            this.dialogVisible = false
        }
    }
  };
</script>
```
:::

### Lsxm Magnifier Dialog Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value / v-model | 绑定值 | boolean | — | — |
| dialog-title | 对话框标题 | string | — | 放大镜 |
| dialog-width | 对话框宽度 | string | — | 50% |
| search-param-prop | 必填项，放大镜对话框表格的搜索参数配置 | string | — | [] |
| table-column-prop | 必填项，放大镜对话框表格的列表参数配置 | string | — | [] |
| table-height | 放大镜对话框 Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式 | string/number | — | — |
| enable-page | 是否开启分页，开启后传递到接口的参数会携带start和limit分页参数 | boolean | — | true |
| custom-dialog-component | 自定义组件名称 | string | — | ElLsxmMagnifierDefaultPage |
| table-remote-method | 放大镜对话框 Table 的远程搜索方法，第一个参数是查询参数；第二个参数是回调函数，用来回传接口查询到的数据。cb回调函数参数列表Function(list, total) | function | — | Function(searchParams, cb) |
| lsxm-confirm | 用于返回选中值 | function | — | — |
