const PORT_DEV = 8885
const LOCAL = false

export default {
  PORT_DEV,
  MAX_USER_NAME_LENGTH: 24,
  EXT_MEDIA: LOCAL ? `https://lc.codeawareness.com:${PORT_DEV}` : 'https://ext.codeawareness.com/vscode',
}
