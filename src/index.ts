import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const dir = p.resolve(__dirname, '../public')

class staticNodeServer {
    fileDir: string
    header: IncomingHttpHeaders
    constructor(fileDir: string, header: IncomingHttpHeaders) {
        this.fileDir = fileDir;
        this.header = header || {};
    }
    serve(request: IncomingMessage, response: ServerResponse) {
        if (request.method !== 'GET') {
            return sendResposeText(response, '只支持get请求', 405)
        }
        let { pathname } = url.parse(<string>request.url)
        pathname = decodeURIComponent(pathname || '')
        if (pathname === '/') {
            pathname = '/index.html'
        }
        pathname = pathname || ''
        const fullPath = p.resolve('.', this.fileDir, pathname.slice(1))
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                if (err.errno === -4058) {
                    sendResposeText(response, '文件资源不存在', 404)
                } else if (err.errno === -4068) {
                    sendResposeText(response, '无权限访问目录', 403)
                } else {
                    sendResposeText(response, '服务器错误', 500)
                }
            } else {
                // response.setHeader('Cache-Control', 'max-age=2592000,public')
                if (typeof this.header === 'object') {
                    for (const key in this.header) {
                        if (this.header.hasOwnProperty(key)) {
                            response.setHeader(key, this.header[key] || '')
                        }
                    }
                }
                response.end(data);
            }
        });
    }
}

function sendResposeText(response: ServerResponse, text: string, statusCode: number) {
    response.setHeader("Content-Type", "text/html;charset=UTF-8");
    response.statusCode = statusCode
    response.end(text);
}
export default staticNodeServer