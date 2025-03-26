// pages/api/live-stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';

// This will be our WebSocket server
let wss: WebSocketServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!res.socket?.server) {
        return res.status(500).json({ error: 'No server instance available' });
    }

    // Initialize WebSocket server only once
    if (!wss) {
        const server = res.socket.server;

        // Create WebSocket server
        wss = new WebSocketServer({ noServer: true });

        // Handle connections
        wss.on('connection', (ws) => {
            console.log('New WebSocket connection');

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });

        // Handle HTTP upgrade requests
        server.on('upgrade', (request, socket, head) => {
            if (request.url === '/api/live-stats') {
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });
    }

    res.status(200).json({ message: 'WebSocket endpoint is active' });
}

export const config = {
    api: {
        bodyParser: false,
    },
};