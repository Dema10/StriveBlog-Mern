import express from 'express';
import BlogPost from '../models/blogPost.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { sendEmail } from '../services/emailServices.js';
//import upload from '../middlewares/upload.js';

// Creo una funzione per calcolare il tempo di lettura
function calculateReadTime(content) {
    if (!content || typeof content !== 'string') {
        return { value: 0, unit: "minuti" };
    }

    const wordsPerMinute = 200; // il valore 200 sta ad indicare che in 1 minuto si possono leggere 200 parole perchè da una ricerca in media si possono leggere dalle 200 alle 300 parole al minuto
    const wordCount = content.trim().split(/\s+/).length; // Conto le parole nel contenuto usando la regex \s+ che divede le parole da uno o più spazi bianchi
    const readTimeValue = Math.ceil(wordCount / wordsPerMinute) // Arrotondo per eccesso

    // con un operatore ternario controllo che se il valore di readTimeValue è strettamente uguale a 1 o no gestisco il singolare e plurale di unit
    const unit = readTimeValue === 1 ? "minuto" : "minuti";

    return {
        value: readTimeValue, 
        unit: unit
    };
}

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let query = {};
        if(req.query.title) {
            // query.title = req.query.title; se si vuole fare una ricerca sensitive
            query.title = {$regex: req.query.title, $options: 'i'} // i = insensitive
        }
        const {page = 1, limit = 10} = req.query
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

// POST SENZA CLOUDINARY E MAILGUN
/* router.post('/', async (req, res) => {
    const postData = req.body;
    // Calcolo automaticamente il tempo di lettura prima di salvare il post
    const { value, unit } = calculateReadTime(postData.content);
    postData.readTime = { value, unit };

    const post = new BlogPost(req.body);

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); */

// POST CON CLOUDINARY E MAILGUN
router.post('/', cloudinaryUploader.single("cover"), async (req, res) => {
    try {
      const postData = req.body;
    
      
      // Aggiunta della cover se presente
      if (req.file) {
        postData.cover = req.file.path;
        //postData.cover = `http://localhost:5001/uploads/${req.file.filename}`;
      }
    
      // Calcolo automatico del tempo di lettura
      const { value, unit } = calculateReadTime(postData.content);
      postData.readTime = { value, unit };
      
      const newPost = new BlogPost(postData);
      await newPost.save();
      
      // INVIO EMAIL DI CONFERMA
      const htmlContent = `
        <h1>Il tuo post è stato pubblicato!</h1>
        <p>Ciao ${newPost.author},</p>
        <p>Il tuo post "${newPost.title}" è stato pubblicato con successo!</p>
        <p>Categoria: ${newPost.category}</p>
        <p>Grazie per il tuo contributo al blog!</p>
        `;

        await sendEmail(
            newPost.author,
            "Il Post è pubblicato 8==D",
            htmlContent
        );

      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  });

// PATCH SENZA CLOUDINARY E MAILGUN
/* router.patch('/:id', async (req, res) => {
    try {
        const postData = req.body;
        // Se il contenuto viene aggiornato, ricalcolo il tempo di lettura
        if (postData.content) {
            postData.readTime = calculateReadTime(postData.content);
        }
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
}); */

// PATCH CON CLOUDINARY E MAILGUN
router.patch('/:id', cloudinaryUploader.single("cover"), async (req, res) => {
    try {
        let postData = req.body;

        // Aggiorno il campo cover nel caso viene cambiata
        if (req.file) {
            postData.cover = req.file.path;
        }

        // Ricalcolo tempo di lettura
        if (postData.content) {
            const { value, unit } = calculateReadTime(postData.content);
            postData.readTime = { value, unit };
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            postData,
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post non trovato" });
        } else {
            // Invio un'email di conferma
            const htmlContent = `
                <h1>Il tuo post è stato aggiornato!</h1>
                <p>Ciao ${updatedPost.author},</p>
                <p>Il tuo post "${updatedPost.title}" è stato aggiornato con successo!</p>
                <p>Categoria: ${updatedPost.category}</p>
                <p>Grazie per mantenere aggiornato il tuo contenuto!</p>
            `;

            await sendEmail(
                updatedPost.author,
                "Post Aggiornato con Successo",
                htmlContent
            );

            res.json({ message: "Post modificato", post: updatedPost });
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

// PATCH per modificare solo la cover /blogPost/:blogPostId/cover
router.patch('/:blogPostId/cover', cloudinaryUploader.single("cover"), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(404).json({ message: 'Nessun file caricato' })
        }
        const blogPost = await BlogPost.findById(req.params.blogPostId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
       
        blogPost.cover = req.file.path;
        
        await blogPost.save();

        // Invio un'email di conferma
        const htmlContent = `
        <h1>il tuo post è stato aggiornato!</h1>
        <p>Ciao ${blogPost.author},</p>
        <p>La cover del tuo post: "${blogPost.title}" è stato aggiornato con successo!</p>
        <p>Categoria: ${blogPost.category}</p>
        <p>Grazie per mantenere aggiornato il tuo contenuto!</p>
    `;

    await sendEmail(
        blogPost.author,
        "Immagine del post aggiornata",
        htmlContent
    );

        res.json(blogPost);

    } catch (err) {
        console.error("Errore durante l'aggiornamento della copertina:", err);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

export default router;