#!/usr/bin/env node
import { IncomingMessage, ServerResponse } from 'http'
import staticNodeServer from './index'
import * as p from 'path'
import * as http from 'http'
import program from 'commander'
const pkg = require('./../package.json')

program
  .version(pkg.version, '-v --vers', 'output the current version')
program
  .option('-f, --file-dir <fileDir>', 'specify file directory')
  .option('-p, --port <port>', 'specify the port, default is 8080')
  .option('-H, --header <header>', 'specify additional headers')

program.parse(process.argv);

let { fileDir = '', port = '8080', header = null } = program

try {
  header = header && JSON.parse(header)
} catch (err) {
  throw new Error('-H 参数格式错误')
}

const server = http.createServer();
const fileServer = new staticNodeServer(fileDir, header)

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  fileServer.serve(request, response)
});

server.listen(port, () => {
  console.log(`serving "${p.resolve('.', fileDir)}" at http://127.0.0.1:${port}`)
});
