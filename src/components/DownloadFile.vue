<template>
  <div class="download">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="文件名"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="大小"
        width="100">
        <template scope="scope">
          <span>{{ scope.row.size | sizeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        width="200">
        <template scope="scope">
          <span>{{ scope.row.lastModified | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template scope="scope">
          <el-button @click="downloadFile(scope.row)" type="text" size="small">下载</el-button>
          <el-button @click="deleteFile(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
  import client from '../config/oss'

  function noop() {
  }

  export default {
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      downloadFile(row) {
        var result = client.signatureUrl(row.name, {
          expires: 3600,
          response: {
            'content-disposition': 'attachment; filename="' + row.name + '"'
          }
        })
        window.location = result
      },
      deleteFile(scope) {
        this.openConfirm(() => {
          client.delete(scope.row.name).then(() => {
            this.tableData.splice(scope.$index, 1)
          })
        })
      },
      openConfirm(success = noop, error = noop) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          success()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          error()
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
    },
    filters: {
      sizeFilter(val) {
        switch (true) {
          case val < 1024:
            return parseInt(val) + 'B'
            break
          case val < 1024 * 1024:
            return parseInt(10 * val / 1024) / 10 + 'K'
            break
          case val < 1024 * 1024 * 1024:
            return parseInt(10 * val / (1024 * 1024)) / 10 + 'M'
            break
          case val:
            return parseInt(10 * val / (1024 * 1024 * 1024)) / 10 + 'G'
            break
        }
      },
      timeFilter(val) {
        return (new Date(val)).toLocaleString()
      }
    },
    beforeRouteEnter(to, from, next){
      next((vm) => {
        client.list().then((res) => {
          vm.tableData = res.objects
        })
      })

    }
  }
</script>

<style lang="less">
  .download {
    padding: 10px;
  }
</style>
