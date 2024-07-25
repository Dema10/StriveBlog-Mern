import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/author.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo l'autore basandoci sull'email invece che sull'ID Google
        let author = await Author.findOne({ email: profile.emails[0].value });

        if (!author) {
          // Se l'autore non esiste, ne creiamo uno nuovo
          author = new Author({
            googleId: profile.id,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value,
            dataDiNascita: null,
          });
          await author.save();
        } else if (!author.googleId) {
          // Se l'autore esiste ma non ha un googleId, lo aggiorniamo
          author.googleId = profile.id;
          await author.save();
        }

        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
  
  // Serializzazione dell'utente per la sessione
  // Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
  passport.serializeUser((user, done) => {
    // Memorizziamo solo l'ID dell'utente nella sessione
    done(null, user.id);
  });
  
  // Deserializzazione dell'utente dalla sessione
  // Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
  passport.deserializeUser(async (id, done) => {
    try {
      // Cerchiamo l'utente nel database usando l'ID
      const user = await Author.findById(id);
      // Passiamo l'utente completo al middleware di Passport
      done(null, user);
    } catch (error) {
      // Se si verifica un errore durante la ricerca, lo passiamo a Passport
      done(error, null);
    }
  });
  
  // Esportiamo la configurazione di Passport
  export default passport;