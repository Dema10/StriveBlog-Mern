import { useEffect, useState } from "react";
import "./Spinner.css";
import { useParams, useNavigate } from "react-router-dom";
// Aggiungiamo getComments e addComment alle importazioni
import { getPost, updatePost, deletePost, getComments, createComment, deleteComment } from "../services/api";
import { Card, Col, Row, Button, ButtonGroup, Form } from "react-bootstrap";
import { HandThumbsUp, Chat, Pencil, Trash } from "react-bootstrap-icons";
import FormGroup from "../components/FormGroup";

export default function PostDetail() {
  // Dichiaro gli stati che mi serviranno
  const [post, setPost] = useState(null);  // Per memorizzare i dati del post
  const [isEditing, setIsEditing] = useState(false);  // Per gestire la modalità di modifica
  const [isClick, setIsClick] = useState(false); // Per gestire la visualizzazione dei commenti e del form per creare i commenti
  
  // NUOVO: Stati per gestire i commenti
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });
  
  // Ottengo l'id del post dalla URL
  const { id } = useParams();
  
  // Hook per la navigazione
  const navigate = useNavigate();

  // Uso useEffect per caricare i dati del post quando il componente monta o l'id cambia
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
        
        // Carico i commenti solo al montaggio
        const commentsResponse = await getComments(id);
        setComments(commentsResponse);

      } catch (err) {
        console.error('Errore nella get del singolo post o dei commenti', err);
      }
    };
    fetchPostAndComments();
  }, [id, isEditing]);

  // Funzione per gestire l'aggiornamento del post
  const handleUpdatePost = async (updatedPost) => {
    try {
      const response = await updatePost(id, updatedPost);
      console.log('Post aggiornato:', response.data);  // Aggiungi questo log
      setPost(response.data);  // Aggiorno lo stato con i nuovi dati
      setIsEditing(false);  // Torno alla modalità di visualizzazione
    } catch (err) {
      console.error('Errore nell\'aggiornamento del post', err);
    }
  };

  // Funzione per gestire l'eliminazione del post
  const handleDeletePost = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo post?')) {
      try {
        await deletePost(id);
        navigate('/');  // Dopo l'eliminazione, torno alla home
      } catch (err) {
        console.error('Errore nell\'eliminazione del post', err);
      }
    }
  };

  // NUOVO: Gestore per i cambiamenti nei campi del nuovo commento
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // NUOVO: Gestore per l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCommentResponse = await createComment(id, newComment);
      setComments(prevComments => [...prevComments, newCommentResponse]);
      setNewComment({ name: "", email: "", content: "" });
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  // funzione per l'eliminazione del commento
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo commento?')) {
      try {
        await deleteComment(id, commentId);
        // Aggiorno lo stato dei commenti rimuovendo il commento eliminato
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      } catch (err) {
        console.error('Errore nell\'eliminazione del commento', err);
      }
    }
  };

  // Se il post non è ancora caricato, mostro lo spinner
  if (!post) return <div className='spinner'></div>;

  // Rendering del componente
  return (
    <Row>
      <h1 style={{ color:"#00ff84" }} className="text-center mt-5">
        {isEditing ? "Modifica il post" : `Sei sul post: ${post.title} di: ${post.author}`}
      </h1>
      <Col>
        {isEditing ? (
          // Se sono in modalità modifica, mostro il form
          <>
            <FormGroup 
              initialPost={post} 
              onSubmit={handleUpdatePost} 
              onSubmitSuccess={() => setIsEditing(false)} 
            />
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Annulla</Button>
          </>
        ) : (
          // Altrimenti, mostro i dettagli del post
          <Card style={{ width: "50rem", border: "2px solid #00ff84" }} 
            className="bg-dark my-5"
            data-bs-theme="dark"
          >
            <Card.Img variant="top" src={post.cover} alt={post.title} />
            <Card.Body>
              <Card.Title className="fs-1 text-center">{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text>
                Tempo di lettura stimato: 
                {post.readTime && post.readTime.value && post.readTime.unit
                  ? ` ${post.readTime.value} ${post.readTime.unit}`
                  : 'Non disponibile'}
              </Card.Text>
              <Card.Text className="text-center">By: {post.author}</Card.Text>
              <ButtonGroup>
                <Button variant="outline-warning" onClick={() => setIsEditing(true)}>Modifica</Button>
                <Button variant="outline-danger" onClick={handleDeletePost}>Elimina</Button>
              </ButtonGroup>
              <ButtonGroup className="float-end">
                <Button variant="outline-primary"><HandThumbsUp className=" pb-1 fs-5"/> Like</Button>
                <Button variant="outline-primary" onClick={() => setIsClick(!isClick)}><Chat className=" pb-1 fs-5"/> {`${comments.length} comments`}</Button>
              </ButtonGroup>
              {/* NUOVO: Sezione commenti che appare solo quando isClick è true */}
              {isClick && (
                <div className="mt-3">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div className="d-flex justify-content-between align-items-center" key={comment._id}>
                          <div>
                            <h3>{comment.name}</h3>
                            <p className="text-center">{comment.content}</p>
                          </div>
                          <ButtonGroup>
                          <Button variant="outline-warning"><Pencil className="fs-5"/></Button>
                          <Button variant="outline-danger" onClick={() => handleDeleteComment(comment._id)}><Trash className="fs-5" /></Button>
                          </ButtonGroup>
                        </div>
                    ))
                  ) : (
                    <p>Ancora nessun commento</p>
                  )}
                  {/* NUOVO: Form per aggiungere un nuovo commento */}
                  <Form onSubmit={handleCommentSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        name="name"
                        value={newComment.name}
                        onChange={handleCommentChange}
                        placeholder="Il tuo nome"
                        data-custom-input
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="email"
                        name="email"
                        value={newComment.email}
                        onChange={handleCommentChange}
                        placeholder="La tua email"
                        data-custom-input
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        placeholder="Il tuo commento"
                        data-custom-input
                        required
                      />
                    </Form.Group>
                    <Button data-custom-btn variant="outline" className="mb-2" type="submit">Invia commento</Button>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
}