<template>
  <div id="app">
    <my-menu></my-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import MyMenu from '@/components/Menu'
  export default {
    name: 'app',
    components: {
      MyMenu
    },
    data() {
      return {}
    },

  }
</script>

<style>
  @import "reset.css"; /*引入重置样式文件*/
</style>
