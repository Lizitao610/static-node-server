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

program.parse(process.argv);

const fileDir = program.fileDir || ''
const port = program.port || '8080'

const server = http.createServer();
const fileServer = new staticNodeServer(fileDir)

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  fileServer.serve(request, response)
});

server.listen(port, () => {
  console.log(`serving "${p.resolve('.', fileDir)}" at http://127.0.0.1:${port}`)
});
