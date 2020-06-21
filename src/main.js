import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {Table,Checkbox,Button,ConfigProvider,TreeSelect   } from 'ant-design-vue/es';
import 'ant-design-vue/lib/table/style/css';

Vue.component(Table.name,Table)
Vue.component(Checkbox.name,Checkbox)
Vue.component(Button.name,Button)
Vue.component(ConfigProvider.name,ConfigProvider)
Vue.component(TreeSelect.name,TreeSelect)
// Vue.component(Radio.name,Radio)
 


Vue.use(Table,Checkbox,Button,ConfigProvider,TreeSelect);
import fantCommon from '@/components/fant-common'
Vue.use(fantCommon);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
