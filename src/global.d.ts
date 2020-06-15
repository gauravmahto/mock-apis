import Koa from 'koa';

declare module 'Koa' {

  interface Request {

    xInfo: {
      api: string;
      method: string;
      [ k: string ]: string;
    };

  }

}
