import { createHash } from 'crypto';

export * from './request';
export * from './websocket';

export const getPlatformAccountIdFromApiToken = (apiToken: string): number => {

  const buffer = createHash('md5').update(apiToken).digest();

  return buffer.readUInt32LE(0);

};
