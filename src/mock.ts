import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import { nodeRequest } from './utils';
import { router as apiRoutes } from './api';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

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

app.listen(3008);
