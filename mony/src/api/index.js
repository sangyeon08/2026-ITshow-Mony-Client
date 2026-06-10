const BASE_URL = '/api';

function getUserId() {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  let id = localStorage.getItem('mony_user_id');
  if (!id || !uuidPattern.test(id)) {
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

  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';
  const data = text && contentType.includes('application/json')
    ? JSON.parse(text)
    : {};

  if (!res.ok) {
    throw new Error(data.message || data.error || `요청 실패 (${res.status})`);
  }

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
  deposit: (id, amount) => request(`/buckets/${id}/deposit`, { method: 'PATCH', body: JSON.stringify({ amount }) }),
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
