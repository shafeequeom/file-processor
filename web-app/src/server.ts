// server.ts
import { parse } from 'node:url';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import next from 'next';
import { WebSocket, WebSocketServer } from 'ws';
import { sub } from './lib/redis';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const clients = new Set<WebSocket>();

interface AliveWebSocket extends WebSocket {
    isAlive: boolean;
}

nextApp.prepare().then(() => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
        handle(req, res, parse(req.url || '', true));
    });

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: AliveWebSocket) => {
        clients.add(ws);
        console.log('✅ WebSocket client connected');

        ws.send(JSON.stringify({ message: 'Hello from /api/live-stats' }));

        // Setup ping-pong keep-alive
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', (msg) => {
            console.log('📨 Message from client:', msg.toString());
        });

        ws.on('close', () => {
            clients.delete(ws);
            console.log('❌ WebSocket client disconnected');
        });
    });

    // Heartbeat interval to detect dead connections
    const interval = setInterval(() => {
        clients.forEach((ws: any) => {
            if (ws.isAlive === false) {
                console.log('💀 Terminating dead socket');
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

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

    // Subscribe to Redis events and broadcast to clients
    sub.subscribe('job-events', (err, count) => {
        if (err) {
            console.error('❌ Failed to subscribe to Redis channel:', err);
        } else {
            console.log(`📡 Subscribed to ${count} Redis channel(s): job-events`);
        }
    });

    sub.on('message', (channel, message) => {
        console.log(`📨 Redis [${channel}] →`, message);
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    server.listen(3000, () => {
        console.log('🚀 Server listening on http://localhost:3000');
    });
});
