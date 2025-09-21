// Cookie utility functions
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return cookieValue
    }
  }
  return null
}

export const setCookie = (
  name: string, 
  value: string, 
  options: {
    maxAge?: number
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
    path?: string
  } = {}
): void => {
  if (typeof document === 'undefined') {
    return
  }

  const {
    maxAge = 7 * 24 * 60 * 60, // 7 days default
    secure = window.location.protocol === 'https:',
    sameSite = 'lax',
    path = '/'
  } = options

  let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`
  
  if (secure) {
    cookieString += '; secure'
  }

  document.cookie = cookieString
}

export const deleteCookie = (name: string, path: string = '/'): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export const getAuthToken = (): string | null => {
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token'
  return getCookie(tokenKey)
}

export const getAuthUser = (): any | null => {
  const userKey = process.env.NEXT_PUBLIC_AUTH_USER_KEY || 'user'
  const userCookie = getCookie(userKey)
  
  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie))
    } catch (error) {
      console.error('Failed to parse user cookie:', error)
      return null
    }
  }
  
  return null
}

export const clearAuthCookies = (): void => {
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token'
  const userKey = process.env.NEXT_PUBLIC_AUTH_USER_KEY || 'user'
  
  deleteCookie(tokenKey)
  deleteCookie(userKey)
}
