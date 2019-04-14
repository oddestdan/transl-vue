import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import StateTable from '@/views/StateTable.vue'
import RelTable from '@/views/RelTable.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/state',
      name: 'state-table',
      component: StateTable,
      props: true
    },
    {
      path: '/rel',
      name: 'rel-table',
      component: RelTable,
      props: true
    }
  ]
})
