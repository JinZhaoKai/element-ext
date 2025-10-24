## LsxmMagnifierPage 放大镜页面
以下展示了放大镜页面的标准属性，按照以下属性实现可以开发一个放大镜页面，结合放大镜组件/放大镜对话框即可快速提供服务。

:::tip
LsxmMagnifierPage 从定义上是一个提供多样检索和详细数据展示的页面，主要的功能就是展示数据供用户选择。
:::

:::tip
实际开发前需要把我们的角色转换一下，文档中其他组件内容都是演示如何使用一个组件，而当前这份文档想表达的是如何开发一个组件，角色完全不同前者是使用者后者则是开发者。
:::

:::tip
以下描述的属性和方法，是调用方传递给我们的，我们要做的是在组件中接收这些参数，然后实现应有的功能。
<br/>举例：用户在使用时将multiple设置为true，意味着他希望开启多选功能，那页面中的选择功能就需要是多选的，并且在调用lsxm-confirm返回时也应该是一个数组。
:::

### Lsxm Magnifier Page Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| search-param-prop | 动态搜索参数配置，可以基于此参数动态生成页面，也可以忽悠此参数自行绘制 | string | — | [] |
| table-column-prop | 动态列表参数配置，可以基于此参数动态生成页面，也可以忽悠此参数自行绘制 | string | — | [] |
| multiple | 是否多选，由外部决定是否开启多选，内部根据状态实现即可 | boolean | — | false |
| table-height | 放大镜对话框 Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式 | string/number | — | — |
| enable-page | 是否开启分页，开启后传递到接口的参数会携带start和limit分页参数 | boolean | — | true |
| table-remote-method | 放大镜对话框 Table 的远程搜索方法，第一个参数是查询参数；第二个参数是回调函数，用来回传接口查询到的数据。cb回调函数参数列表Function(list, total) | function | — | Function(searchParams, cb) |
| lsxm-confirm | 用于返回选中值 | function | — | — |
