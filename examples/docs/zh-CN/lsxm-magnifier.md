## LsxmMagnifier 放大镜

在el-select的基础上扩展的弹出对话框查询功能。

### 基础用法

展示放大镜，默认情况下放大镜就是一个支持远程搜索的select，点击输入框右侧放大镜图标将弹出支持更多查询条件和展示更多内容的对话框。

:::demo `v-model`的值为当前被选中行键名为`lsxm-value-key`的值，此处取id作为`v-model`的值。`label-key`设置了选择后输入框中显示的内容。`table-column-prop`支持动态配置下拉框和表格中显示的列。`search-param-prop`支持动态配置表格的搜索参数。`remote-method`和`table-remote-method`分别是下拉框和表格的远程查询方法。
```html
<template>
    <el-lsxm-magnifier v-model="value" lsxm-value-key="id" label-key="name"
                       :search-param-prop="magnifierOptions.searchParamProp"
                       :table-column-prop="magnifierOptions.tableColumnProp" :select-loading="magnifierOptions.loading"
                       table-height="400px" placeholder="请输入" :remote-method="handleQuerySearchAsync"
                       :table-remote-method="handleQueryTableSearchAsync"></el-lsxm-magnifier>
</template>
<script>export default {
    data() {return {
        value: 'Alabama',
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
    }
    },
    mounted() {
        this.list = this.states.map(item => {
            return { id: item, code: `code:${item}`, name: `name:${item}` };
        });
    },
    methods: {
        handleQuerySearchAsync(val, cb) {
            this.handleQueryTableSearchAsync({
                start: 0,
                limit: 20,
                name: val
            }, cb)
        },
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
        }
    }
}
</script>
```
:::

:::tip
如果 Select 的绑定值为对象类型，请务必指定 `value-key` 作为它的唯一性标识。
:::

:::warning
注意，当前版本如果放大镜开启了多选，是不支持绑定对象类型的，将在后续版本中支持。
:::

### 基础多选

适用性较广的基础多选，用 Tag 展示已选项。

:::demo 为`el-lsxm-magnifier`设置`multiple`属性即可启用多选，此时`v-model`的值为当前选中值所组成的数组。默认情况下选中值会以 Tag 的形式展现，你也可以设置`collapse-tags`属性将它们合并为一段文字。
```html
<template>
    <el-lsxm-magnifier v-model="value" lsxm-value-key="id" label-key="name" multiple
                       :search-param-prop="magnifierOptions.searchParamProp"
                       :table-column-prop="magnifierOptions.tableColumnProp" :enable-page="true"
                       :select-loading="magnifierOptions.loading" table-height="400px" placeholder="请输入"
                       :remote-method="handleQuerySearchAsync" :table-remote-method="handleQueryTableSearchAsync"></el-lsxm-magnifier>
    <el-lsxm-magnifier v-model="value" lsxm-value-key="id" label-key="name" multiple collapse-tags
                       :search-param-prop="magnifierOptions.searchParamProp"
                       :table-column-prop="magnifierOptions.tableColumnProp" :enable-page="true"
                       :select-loading="magnifierOptions.loading" table-height="400px" placeholder="请输入"
                       :remote-method="handleQuerySearchAsync" :table-remote-method="handleQueryTableSearchAsync"></el-lsxm-magnifier>
</template>
<script>export default {
    data() {return {
        value: ['Alabama'],
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
    }
    },
    mounted() {
        this.list = this.states.map(item => {
            return { id: item, code: `code:${item}`, name: `name:${item}` };
        });
    },
    methods: {
        handleQuerySearchAsync(val, cb) {
            this.handleQueryTableSearchAsync({
                start: 0,
                limit: 20,
                name: val
            }, cb)
        },
        handleQueryTableSearchAsync(searchParams, cb) {
            if (searchParams.name && searchParams.name !== '') {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    cb(this.list.slice(searchParams.start, searchParams.limit + searchParams.start), this.states.length)
                }, 1000);
            } else {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    cb(this.list.slice(searchParams.start, searchParams.limit + searchParams.start), this.states.length)
                }, 1000);
            }
        },
    }
}
</script>
```
:::

### 事件用法

展示放大镜在单选和多选模式的事件用法。

