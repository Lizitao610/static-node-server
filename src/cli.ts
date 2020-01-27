#!/usr/bin/env node
import { IncomingMessage, ServerResponse } from 'http'
import staticNodeServer from './index'
import * as http from 'http'
import program from 'commander'
const pkg = require('./../package.json')

program
  .version(pkg.version, '-v --vers', 'output the current version')
program
  .option('-f, --file-dir <fileDir>')

program.parse(process.argv);

let fileDir = ''
if (program.fileDir) {
  fileDir = program.fileDir
}

const server = http.createServer();
const fileServer = new staticNodeServer(fileDir)
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  fileServer.serve(request, response)
});

server.listen(8888, () => {
  console.log('serving "." at http://127.0.0.1:8888')
});
