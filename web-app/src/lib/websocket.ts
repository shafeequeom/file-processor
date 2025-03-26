// lib/wsManager.ts
import { WebSocketServer } from 'ws';
import { Server } from 'http';

class WSManager {
    private static instance: WSManager;
    private wss: WebSocketServer | null = null;
    private server: Server | null = null;
    private clients = new Set<WebSocket>();
    private pingInterval: NodeJS.Timeout | null = null;

    private constructor() { }

    public static getInstance(): WSManager {
        if (!WSManager.instance) {
            WSManager.instance = new WSManager();
        }
        return WSManager.instance;
    }

    public init(server: Server) {
        if (this.wss) return;

        this.server = server;
        this.wss = new WebSocketServer({ noServer: true });

        // Remove any existing upgrade listeners
        this.server.removeAllListeners('upgrade');

        // Setup ping-pong mechanism
        this.pingInterval = setInterval(() => {
            this.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.ping();
                }
            });
        }, 30000);

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            console.log('WebSocket client connected');


            ws.on('pong', () => {
                // Client is still alive
            });

            ws.on('close', () => {
                this.clients.delete(ws);
            });

            ws.on('error', (err) => {
                console.error('WebSocket error:', err);
                this.clients.delete(ws);
            });
        });

        this.server.on('upgrade', (req, socket, head) => {
            if (req.url === '/api/live-stats') {
                this.wss?.handleUpgrade(req, socket, head, (ws) => {
                    this.wss?.emit('connection', ws, req);
                });
            } else {
                socket.destroy();
            }
        });
    }

    public broadcast(data: any) {
        const message = JSON.stringify(data);
        this.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    }

    public cleanup() {
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.clients.forEach((client) => client.close());
        this.clients.clear();
        this.wss?.close();
        this.wss = null;
    }
}

export const wsManager = WSManager.getInstance();