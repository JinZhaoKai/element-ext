import ElLsxmMagnifier from './src/lsxm-magnifier';

/* istanbul ignore next */
ElLsxmMagnifier.install = function(Vue) {
  Vue.component(ElLsxmMagnifier.name, ElLsxmMagnifier);
};

export default ElLsxmMagnifier;
