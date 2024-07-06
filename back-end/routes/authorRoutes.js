import express, { json } from 'express';
import Author from '../models/author.js';
import BlogPost from '../models/blogPost.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query
        const authors = await Author.find()
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await Author.countDocuments();

        res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        } else {
            res.json(author);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const author = new Author(req.body);

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updateAuthor = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateAuthor) {
            return res.status(404).json({ message: "Autore non trovato" })
        } else {
            res.json({ message: "Autore modificato" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleteAuthor = await Author.findByIdAndDelete(req.params.id)
        if (!deleteAuthor) {
            return res.status(404).json({ message: "Autore non trovato" })
        } else {
            res.json({ message: "Autore eliminato" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET per che restituisce i post di un singolo autore
router.get('/:id/blogPost', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        const {page = 1, limit = 5} = req.query
        const blogPost = await BlogPost.find({ author: author.email })
            .limit(limit)
            .skip((page - 1) * limit)
        res.json(blogPost)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;