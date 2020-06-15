import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { nodeRequest } from './utils';

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx) => {

  const completeRequestBody = ctx.request.body;

  let response = {
    body: ''
  };

  if (typeof completeRequestBody !== 'undefined') {

    const { api, ...requestBody } = completeRequestBody;

    response = await nodeRequest(api, 'POST', requestBody);

  }

  ctx.body = response.body;

});

app.listen(3008);
