import axios from 'axios';

const TOKEN_KEY = 'talenthub_token';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
}

api.interceptors.request.use(cfg => {
  if (!cfg.headers) cfg.headers = {} as any;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
});

export default api;
export { TOKEN_KEY, api };
