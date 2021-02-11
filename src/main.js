import Vue from 'vue'
import App from './App.vue'

// import KvalifikaVue from './test'

Vue.config.productionTip = false

new Vue({
  render: h => h(App, { 
    props: {
      appId: '4a94a7af-a2bb-4859-8273-923442973a8c'
    }
  }),
}).$mount('#app')
