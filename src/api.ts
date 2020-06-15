import Router from 'koa-router';

export const router = new Router({
  prefix: '/api'
});

router.post('/providers/lone_star/process_spin', (ctx) => {

  ctx.body = {
    user: {
      balance: 1999025
    }
  };

});
