<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
      <el-menu-item index="1" :route="{name:'DownloadFile'}">下载文件</el-menu-item>
      <el-menu-item index="2" :route="{name:'UploadFile'}">上传文件</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'Menu',
    data() {
      return {
        activeIndex: '2',
      };
    },
    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
