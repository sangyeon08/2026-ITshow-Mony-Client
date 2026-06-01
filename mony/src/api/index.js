const BASE_URL = '/api';

function getUserId() {
  let id = localStorage.getItem('mony_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mony_user_id', id);
  }
  return id;
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'user-id': getUserId(),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '요청 실패');
  return data;
}

// ── Accounts ──────────────────────────────────────────
export const accounts = {
  create: (body) => request('/accounts', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => request('/accounts'),
  getById: (id) => request(`/accounts/${id}`),
  update: (id, body) => request(`/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),
};

// ── Goals ─────────────────────────────────────────────
export const goals = {
  create: (body) => request('/goals', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => request('/goals'),
  getProgress: (periodDetail) => request(`/goals/progress?periodDetail=${periodDetail}`),
  remove: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
};

// ── Buckets ───────────────────────────────────────────
export const buckets = {
  create: (body) => request('/buckets', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => request('/buckets'),
  getById: (id) => request(`/buckets/${id}`),
  getStatus: () => request('/buckets/status/all'),
  updateMoney: (id, mony_finish) => request(`/buckets/${id}/money`, { method: 'PATCH', body: JSON.stringify({ mony_finish }) }),
  updateProbability: (id, body) => request(`/buckets/${id}/probability`, { method: 'PATCH', body: JSON.stringify(body) }),
  setDoing: (id) => request(`/buckets/${id}/doing`, { method: 'POST' }),
  remove: (id) => request(`/buckets/${id}`, { method: 'DELETE' }),
};

// ── Analysis ──────────────────────────────────────────
export const analysis = {
  summary: (periodDetail) => request(`/analysis/summary/${periodDetail}`),
  category: (periodDetail) => request(`/analysis/category/${periodDetail}`),
  goalCategory: (periodDetail) => request(`/analysis/goal-category/${periodDetail}`),
  daily: (periodDetail) => request(`/analysis/daily/${periodDetail}`),
  uncategorized: (periodDetail) => request(`/analysis/uncategorized/${periodDetail}`),
};