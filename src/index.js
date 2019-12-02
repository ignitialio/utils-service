import Utils from './components/Utils.vue'

// function to be called when service loaded into web app:
// naming rule: iios_<service_unique_name>
//
global.iios_utils = function(Vue) {
  // Warning: component name must be globally unique in your host app
  Vue.component('utils', Utils)

  let register = () => {
    // EXEAMPLE
    Vue.prototype.$services.emit('app:menu:add', [
      {
        path: '/service-utils',
        title: 'Utilities',
        svgIcon: '$$service(utils)/assets/utils.svg',
        section: 'Services',
        anonymousAccess: true,
        hideIfLogged: false,
        route: {
          name: 'Utils',
          path: '/service-utils',
          component: Utils
        }
      }
    ])

    let onServiceDestroy = () => {
      Vue.prototype.$services.emit('app:menu:remove', [{
        path: '/service-utils'
      }])

      Vue.prototype.$services.emit('service:destroy:utils:done')
    }

    Vue.prototype.$services.once('service:destroy:utils', onServiceDestroy)
  }

  if (Vue.prototype.$services.appReady) {
    register()
  } else {
    Vue.prototype.$services.once('app:ready', register)
  }
}
