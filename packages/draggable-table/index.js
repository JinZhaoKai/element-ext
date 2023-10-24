import DraggableTable from './src/draggable-table';

/* istanbul ignore next */
DraggableTable.install = function(Vue) {
  Vue.component(DraggableTable.name, DraggableTable);
};

export default DraggableTable;
