import express from 'express';
import BlogPost from '../models/blogPost.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let query = {};
        if(req.query.title) {
            // query.title = req.query.title; se si vuole fare una ricerca sensitive
            query.title = {$regex: req.query.title, $options: 'i'} // i = insensitive
        }
        const {page = 1, limit = 5} = req.query
        const posts = await BlogPost.find()
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await BlogPost.countDocuments();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalPost: count
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
            res.json(post);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const post = new BlogPost(req.body);

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatePost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatePost) {
            return res.status(404).json({ message: "Post non trovato" })
        } else {
            res.json({ message: "Post modificato" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletePost = await BlogPost.findByIdAndDelete(req.params.id)
        if (!deletePost) {
            return res.status(404).json({ message: "Post non trovato" })
        } else {
            res.json({ message: "Post eliminato" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;