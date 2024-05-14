import Cookies from 'js-cookie';
import io, { Socket } from 'socket.io-client';
export class WebSocket {
    public static socketClient: Socket;
    private static currentToken: string;

    public static async init(token: string) {
        if (!this.socketClient && this.currentToken !== token) {
            this.currentToken = token;
            // this.socketClient = io(environment.ws_host as string, {
            // this.socketClient = io('https://httapi.winds.vn' as string, {
            this.socketClient = io('https://api-dev.thanhtuocfarm.winds.vn' as string, {
                auth: { token: Cookies.get('session_id') },
                path: '/socket.io',
                transports: ['websocket'],
                // secure: true,
            });
            this.socketClient.on('new_message', (data) => {
                console.log(data);
            });
        }
    }
    public static async disconnect() {
        if (this.socketClient) {
            this.socketClient.disconnect();
        }
    }
}
