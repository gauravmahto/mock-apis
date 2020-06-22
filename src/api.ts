import Router from 'koa-router';

import { getPlatformAccountIdFromApiToken } from './utils';

export const router = new Router();

const apiToken = 'MOCKTOKEN12345MOCKTOKEN';
const id = getPlatformAccountIdFromApiToken(apiToken);
const balance = 9000000;

router.use(async (ctx, next) => {

  console.info(`${new Date()} - Received request for ${ctx.request.URL}`);

  await next();

});

router.post('/api/providers/lone_star/auth_user', (ctx) => {

  ctx.body = {
    'api_urls': {
      'feature_win': '/api/providers/lone_star/feature_win',
      'increment_jackpots': '/api/providers/lone_star/increment_jackpots',
      'jackpot_win': '/api/providers/lone_star/jackpot_win',
      'place_bet': '/api/providers/lone_star/place_bet',
      'process_spin': '/api/providers/lone_star/process_spin',
      'settle_bet': '/api/providers/lone_star/settle_bet'
    },
    'balance': balance, 'game_account_id': id, 'platform_account_id': id,
    'recovery_retries': 0, 'token': id
  };

});

router.post('/api/install', (ctx) => {

  ctx.body = {
    'user': {
      'api_token': apiToken,
      'balance': balance,
      'experience': { 'level': 1, 'xp': 0 },
      'game_account_id': id,
      'platform_account_id': id
    }
  };

});

router.post('/api/game_updates', (ctx) => {

  ctx.body = {
    'game_categories': [
      {
        'game_configurations': [
          {
            'id': 3437072481,
            'internal_name': '50dragons_none_202005220923129206885',
            'math_variant': '',
            'provider': { 'name': 'lone_star' }
          }
        ]
      }
    ]
  };

});

router.post('/api/select_game', (ctx) => {

  ctx.body = {
    'game_configuration': {
      'lonestar_data': {
        'game_config': { 'balance': balance },
        'game_id': 481830260,
        'game_session_id': '5d5dbc29-d1d7-41f4-9d82-5ab957258353',
        'lonestar_url': 'Mock Atlas should only ever be used with LobbyCore where this is ignored',
        'platform_account_id': id,
        'server_host': 'http://127.0.0.1:3008',
        'math_variant': ''
      }
    }
  };

});

router.post('/api/providers/lone_star/process_spin', (ctx) => {

  ctx.body = {
    user: {
      balance: balance
    }
  };

});
