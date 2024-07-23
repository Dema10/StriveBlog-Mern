import { useNavigate } from 'react-router-dom';
import FormGroup from "../components/FormGroup";
import { createPost, getMe } from '../services/api';
import { useEffect, useState } from 'react';

export default function NewPost() {
  const navigate = useNavigate();
  const [initialPost, setInitialPost] = useState({ author: '' });

  useEffect(() => {
    const fetchAuthorEmail = async () => {
      try {
        const authorData = await getMe();
        setInitialPost(prevPost => ({ ...prevPost, author: authorData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchAuthorEmail();
  }, [navigate]);

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
      navigate('/');  // Naviga alla home dopo la creazione
    } catch (err) {
      console.error("Errore nella creazione del post", err);
    }
  };

  return (
    <>
      <h1 className="mt-3 my5" style={{ color:"#00ff84" }}>Crea un nuovo post!</h1>
      <FormGroup 
        initialPost={initialPost} 
        onSubmit={handleCreatePost} 
        onSubmitSuccess={() => navigate('/')}
        isNewPost={true} 
      />
    </>
  );
}