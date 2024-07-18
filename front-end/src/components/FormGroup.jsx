import { useEffect, useState } from 'react'
import { Button, Form } from "react-bootstrap";

export default function FormGroup({ initialPost, onSubmit, onSubmitSuccess }) {
    // Stato per gestire i dati del post
    const [post, setPost] = useState({
        title: "",
        category: "",
        content: "",
        author: "",
        ...initialPost // Spread per includere i dati iniziali se presenti
      });

      const [coverFile, setCoverFile] = useState(null);

    // Aggiorna lo stato del post quando initialPost cambia
    useEffect(() => {
        if (initialPost) {
            setPost(initialPost);
        }
    }, [initialPost]);
    
    
      const handleChange = (e) => {
        const {name, value} = e.target;
        setPost({ ...post, [name]: value });
        
      };

      const handleFileChange = (e) => {
        setCoverFile(e.target.files[0]);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(post).forEach(key => {
                formData.append(key, post[key]);
            });

            if (coverFile) {
                formData.append('cover', coverFile);
            }

            await onSubmit(formData);
            
            if (onSubmitSuccess) onSubmitSuccess();  // Chiamiamo onSubmitSuccess se definito
        } catch (err) {
            console.error(" Errore nella creazione del post", err);
        }
      };

  return (
    <Form data-bs-theme="dark" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label className='text-white'>Titolo post</Form.Label>
            <Form.Control
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label className='text-white'>Categoria</Form.Label>
            <Form.Control
                type="text"
                name="category"
                value={post.category}
                onChange={handleChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label className='text-white'>Contenuto</Form.Label>
            <Form.Control as="textarea" rows={3}
                type="text"
                name="content"
                value={post.content}
                onChange={handleChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className='text-white'>Immagine di copertina</Form.Label>
            <Form.Control
                type="file"
                name="cover"
                onChange={handleFileChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label className='text-white'>Email Autore</Form.Label>
            <Form.Control
                type="text"
                name="author"
                value={post.author}
                onChange={handleChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Button className='mt-3 mb-5 w-100' variant='outline' type='submit' data-custom-btn>
            {initialPost ? 'Aggiorna il post' : 'Crea il post'}
        </Button>
    </Form>
  )
}
