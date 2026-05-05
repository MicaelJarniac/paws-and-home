import express from 'express';
import ejs from 'ejs';

const PORT = process.env.PORT || 3000;

const app = express();

// Pet data
const pets = [
  {
    name: 'Buddy',
    type: 'dog',
    breed: 'Dog · Shepherd Mix',
    age: 2,
    description: 'Bright, alert, and full of outdoor energy. Buddy loves long walks, playtime, and staying close to his people.',
    image: '/img/buddy.jpg',
    alt: 'Buddy, a red-and-white shepherd mix on sandy ground looking at the camera',
    status: 'available',
  },
  {
    name: 'Luna',
    type: 'cat',
    breed: 'Cat · Brown Tabby',
    age: 2,
    description: 'Curious and confident, Luna loves to observe everything around her and is always ready for her next little adventure.',
    image: '/img/luna.jpg',
    alt: 'Luna, a tabby cat with green eyes looking alert outdoors',
    status: 'available',
  },
  {
    name: 'Max',
    type: 'dog',
    breed: 'Dog · Terrier Mix',
    age: 1,
    description: 'Smart, watchful, and affectionate once he warms up. Max is a small companion with a big personality.',
    image: '/img/max.jpg',
    alt: 'Max, a small black-and-tan terrier mix with upright ears',
    status: 'pending',
  },
  {
    name: 'Milo',
    type: 'cat',
    breed: 'Cat · Domestic Longhair',
    age: 4,
    description: 'Calm, regal, and very photogenic. Milo enjoys cozy indoor spots and a relaxed daily routine.',
    image: '/img/milo.jpg',
    alt: 'Milo, a fluffy orange long-haired cat resting indoors',
    status: 'available',
  },
  {
    name: 'Daisy',
    type: 'dog',
    breed: 'Dog · Small Poodle Mix',
    age: 3,
    description: 'Playful and joyful, Daisy loves running in open spaces and bringing happy energy wherever she goes.',
    image: '/img/daisy.jpg',
    alt: 'Daisy, a small fluffy white dog running joyfully across a grassy field',
    status: 'available',
  },
  {
    name: 'Cinnamon',
    type: 'rabbit',
    breed: 'Rabbit · Dwarf Mix',
    age: 1,
    description: 'Soft, gentle, and curious. Cinnamon is a sweet little rabbit who enjoys calm spaces and gentle handling.',
    image: '/img/cinnamon.jpg',
    alt: 'Cinnamon, a small white rabbit with upright ears on a white background',
    status: 'available',
  },
];

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home', { pets });
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