:::demo 
```html
<template>
    <div class="block">
        <span class="demonstration">单选模式</span>
        <el-lsxm-magnifier v-model="value" lsxm-value-key="id" label-key="name"
                           :search-param-prop="magnifierOptions.searchParamProp"
                           :table-column-prop="magnifierOptions.tableColumnProp" :enable-page="true"
                           :select-loading="magnifierOptions.loading" table-height="400px" placeholder="请输入"
                           :remote-method="handleQuerySearchAsync" :table-remote-method="handleQueryTableSearchAsync"
                           @change="handleChange" @visible-change="handleVisibleChange"
                           @blur="handleBlur" @focus="handleFocus"></el-lsxm-magnifier>
    </div>
    <div class="block">
        <span class="demonstration">多选模式</span>
        <el-lsxm-magnifier v-model="valueList" lsxm-value-key="id" label-key="name" multiple
                           :search-param-prop="magnifierOptions.searchParamProp"
                           :table-column-prop="magnifierOptions.tableColumnProp" :enable-page="true"
                           :select-loading="magnifierOptions.loading" table-height="400px" placeholder="请输入"
                           :remote-method="handleQuerySearchAsync" :table-remote-method="handleQueryTableSearchAsync"
                           @change="handleChange" @visible-change="handleVisibleChange"
                           @remove-tag="handleRemoveTag"
                           @blur="handleBlur" @focus="handleFocus"></el-lsxm-magnifier>
    </div>
</template>
<script>export default {
    data() {return {
        value: 'Alabama',
        valueList: ['Alabama'],
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
    }
    },
    mounted() {
        this.list = this.states.map(item => {
            return { id: item, code: `code:${item}`, name: `name:${item}` };
        });
    },
    methods: {
        handleQuerySearchAsync(val, cb) {
            this.handleQueryTableSearchAsync({
                start: 0,
                limit: 20,
                name: val
            }, cb)
        },
        handleQueryTableSearchAsync(searchParams, cb) {
            if (searchParams.name && searchParams.name !== '') {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    cb(this.list.slice(searchParams.start, searchParams.limit + searchParams.start), this.states.length)
                }, 1000);
            } else {
                this.magnifierOptions.loading = true;
                setTimeout(() => {
                    this.magnifierOptions.loading = false;
                    cb(this.list.slice(searchParams.start, searchParams.limit + searchParams.start), this.states.length)
                }, 1000);
            }
        },
        handleChange(val) {
            console.log("选中值发生变化时触发：", val)
        },
        handleVisibleChange(val) {
            console.log("下拉框出现/隐藏时触发：", val)
        },
        handleRemoveTag(val) {
            console.log("多选模式下移除tag时触发：", val)
        },
        handleBlur(event) {
            console.log("当 input 失去焦点时触发：", event)
        },
        handleFocus(event) {
            console.log("当 input 获得焦点时触发：", event)
        }
    }
}
</script>
```
:::

### Extends Select Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value / v-model | 绑定值 | boolean / string / number | — | — |
| multiple | 是否多选 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| value-key | 作为 value 唯一标识的键名，绑定值为对象类型时必填 | string | — | value |
| size | 输入框尺寸 | string | medium/small/mini | — |
| collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | — | false |
| multiple-limit | 多选时用户最多可以选择的项目数，为 0 则不限制 | number | — | 0 |
| name | select input 的 name 属性 | string | — | — |
| placeholder | 占位符 | string | — | 请选择 |
| remote-method | 远程搜索方法 | function | — | — |
| loading-text | 远程加载时显示的文字 | string | — | 加载中 |
| no-match-text | 搜索条件无匹配时显示的文字，也可以使用`slot="empty"`设置 | string | — | 无匹配数据 |
| no-data-text | 选项为空时显示的文字，也可以使用`slot="empty"`设置 | string | — | 无数据 |
| popper-class | Select 下拉框的类名 | string | — | — |
| popper-append-to-body | 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false | boolean | - | true |

### Lsxm Select Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| lsxm-value-key | 必填项，作为放大镜唯一标识的键名，如果放大镜返回的是对象类型，还需设置原生的value-key属性 | string | — | — |
| label-key | 必填项，选中状态的值 | string | — | value |
| dialog-title | 对话框标题 | string | — | 放大镜 |
| dialog-width | 对话框宽度 | string | — | 50% |
| search-param-prop | 必填项，放大镜对话框表格的搜索参数配置 | string | — | [] |
| table-column-prop | 必填项，放大镜对话框表格的列表参数配置 | string | — | [] |
| table-height | 放大镜对话框 Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式 | string/number | — | — |
| enable-page | 是否开启分页，开启后传递到接口的参数会携带start和limit分页参数 | boolean | — | true |
| custom-page-component | 自定义对话框组件名称 | string | — | ElLsxmMagnifierDefaultPage |
| select-loading | 是否正在从远程获取数据 | boolean | — | false |
| table-remote-method | 放大镜对话框 Table 的远程搜索方法，第一个参数是查询参数；第二个参数是回调函数，用来回传接口查询到的数据。cb回调函数参数列表Function(list, total) | function | — | Function(searchParams, cb) |

### Extends Select Events
| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------|
| change | 选中值发生变化时触发 | 目前的选中值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| remove-tag | 多选模式下移除tag时触发 | 移除的tag值 |
| blur | 当 input 失去焦点时触发 | (event: Event) |
| focus | 当 input 获得焦点时触发 | (event: Event) |
