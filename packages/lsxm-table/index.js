import LsxmTable from './src/lsxm-table';

/* istanbul ignore next */
LsxmTable.install = function(Vue) {
  Vue.component(LsxmTable.name, LsxmTable);
};

export default LsxmTable;
