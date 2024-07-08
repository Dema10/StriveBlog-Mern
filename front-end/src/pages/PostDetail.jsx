import { useEffect, useState } from "react";
import "./Spinner.css";
import { useParams } from "react-router-dom";
import { getPost } from "../services/api";
import { Card, Col, Row } from "react-bootstrap";

export default function PostDetail() {

  const [post, setPost] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
        console.log(response.data);
        
      } catch (err) {
        console.error('Errore nella get del singolo post', err);
      }
    };
    fetchPost();
  }, [id]);

  if(!post) return <div className='spinner'></div>;

  return (
    <Row>
      <h1 style={{ color:"#00ff84" }} className="text-center mt-5">Sei sul post: {post.title} di: {post.author}</h1>
      <Col>
        <Card style={{ border: "2px solid #00ff84" }} 
          className="bg-dark my-5"
          data-bs-theme="dark"
        >
        <Card.Img variant="top" src={post.cover} alt={post.title} />
        <Card.Body>
            <Card.Title className="fs-1 text-center">{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            <Card.Text>Tempo di lettura stimato: {post.readTime.value} {post.readTime.unit}</Card.Text>
            <Card.Text className="text-center">By: {post.author}</Card.Text>
        </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
