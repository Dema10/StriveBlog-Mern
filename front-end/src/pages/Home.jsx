import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import { Col, Row } from "react-bootstrap";
import Post from "../components/Post";


export default function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data.posts);
        console.log(response.data);
        
      } catch (err) {
        console.error('Errore nella get di tutti i post', err);
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
