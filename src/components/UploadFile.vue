<template>
  <div class="upload">
    <input type="file" class="file-btn" ref="upload" @change="sendFlile">
    <div class="operation">
      <div>
        <el-button icon="check" type="info" @click="onStart(multipleSelection)">开始</el-button>
        <el-button icon="close" type="warning" @click="onPause(multipleSelection)">暂停</el-button>
        <el-button icon="delete" type="danger" @click="onDelete(multipleSelection)">删除</el-button>
      </div>
      <div>
        <el-button icon="plus" type="success" @click="onCreate">新建任务</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="checkpoint.name"
        label="文件名"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template scope="scope">
          <span
            :class="{0:'color-info',1:'color-danger',2:'color-success'}[scope.row.state]">{{ scope.row.state | stateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进度">
        <template scope="scope">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.percentage"
                       :status="{1:'exception',2:'success'}[scope.row.state]"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template scope="scope">
          <el-button
            v-if="scope.row.state === 1"
            @click.native.prevent="onStart([scope.row])"
            type="text"
            size="small">
            开始
          </el-button>
          <el-button
            v-if="scope.row.state === 0"
            @click.native.prevent="onPause([scope.row])"
            type="text"
            size="small">
            暂停
          </el-button>
          <el-button
            v-if="scope.row.state === 0 || scope.row.state === 1"
            @click.native.prevent="onDelete([scope.row])"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  // 0: 正在上传 1: 暂停 2: 完成 3: 删除
  import client from '../config/oss'

  function noop() {
  }

  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: []
      }
    },
    filters: {
      stateFilter(val) {
        if (val === 0) return '正在上传'
        else if (val === 1) return '暂停'
        else if (val === 2) return '完成'
        else if (val === 3) return '已删除'
      }
    },
    watch: {
      tableData: {
        handler: function (newVal) {
          newVal.forEach((v, i) => {
            if (v.state === 2) {
              setTimeout(() => {
                newVal.splice(i, 1)
              }, 1000)
            } else if (v.state === 3) {
              newVal.splice(i, 1)
            }
          })
          window.localStorage.OSS = JSON.stringify(this.tableData)
        },
        deep: true
      }
    },
    methods: {
      selectionChange(val) {
        this.multipleSelection = val
      },
      onStart(arr) {
        arr.forEach((v) => {
          if (v.state !== 1) return
          this.multipartUpload(v)
        })
      },
      onPause(arr) {
        arr.forEach((v) => {
          if (v.state !== 0) return
          v.state = 1
        })
      },
      onDelete(arr) {
        arr.forEach((v) => {
          v.state = 1
          this.openConfirm(() => {
            client.abortMultipartUpload(v.checkpoint.name, v.checkpoint.uploadId)
              .then(() => {
                v.state = 3
              })
              .catch(() => {
                v.state = 3
              })
          })
        })
      },
      onCreate() {
        this.$refs.upload.click()
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
      sendFlile() {
        let file = this.$refs.upload.files[0]
        if (!file) return
        let data = this.tableData.find((v) => {
          return v.checkpoint.name === file.name && v.checkpoint.fileSize === file.size
        })
        if (!data) {
          data = {
            state: 0,
            percentage: 0,
            checkpoint: {
              name: file.name
            }
          }
          this.tableData.push(data)
        }
        data.checkpoint.file = file
        data.state = 0
        this.multipartUpload(data)
      },
      multipartUpload(data) {
        let file = data.checkpoint.file
        if (!file.name) {
          data.checkpoint.uploadId
          return this.$refs.upload.click()
        }
        data.state = 0
        client.multipartUpload(file.name, file, {
          checkpoint: data.checkpoint,
          progress: (per, cpt) => {
            return (done) => {
              if (data.state === 1) return
              data.percentage = parseInt(per * 100)
              data.checkpoint = cpt
              done()
            }
          }
        }).then((result) => {
          data.state = 2
        })
      },
      onConsole() {
        console.log(JSON.parse(JSON.stringify(this.tableData)))
      }
    },
    mounted() {
      let data = window.localStorage.OSS
      data = data ? JSON.parse(window.localStorage.OSS) : []
      data.forEach((v) => v.state = 1)
      this.tableData = data
    }
  }
</script>

<style lang="less">
  .upload {
    padding: 10px;
    .file-btn {
      visibility: hidden;
      position: absolute;
      left: -9999px;
    }
    .operation {
      margin: 20px;
      display: flex;
      justify-content: space-between;
    }
    .color-success {
      color: #13ce66;
    }

    .color-danger {
      color: #FF4949;
    }

    .color-info {
      color: #20a0ff;
    }
  }

</style>
