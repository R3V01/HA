import App from './App'
import io from './components/socket/weapp.socket.io.js'

Vue.prototype.serverUrl = 'http://192.168.8.76:3000';
Vue.prototype.socket = io('http://192.168.8.76:8082');


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif