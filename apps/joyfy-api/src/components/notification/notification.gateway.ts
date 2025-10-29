import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'ws';
import { IncomingMessage } from 'http';

@WebSocketGateway({
	cors: { origin: '*' },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private clients = new Map<string, any>();

	handleConnection(client: any, req: IncomingMessage) {
		const userId = this.getUserIdFromReq(req);

		if (userId) {
			// user sifatida qo‘shish
			this.clients.set(userId, client);
		} else {
			// token/userId bo‘lmasa ham guest sifatida qo‘yish
			const guestId = `guest_${Date.now()}`;
			this.clients.set(guestId, client);
		}
	}

	handleDisconnect(client: any) {
		for (const [uid, ws] of this.clients.entries()) {
			if (ws === client) {
				this.clients.delete(uid);
				break;
			}
		}
	}

	sendNotification(receiverId: string, payload: any) {
		const ws = this.clients.get(receiverId);
		if (ws && ws.readyState === ws.OPEN) {
			ws.send(JSON.stringify(payload));
		}
	}

	private getUserIdFromReq(req: IncomingMessage): string | null {
		try {
			const url = new URL(req.url ?? '', 'http://localhost');
			return url.searchParams.get('userId');
		} catch {
			return null;
		}
	}
}
