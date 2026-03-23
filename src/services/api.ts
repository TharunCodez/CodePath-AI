import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const runCode = async (code: string, languageId: number) => {
  const response = await api.post('/run-code', { code, language_id: languageId });
  return response.data;
};
