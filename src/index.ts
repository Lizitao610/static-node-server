import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const dir = p.resolve(__dirname, '../public')

class staticNodeServer {
    fileDir: string
    constructor(fileDir: string) {
        this.fileDir = fileDir;
    }
    serve(request: IncomingMessage, response: ServerResponse) {
        if (request.method !== 'GET') {
            response.setHeader("Content-Type", "text/html;charset=UTF-8");
            return response.end('只支持get请求');
        }
        let { pathname } = url.parse(<string>request.url)
        if (pathname === '/') {
            pathname = '/index.html'
        }
        pathname = pathname || ''
        const fullPath = p.resolve('.', this.fileDir || '', pathname.slice(1))
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                if (err.errno === -4058) {
                    fs.readFile(p.resolve(dir, 'error/404.html'), (err, data) => {
                        response.statusCode = 404
                        response.end(data);
                    });

                } else if (err.errno === -4068) {
                    response.setHeader("Content-Type", "text/html;charset=UTF-8");
                    response.statusCode = 403
                    response.end('无权限访问目录');
                } else {
                    response.setHeader("Content-Type", "text/html;charset=UTF-8");
                    response.statusCode = 500
                    response.end('服务器错误');
                }
            } else {
                response.setHeader('Cache-Control', 'max-age=2592000, public')
                response.end(data);
            }
        });
    }
}

export default staticNodeServer