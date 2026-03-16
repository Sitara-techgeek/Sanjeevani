import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const triageAPI = {
  run: (data) => api.post('/triage', data),
};

export const hospitalAPI = {
  getAll:  ()         => api.get('/hospitals'),
  add:     (data)     => api.post('/hospitals', data),
  update:  (id, data) => api.put(`/hospitals/${id}`, data),
  delete:  (id)       => api.delete(`/hospitals/${id}`),
};

export const bloodBankAPI = {
  getAll: ()     => api.get('/blood-banks'),
  add:    (data) => api.post('/blood-banks', data),
  delete: (id)   => api.delete(`/blood-banks/${id}`),
};

export const uploadAPI = {
  hospitals:  (file) => { const fd = new FormData(); fd.append('file', file); return api.post('/upload/hospitals', fd); },
  bloodBanks: (file) => { const fd = new FormData(); fd.append('file', file); return api.post('/upload/blood-banks', fd); },
};

const ORS_KEY  = process.env.REACT_APP_ORS_API_KEY;
const ORS_BASE = 'https://api.openrouteservice.org';

export const orsAPI = {
  getRoute: async (fromLng, fromLat, toLng, toLat) => {
    const res = await axios.post(
      `${ORS_BASE}/v2/directions/driving-car/geojson`,
      {
        coordinates: [
          [fromLng, fromLat],
          [toLng,   toLat  ],
        ],
      },
      {
        headers: {
          Authorization:  ORS_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  },
};
