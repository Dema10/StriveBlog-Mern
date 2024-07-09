import axios from 'axios';

const API_URL = 'http://localhost:5001'; // constante della base della nostra api
const api = axios.create({ baseURL: API_URL }); // creo l'istanza di axios

// costanti CRUD di blogPost
export const getPosts = () => api.get('/blogPost');
export const getPost = (id) => api.get(`/blogPost/${id}`);
export const createPost = (postData) => api.post('/blogPost', postData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const updatePost = (id, postData) => api.patch(`/blogPost${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPost${id}`);

//TODO costanti CRUD di author

export default api;