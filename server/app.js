/**
 * Created by liw on 2017/7/17.
 */
var express = require('express')
var path = require('path')
var oss = require('ali-oss')
var http = require('http')

var app = express()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})


var store = oss({
  accessKeyId: 'LTAIbcHyWY2h3twE',
  accessKeySecret: '7kzrubAdAWE4NClSyLGzMsjSvxVlNw',
  bucket: 'leevscript',
  region: 'oss-cn-hangzhou'
})

app.use('/', express.static(path.join(__dirname)))


app.listen(1994, () => {
  console.log("server is runing");
})
