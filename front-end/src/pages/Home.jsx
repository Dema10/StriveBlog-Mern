import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import { Col, Row } from "react-bootstrap";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";


export default function Home() {

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await getPosts();
        setPosts(response.data.posts);        
      } catch (err) {
        console.error('Errore nella get di tutti i post', err);
        navigate("/login")
      }
    };
    fetchPosts();
  }, []);

  return (
    <Row className="mb-4">
      <Col>
        <h1 style={{ color:"#00ff84" }} className="text-center my-4">I Post di Strive Blog!</h1>
        <Row>
          <Post posts={posts} />
        </Row>
      </Col>
    </Row>
  )
}
