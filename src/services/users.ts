import { getURL } from './connect'

function refreshUsers(list) {
  return getURL(`/users?l=${list.join(',')}`)
}

export {
  refreshUsers,
}
