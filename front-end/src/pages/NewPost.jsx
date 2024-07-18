import { useNavigate } from 'react-router-dom';
import FormGroup from "../components/FormGroup";
import { createPost } from '../services/api';

export default function NewPost() {
  const navigate = useNavigate();

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
      <h1 className="my5" style={{ color:"#00ff84" }}>Crea un nuovo post!</h1>
      <FormGroup onSubmit={handleCreatePost} onSubmitSuccess={() => navigate('/')} />
    </>
  );
}