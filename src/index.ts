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
        fs.stat(fullPath, (err, stats) => {
            if (stats && stats.isDirectory()) {
                // 不支持访问一个目录
                return sendResposeText(response, '无权限访问目录', 403)
            } else if (err) {
                if (err.code === 'ENOENT') {
                    return sendResposeText(response, '文件资源不存在', 404)
                } else {
                    return sendResposeText(response, '服务器错误', 500)
                }
            } else {
                if (typeof this.header === 'object') {
                    for (const key in this.header) {
                        if (this.header.hasOwnProperty(key)) {
                            response.setHeader(key, this.header[key] || '')
                        }
                    }
                }
                const stream = fs.createReadStream(fullPath)
                stream.pipe(response)
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