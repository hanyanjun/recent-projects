import toast from './toast.vue'
 
var $vm
export default {
  install (Vue, options) {
    if (!$vm) {
      const TOASTPlugin = Vue.extend(toast)
      $vm = new TOASTPlugin().$mount()
      document.body.appendChild($vm.$el)
    }
    Vue.prototype.$showToast = function ({message,icon}) {
      $vm.showToast({message,icon})
    }
  }
}
