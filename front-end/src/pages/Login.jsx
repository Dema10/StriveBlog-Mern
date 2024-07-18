import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { loginAuthor } from '../services/api';

export default function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name] : [e.target.value] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginAuthor(formData);
            localStorage.setItem("token", res.token);
            window.dispatchEvent(new Event("storage"));
            alert("Login avvenuto con successo!");
            navigate("/");
        } catch (err) {
            console.error("Errore durante il login", err);
            alert("Credenziali non valide. Riprova.")
        }
    };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
            <h1 style={{ color:"#00ff84" }} className="text-center my-4">Login</h1>
            <Form data-bs-theme="dark" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className='text-white'>Email</Form.Label>
                    <Form.Control 
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    data-custom-input
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className='text-white'>Password</Form.Label>
                    <Form.Control 
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    data-custom-input
                    />
                </Form.Group>
                <Button className='mt-3 mb-5 w-100' variant='outline' type='submit' data-custom-btn>
                    Login
                </Button>
            </Form>
        </div>
    </Container>
    
  )
}
