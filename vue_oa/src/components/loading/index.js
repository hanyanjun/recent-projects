import loading from './loading.vue'
 
var $vm
export default {
  install (Vue, options) {
    if (!$vm) {
      const LOADINGlugin = Vue.extend(loading)
      $vm = new LOADINGlugin().$mount()
      document.body.appendChild($vm.$el)
    }
    Vue.prototype.$showLoading = function () {
        $vm.showLoading()
    }
    Vue.prototype.$closeLoading = function () {
      $vm.closeLoading()
    }
  }
}
