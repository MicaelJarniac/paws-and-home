'use strict';

// MUST stay .cjs — sequelize-cli v6 loads each seeder via require()
// (CJS only). Because package.json declares "type": "module", a .js
// extension would force ESM parsing and break with "module is not defined
// in ES module scope". See README "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

const { randomUUID } = require('node:crypto');

const PETS = [
  {
    name: 'Buddy',
    type: 'dog',
    species: 'Dog',
    breed: 'Shepherd Mix',
    birthday: '2023-05-10',
    description:
      'Bright, alert, and full of outdoor energy. Buddy loves long walks, playtime, and staying close to his people.',
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
    description:
      'Curious and confident, Luna loves to observe everything around her and is always ready for her next little adventure.',
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
    description:
      'Smart, watchful, and affectionate once he warms up. Max is a small companion with a big personality.',
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
    description:
      'Calm, regal, and very photogenic. Milo enjoys cozy indoor spots and a relaxed daily routine.',
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
    description:
      'Playful and joyful, Daisy loves running in open spaces and bringing happy energy wherever she goes.',
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
    description:
      'Soft, gentle, and curious. Cinnamon is a sweet little rabbit who enjoys calm spaces and gentle handling.',
    image: 'cinnamon.jpg',
    alt: 'Cinnamon, a small white rabbit with upright ears on a white background',
    status: 'available',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'Pets',
      PETS.map((p) => ({
        id: randomUUID(),
        name: p.name,
        type: p.type,
        species: p.species,
        breed: p.breed,
        birthday: p.birthday,
        description: p.description,
        image: `/img/pets/${p.image}`,
        alt: p.alt,
        status: p.status,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Pets', {
      name: PETS.map((p) => p.name),
    });
  },
};
