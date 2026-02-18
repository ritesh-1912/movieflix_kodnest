/**
 * Normalize API errors into a single user-friendly string for display.
 * Handles backend shapes, Vercel/4xx/5xx, and network errors so we never render an object.
 */

function getMessageFromResponse(data) {
  if (data == null) return null
  if (typeof data === 'string') return data
  if (typeof data === 'object') return data.error ?? data.message ?? null
  return null
}

export function getLoginErrorMessage(err) {
  const status = err.response?.status
  const data = err.response?.data
  const serverMessage = getMessageFromResponse(data)

  if (status === 401)
    return serverMessage || 'Incorrect password or username. Please try again.'
  if (status === 404 || err.code === 'ERR_NETWORK' || err.message === 'Network Error')
    return "We're having trouble connecting. Please check your connection and try again."
  if (status === 400)
    return serverMessage || 'Please enter your username and password.'
  if (status === 503)
    return serverMessage || 'Sign-in is temporarily unavailable. Please try again later.'
  if (status >= 500)
    return 'Something went wrong on our end. Please try again later.'

  return serverMessage || err.message || 'Incorrect password or username. Please try again.'
}

export function getRegisterErrorMessage(err) {
  const status = err.response?.status
  const data = err.response?.data
  const serverMessage = getMessageFromResponse(data)

  if (status === 409)
    return serverMessage || 'That email or username is already in use. Try signing in or use a different email.'
  if (status === 404 || err.code === 'ERR_NETWORK' || err.message === 'Network Error')
    return "We're having trouble connecting. Please check your connection and try again."
  if (status === 400)
    return serverMessage || 'Please fill in all fields correctly.'
  if (status === 503)
    return serverMessage || 'Sign-up is temporarily unavailable. Please try again later.'
  if (status >= 500)
    return 'Something went wrong on our end. Please try again later.'

  return serverMessage || err.message || 'Registration failed. Please try again.'
}
