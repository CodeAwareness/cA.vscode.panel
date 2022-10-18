export default function() {
  const n = String.fromCharCode(Math.floor(Math.random() * 10 + 48))
  const l = String.fromCharCode(Math.floor(Math.random() * 26 + 97))
  const c = String.fromCharCode(Math.floor(Math.random() * 26 + 65))
  return l + c + n + new Date().valueOf().toString()
}
