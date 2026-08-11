import axios from 'axios';

// Cria a instância do Axios com a URL base da sua API no backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Altere se a sua porta do backend for diferente
});

export default api;