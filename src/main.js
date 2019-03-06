import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VConsole from 'vconsole'
import {Base64} from 'js-base64'
import myHttp from './utils/douHttp';  //axios请求封装
import util from './utils/util';       //工具类
import components from './components/common/components';
import {format, getUrlPara} from '@/config/utils'
import 'lib-flexible/flexible.js'  //让网页根据设备dpr和宽度，利用viewport和html根元素的font-size配合rem来适配不同尺寸的移动端设备
import './style/index.less'           //主样式
import './style/common.less'         //全局公共样式
import 'vant/lib/index.css'
import {
  Cell,
  CellGroup,
  Toast,
  Actionsheet,
  Dialog,
  Field,
  Button,
  PasswordInput,
  NumberKeyboard,
  Loading,
  Icon,
  AddressEdit,
  Area,
  Popup,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Picker,
  NoticeBar,
  Uploader,
  SwipeCell ,
  DatetimePicker,
} from 'vant';
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Toast)
Vue.use(Actionsheet)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(Button)
Vue.use(PasswordInput)
Vue.use(NumberKeyboard)
Vue.use(Loading)
Vue.use(Icon)
Vue.use(AddressEdit)
Vue.use(Area)
Vue.use(Popup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Picker)
Vue.use(NoticeBar)
Vue.use(Uploader)
Vue.use(SwipeCell)
Vue.use(DatetimePicker)
Vue.use(components);      //注册自定义全局组件
Vue.config.productionTip = false;
Vue.prototype.$myHttp = myHttp;
Vue.prototype.$util = util;
Vue.prototype.$base64 = Base64
Vue.prototype.$format = format
Vue.prototype.$getUrlPara = getUrlPara


if (window.location.host !== 'jnh5.zjlinxi.com') {
  let vConsole = new VConsole()
  Vue.use({
    vConsole
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
