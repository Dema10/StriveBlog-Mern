import { Link } from "react-router-dom";
import { Card, Col, Nav } from "react-bootstrap";

export default function Post({ posts }) {
  return (
    <>
        {posts.map((post) => (
            <Col xs={12} sm={6} md={4} lg={4} className="mb-3" key={post._id}>
                <Nav.Link as={Link} to={`/post/${post._id}`}>
                    <Card style={{ 
                        border: "2px solid #00ff84",
                        
                        }} 
                        className="bg-dark"
                        data-bs-theme="dark">
                    <Card.Img variant="top" src={post.cover} alt={post.title} />
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>By: {post.author}</Card.Text>
                    </Card.Body>
                    </Card>
                </Nav.Link>
            </Col>
        ))}
    </>
  )
}
