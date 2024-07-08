import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { createPost } from '../services/api';

export default function FormGroup() {
    const [post, setPost] = useState({
        title: "",
        category: "",
        content: "",
        // readTime: {value: 0, unit: "minuto"},
        author: ""
      });
    
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        const {name, value} = e.target;
        setPost({ ...post, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await createPost(post);
          navigate('/');
        } catch (err) {
          console.error(" Errore nella creazione del post", err);
        }
      }
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
        <Form.Group className="mb-3">
            <Form.Label>URL Immagine</Form.Label>
            <Form.Control
                type="text"
                name="cover"
                value={post.cover}
                onChange={handleChange}
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
        <Button className='mt-3 w-100' variant='outline-success' type='submit'>
            Crea il post
        </Button>
    </Form>
  )
}
