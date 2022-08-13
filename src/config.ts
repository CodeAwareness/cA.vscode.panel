const PORT_DEV = 8885

const LOCAL = !PRODUCTION

export default {
  PORT_DEV,
  MAX_USER_NAME_LENGTH: 14,
  CODEAWARENESS: LOCAL ? `https://localhost:${PORT_DEV}` : 'https://codeawareness.com',
  EXT_SERVER: LOCAL ? `https://localhost:${PORT_DEV}` : 'https://codeawareness.com',
  SERVER_WSS: LOCAL ? `wss://localhost:${PORT_DEV}` : 'wss://api.codeawareness.com/web',
  SERVER_URL: 'https://api.codeawareness.com/v1',
}
