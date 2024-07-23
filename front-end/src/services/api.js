import axios from 'axios';

const API_URL = 'http://localhost:5001'; // constante della base della nostra api
const api = axios.create({ baseURL: API_URL }); // creo l'istanza di axios
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log("Token inviato", token);
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// costanti CRUD di blogPost
export const getPosts = () => api.get('/blogPost');
export const getPost = (id) => api.get(`/blogPost/${id}`);
export const createPost = (postData) => api.post('/blogPost', postData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const updatePost = (id, postData) => api.patch(`/blogPost/${id}`, postData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deletePost = (id) => api.delete(`/blogPost/${id}`);

// constanti CRUD di blogPost per comments
// GET su tutti i commenti di un singolo post
export const getComments = (postId) => api.get(`/blogPost/${postId}/comments`)
  .then(res => res.data.filter(comment => comment && comment.content && comment.content.trim() !== ''));
// GET sul singolo commento del singolo post
export const getComment = (postId, commentId) => api.get(`/blogPost/${postId}/comments/${commentId}`);
// POST di un commento su un singolo post
export const createComment = (postId, commentData) => api.post(`/blogPost/${postId}/comments`, commentData).then(res => res.data);
// PATCH di un singolo commento su un singolo post
export const updatedComment = (postId, commentId, commentData) => api.patch(`/blogPost/${postId}/comments/${commentId}`, commentData);
// DELETE di un singolo commento su un singolo post
export const deleteComment = (postId, commentId) => api.delete(`/blogPost/${postId}/comments/${commentId}`);



//TODO costanti CRUD di author

// POST per il nuovo autore
export const registerAuthor = (authorData) => api.post('/authors', authorData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const loginAuthor = async (credentials) => {
    try {
        // richiesta di login
        const res = await api.post('/auth/login', credentials);
        // log per debugging
        console.log('Risposta api login', res.data);
        //  restituisco i dati della risposta
        return res.data;
    } catch (err) {
        console.error("Errore nella chiama del login", err);
        throw err;
    }
};

// GET che ottiene i dati dell'autore loggato
export const getMe = () => api.get('/auth/me').then(res => res.data);

export const getAuthorData = async () => {
    try {
        // richiesta per ottenere i dati dell' utente
        const res = await api.get('/auth/me');
        // restituisce i dati dell' utente
        return res.data;
    } catch (err) {
        console.error('Errore nel recupero dei dati dell\' autore', err);
        throw err;
    }
};


export default api;