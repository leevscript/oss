import Vue from 'vue'
import Router from 'vue-router'
import DownloadFile from '@/components/DownloadFile'
import UploadFile from '@/components/UploadFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'UploadFile' }
    },
    {
      path: '/download',
      name: 'DownloadFile',
      component: DownloadFile
    },
    {
      path: '/upload',
      name: 'UploadFile',
      component: UploadFile
    }
  ]
})
