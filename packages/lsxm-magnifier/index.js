import LsxmMagnifier from './src/lsxm-magnifier';

/* istanbul ignore next */
LsxmMagnifier.install = function(Vue) {
  Vue.component(LsxmMagnifier.name, LsxmMagnifier);
};

export default LsxmMagnifier;
