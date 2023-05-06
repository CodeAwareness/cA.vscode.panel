const PORT_DEV = 8885
const PORT_WSS = 48408

/* eslint-disable-next-line */
/* @ts-ignore */
const LOCAL = !PRODUCTION

export default {
  PORT_DEV,
  MAX_USER_NAME_LENGTH: 14,
  EXT_SERVER: LOCAL ? `https://127.0.0.1:${PORT_DEV}` : 'https://vscode.codeawareness.com',
  SERVER_URL: LOCAL ? `https://127.0.0.1:${PORT_DEV}/api/v1` : 'https://api.codeawareness.com/v1',
  SERVER_WSS: `wss://127.0.0.1:${PORT_WSS}`,
}
