import { createServer, Server } from 'http';
import { EventEmitter, on } from 'events';

import { server as WebSocketServer, IMessage } from 'websocket';

export function createLocalServer(): Server {

  return createServer(function (request, response) {

    console.info((new Date()) + ' Received request for ' + request.url);

    response.writeHead(404);
    response.end();

  });

}

export function startServer(server: Server, port: number): Promise<void> {


  return new Promise((resolve, reject) => {

    server.listen(port, function () {

      console.info(`${new Date()} Server is listening on port ${port}`);

      resolve();

    });

    server.on('error', reject);

  });

}

export async function createAndStartServer(port: number): Promise<Server> {

  const server = createLocalServer();

  await startServer(server, port);

  return server;

}

export async function startWebSocketServer(port: number): Promise<WebSocketServer> {

  const server = await createAndStartServer(port);

  const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });

  return wsServer;

}

function originIsAllowed(origin: string): boolean {

  if (origin) {
    // put logic here to detect whether the specified origin is allowed.
  }

  return true;

}

export function attachRequestHandler(wsServer: WebSocketServer, messageBus: WebSocketMessage, connectionData: string): void {

  wsServer.on('request', (request) => {

    if (!originIsAllowed(request.origin)) {

      console.error((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');

      // Make sure we only accept requests from an allowed origin
      request.reject();

      return;

    }

    // const connection = request.accept('echo-protocol', request.origin);
    const connection = request.accept(null, request.origin);

    connection.on('message', (message) => {

      if (message.type === 'utf8') {

        console.log('Received Message: ' + message.utf8Data);

        messageBus.emit('message', message);
        // connection.sendUTF(message.utf8Data);

      } else if (message.type === 'binary') {

        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');

        messageBus.emit('message', message);
        // connection.sendBytes(message.binaryData);

      }

    });

    connection.on('close', (reasonCode, description) => {

      console.info((new Date()) + ' Peer ' + connection.remoteAddress + ` disconnected. ${reasonCode}: ${description}`);

      messageBus.removeAllListeners('message');

    });

    connection.on('error', (error) => {

      console.info((new Date()) + ` Connection error. ${error}`);

      messageBus.removeAllListeners('message');

    });

  });

  wsServer.on('connect', (connection) => {

    console.info(`${new Date()} Connection accepted.`);

    connection.send(connectionData);

  });

}

export class WebSocketMessage extends EventEmitter {

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // public on(event: 'message', listener: (...args: any[]) => void): this {

  //   if (event !== 'message') {
  //     // noop
  //   }

  //   return super.on(event, listener);

  // }

  get message(): AsyncIterableIterator<IMessage[]> {

    return on(this, 'message');

  }

  async *[ Symbol.asyncIterator ](): AsyncGenerator<IMessage, IMessage, IMessage> {

    while (true) {

      yield await new Promise((resolve) => {

        this.on('message', resolve);

      });

    }

  }

}
