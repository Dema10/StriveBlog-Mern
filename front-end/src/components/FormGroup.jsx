import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { createPost } from '../services/api';

export default function FormGroup() {

    const [post, setPost] = useState({
        title: "",
        category: "",
        content: "",
        author: ""
      });

      const [coverFile, setCoverFile] = useState(null);
    
      const navigate = useNavigate();
    
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

            await createPost(formData);
            
            navigate('/');
        } catch (err) {
            console.error(" Errore nella creazione del post", err);
        }
      };

  return (
    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Titolo post</Form.Label>
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
            <Form.Label>Categoria</Form.Label>
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
            <Form.Label>Contenuto</Form.Label>
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
            <Form.Label>Immagine di copertina</Form.Label>
            <Form.Control
                type="file"
                name="cover"
                onChange={handleFileChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Email Autore</Form.Label>
            <Form.Control
                type="text"
                name="author"
                value={post.author}
                onChange={handleChange}
                required
                data-custom-input
            />
        </Form.Group>
        <Button className='mt-3 mb-5 w-100' variant='outline-success' type='submit' data-custom-btn>
            Crea il post
        </Button>
    </Form>
  )
}
