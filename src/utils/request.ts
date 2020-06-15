import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

import nodeFetch from 'node-fetch';

const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();

export interface Response {
  status: number;
  headers: {
    [ key: string ]: string;
  };
  body: string;
}

export interface CoreResponse {
  body: string;
  headers: { [ key: string ]: string | undefined; };
  status: number;
}

export type RequestFunction = (url: string, method: string, body?: Record<string, unknown>) => Promise<CoreResponse>;

export const nodeRequest = async (url: string, method: string, body?: Record<string, unknown>): Promise<Response> => {

  const response = await nodeFetch(url, {
    agent: url.startsWith('https') ? httpsAgent : httpAgent,
    body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method
  });

  const headers: CoreResponse[ 'headers' ] = {};

  for (const [ k, v ] of response.headers) {
    headers[ k ] = v;
  }

  return {
    status: response.status,
    headers,
    body: await response.text()
  };

};
