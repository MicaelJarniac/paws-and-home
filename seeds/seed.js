import { copyFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Admin, Pet } from '../models/index.js';
import sequelize from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_IMG_DIR = path.join(__dirname, 'img');
const DEST_IMG_DIR = path.join(__dirname, '..', 'public', 'img', 'pets');

const PETS = [
  {
    name: 'Buddy',
    type: 'dog',
    species: 'Dog',
    breed: 'Shepherd Mix',
    birthday: '2023-05-10',
    description: 'Bright, alert, and full of outdoor energy. Buddy loves long walks, playtime, and staying close to his people.',
    image: 'buddy.jpg',
    alt: 'Buddy, a red-and-white shepherd mix on sandy ground looking at the camera',
    status: 'available',
  },
  {
    name: 'Luna',
    type: 'cat',
    species: 'Cat',
    breed: 'Brown Tabby',
    birthday: '2023-08-22',
    description: 'Curious and confident, Luna loves to observe everything around her and is always ready for her next little adventure.',
    image: 'luna.jpg',
    alt: 'Luna, a tabby cat with green eyes looking alert outdoors',
    status: 'available',
  },
  {
    name: 'Max',
    type: 'dog',
    species: 'Dog',
    breed: 'Terrier Mix',
    birthday: '2024-11-03',
    description: 'Smart, watchful, and affectionate once he warms up. Max is a small companion with a big personality.',
    image: 'max.jpg',
    alt: 'Max, a small black-and-tan terrier mix with upright ears',
    status: 'pending',
  },
  {
    name: 'Milo',
    type: 'cat',
    species: 'Cat',
    breed: 'Domestic Longhair',
    birthday: '2021-03-14',
    description: 'Calm, regal, and very photogenic. Milo enjoys cozy indoor spots and a relaxed daily routine.',
    image: 'milo.jpg',
    alt: 'Milo, a fluffy orange long-haired cat resting indoors',
    status: 'available',
  },
  {
    name: 'Daisy',
    type: 'dog',
    species: 'Dog',
    breed: 'Small Poodle Mix',
    birthday: '2022-09-01',
    description: 'Playful and joyful, Daisy loves running in open spaces and bringing happy energy wherever she goes.',
    image: 'daisy.jpg',
    alt: 'Daisy, a small fluffy white dog running joyfully across a grassy field',
    status: 'available',
  },
  {
    name: 'Cinnamon',
    type: 'rabbit',
    species: 'Rabbit',
    breed: 'Dwarf Mix',
    birthday: '2024-04-20',
    description: 'Soft, gentle, and curious. Cinnamon is a sweet little rabbit who enjoys calm spaces and gentle handling.',
    image: 'cinnamon.jpg',
    alt: 'Cinnamon, a small white rabbit with upright ears on a white background',
    status: 'available',
  },
];

async function seed() {
  await sequelize.authenticate();

  const existingAdmin = await Admin.findOne({ where: { username: 'admin' } });
  if (!existingAdmin) {
    await Admin.create({
      username: 'admin',
      email: 'admin@pawsandhome.org',
      password: 'admin123',
    });
    console.log('Admin account created — admin / admin123');
  } else {
    console.log('Admin account already exists, skipping.');
  }

  const petCount = await Pet.count();
  if (petCount === 0) {
    for (const pet of PETS) {
      await copyFile(
        path.join(SEED_IMG_DIR, pet.image),
        path.join(DEST_IMG_DIR, pet.image),
      );
    }
    console.log('Seed images copied to public/img/pets/.');

    await Pet.bulkCreate(
      PETS.map((pet) => ({ ...pet, image: `/img/pets/${pet.image}` })),
    );
    console.log('6 pets seeded.');
  } else {
    console.log(`${petCount} pets already exist, skipping.`);
  }

  console.log('Seed complete.');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => { console.error('Seed failed:', err); process.exit(1); });
