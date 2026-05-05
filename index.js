import express from 'express';
import ejs from 'ejs';

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/adopt', (req, res) => {
    res.render('adopt');
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
