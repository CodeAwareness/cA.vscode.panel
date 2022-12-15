import axios from 'axios'

import config from '@/config'
import { tokens, user } from '@/store/user.store'

declare module 'axios' {
  export interface AxiosRequestConfig {
    baseURL?: string,
    'Content-Type'?: string,
  }
}

/***********************************
 * This file is used for retrieving the user list for the shared PPT file, as well as fetching and posting comments.
 * -- we may want to move these fn to the grand-station instead and avoid communicating with the API directly from PowerPoint.
 **********************************/

const axiosAPI = axios.create({ baseURL: config.SERVER_URL })

let _tokens

tokens.subscribe(val => {
  _tokens = val
})

// TODO: onDestroy(tokensDestroy) // function called outside component initialization

axiosAPI.interceptors.request.use(config => {
  const access = _tokens && _tokens.access
  if (access && access.token) config.headers.Authorization = `Bearer ${access.token}`
  return config
})

axiosAPI.interceptors.response.use(response => response, err => {
  if (!err.response) return Promise.reject(err)
  return new Promise((resolve, reject) => {
    if (err.response.status === 401 && err.config && err.response.config.url !== `${config.SERVER_URL}/auth/refresh-tokens`) {
      if (!_tokens) return logout(reject, 'No tokens in the store.')
      const { refresh } = _tokens
      if (!refresh || refresh.expires < new Date().valueOf()) return logout(reject, 'Refresh token expired ' + refresh.expires)
      return refreshToken(refresh.token)
        .then(data => {
          const { token } = data.access
          err.config.headers.Authorization = `Bearer ${token}`
          axiosAPI(err.config).then(resolve, reject)
        })
        .catch(err => {
          return logout(reject, err)
        })
    }
    return reject(err)
  })
})

function logout(reject?: any, err?: string): any {
  user.set(null)
  tokens.set(null)

  return reject && reject(new Error(err || 'You have been logged out'))
}

function refreshToken(refreshToken: string): Promise<any> {
  return axiosAPI
    .post(`${config.SERVER_URL}/auth/refresh-tokens`, { refreshToken })
    .then(res => {
      tokens.set(res.data.tokens)
      return res.data.tokens
    })
}

const postData = (url: string, data: unknown): Promise<any> => {
  const headers = { 'Content-Type': 'application/json' }
  return axiosAPI.post(url, data, headers)
}

const getURL = (url: string): Promise<any> => {
  const { access } = _tokens
  if (!access) return Promise.reject(new Error('Unauthorized'))
  return axiosAPI(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access.token}`,
    },
  })
}

export {
  getURL,
  logout,
  postData,
}
