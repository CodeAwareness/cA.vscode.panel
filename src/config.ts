const PORT_DEV = 3080
const LOCAL = process.env.NODE_ENV === 'development'

export default {
  PORT_DEV,
  MAX_USER_NAME_LENGTH: 24,
  EXT_MEDIA: LOCAL ? `https://lc.codeawareness.com:${PORT_DEV}` : 'https://vscode.codeawareness.com',
}
