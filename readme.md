### 一个基于node的静态服务器工具
#### 安装
`npm i static-node-server`
#### 启动服务
`static-server`
#### 指定文件目录
`static-server -f <fileDir>`
#### 指定监听端口，默认为8080
`static-server -p <port>`
#### 自定义响应头
`static-server -H <headerConfig>`

格式示例：`static-server -H '{\"Cache-Control\": \"max-age=2592000,public\"}'`
