import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export async function register({ username, password, email, phone_number }) {
  const { data } = await api.post('/auth/register', {
    username,
    password,
    email,
    phone_number,
  })
  return data
}

export async function login({ username, password }) {
  const { data } = await api.post('/auth/login', { username, password })
  return data
}
