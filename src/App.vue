<template>
  <div id="app">
    <my-menu></my-menu>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
