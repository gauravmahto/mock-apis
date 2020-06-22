import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import { nodeRequest, attachRequestHandler, WebSocketMessage, startWebSocketServer } from './utils';
import { router as apiRoutes } from './api';
import mockResponse from './mock-response.json';

const app = new Koa();
const router = new Router();

const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Accept,Content-Type',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*'
};

app.use(bodyParser());
app.use(async (ctx, next) => {
  ctx.set(CORS_HEADERS);
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;

    return;
  }

  await next();
});

app.use(async (ctx, next) => {

  const completeRequestBody = ctx.request.body;

  if (typeof completeRequestBody !== 'undefined') {

    const {
      'x-api': api,
      'x-method': method,
      'x-data': requestBody
    } = completeRequestBody;

    ctx.request.xInfo = {
      api,
      method
    };
    ctx.request.body = requestBody;

  }

  await next();

});

router.post('/x-req', async (ctx) => {

  let response = {
    body: ''
  };

  response = await nodeRequest(ctx.request.xInfo.api, ctx.request.xInfo.method, ctx.request.body);

  ctx.body = response.body;

});

app
  .use(router.routes())
  .use(apiRoutes.routes())
  .use(router.allowedMethods());

(async () => {

  app.listen(3008);

  const messageBus = new WebSocketMessage();
  const wsServer = await startWebSocketServer(3009);

  const { 'connection-accepted': connectionData } = mockResponse;

  attachRequestHandler(wsServer, messageBus, JSON.stringify([0, 0, connectionData]));

  for await (const message of messageBus) {

    console.info(message.utf8Data);

  }

})();
