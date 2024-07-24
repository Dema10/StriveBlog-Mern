import { useEffect, useState } from 'react'
import { Button, Form, Nav } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginAuthor } from '../services/api';
import { Google } from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Questo effect viene eseguito dopo il rendering del componente
        // e ogni volta che location o navigate cambiano
    
        // Estraiamo i parametri dall'URL
        const params = new URLSearchParams(location.search);
        // Cerchiamo un parametro 'token' nell'URL
        const token = params.get("token");
    
        if (token) {
    
          console.log("Token ricevuto:", token);
          // Se troviamo un token, lo salviamo nel localStorage
          localStorage.setItem("token", token);
          // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
          window.dispatchEvent(new Event("storage"));
          // Navighiamo alla home page
          navigate("/");
        }
      }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name] : e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginAuthor(formData);
            localStorage.setItem("token", res.token);
            localStorage.setItem("authorData", JSON.stringify(formData));
            console.log("Token salvato nel localStorage:", localStorage.getItem("token"));
            window.dispatchEvent(new Event("storage"));
            alert("Login avvenuto con successo!");
            navigate("/");
        } catch (err) {
            console.error("Errore durante il login", err);
            alert("Credenziali non valide. Riprova.")
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
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
                <p className='text-white d-flex'>If you don't have an account click<Nav.Link as={Link} to="/singup" className="custom-link mx-1">signUp</Nav.Link> or</p>
                <Button onClick={handleGoogleLogin} className='mt-3 mb-5 w-100' variant='outline' data-custom-btn>
                    <Google className="pb-1 fs-5" /> Log in with google
                </Button>
            </Form>
        </div>
    </div>
    
  )
}
