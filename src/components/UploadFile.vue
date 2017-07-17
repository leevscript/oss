<template>
  <div class="upload">
    <div class="operation">
      <div>
        <el-button type="info" @click="onStart(multipleSelection)">开始</el-button>
        <el-button type="warning" @click="onPause(multipleSelection)">暂停</el-button>
        <el-button type="danger" @click="onDelete(multipleSelection)">删除</el-button>
      </div>
      <div>
        <el-button type="success" @click="onDelete">新建任务</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData3"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template scope="scope">
          <span :class="{0:'color-success',1:'color-danger'}[scope.row.state]">{{ scope.row.state | stateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进度">
        <template scope="scope">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.percentage"
                       :status="{1:'exception'}[scope.row.state]"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template scope="scope">
          <el-button
            @click.native.prevent="onPause([scope.row])"
            type="text"
            size="small">
            暂停
          </el-button>
          <el-button
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

  export default {
    data() {
      return {
        tableData3: [{
          name: '测试1',
          state: 1,
          percentage: 33
        }, {
          name: '测试2',
          state: 1,
          percentage: 24
        }, {
          name: '测试3',
          state: 1,
          percentage: 44
        }, {
          name: '测试4',
          state: 1,
          percentage: 65
        }],
        multipleSelection: []
      }
    },
    filters: {
      stateFilter(val) {
        if (val === 0) return '正在上传'
        else if (val === 1) return '暂停'
      }
    },
    methods: {
      selectionChange(val) {
        this.multipleSelection = val
      },
      onStart(arr) {
        arr.forEach((v) => {
          if (v.state === 0) return
          v.state = 0
        })
      },
      onPause(arr) {
        console.log(arr)
        arr.forEach((v) => {
          if (v.state === 1) return
          v.state = 1
        })
      },
      onDelete(arr) {
        arr.forEach((v) => {
          if (v.state === 3) return
          v.state = 3
        })
      }
    }
  }
</script>

<style lang="less">
  .upload {
    padding: 10px;
    .operation {
      margin: 20px;
      display: flex;
      justify-content: space-between;
    }
    .color-success {
      color: #20a0ff
    }

    .color-danger {
      color: #FF4949
    }
  }

</style>
