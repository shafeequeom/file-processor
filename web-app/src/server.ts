// server.ts (custom server with /api/live-stats WebSocket)
import { parse } from 'node:url';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import next from 'next';
import { WebSocket, WebSocketServer } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const clients = new Set<WebSocket>();

nextApp.prepare().then(() => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
        handle(req, res, parse(req.url || '', true));
    });

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: WebSocket) => {
        clients.add(ws);
        console.log('✅ WebSocket client connected');

        ws.send(JSON.stringify({ message: 'Hello from /api/live-stats' }));

        ws.on('message', (msg) => {
            console.log('📨 Message from client:', msg.toString());
        });

        ws.on('close', () => {
            clients.delete(ws);
            console.log('❌ WebSocket client disconnected');
        });
    });

    server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
        const { pathname } = parse(req.url || '', true);
        console.log('💬 Upgrade request:', pathname);


        if (pathname === '/api/live-stats') {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        } else if (pathname === '/_next/webpack-hmr') {
            nextApp.getUpgradeHandler()(req, socket, head);
        } else {
            console.warn('❌ Unknown upgrade path:', pathname);
            socket.destroy();
        }
    });

    server.listen(3000, () => {
        console.log('🚀 Server listening on http://localhost:3000');
    });
});
