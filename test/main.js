import Vue from 'vue'
import Utils from '../src/components/Utils.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Utils),
}).$mount('#app')
