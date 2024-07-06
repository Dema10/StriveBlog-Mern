import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";

export default function Post({ posts }) {
  return (
    <>
        {posts.map((post) => (
            <Col xs={12} sm={6} md={4} lg={4} className="mb-3" key={post._id}>
                <Link to={`/post/${post._id}`}>
                    <Card>
                    <Card.Img src={post.cover} alt={post.title} />
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>By: {post.author}</Card.Text>
                    </Card.Body>
                    </Card>
                </Link>
            </Col>
        ))}
    </>
  )
}
