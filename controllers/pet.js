import { Pet } from '../models/index.js';
import { unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

export async function listPets(req, res) {
  const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/pets/index', { pets });
}

export async function newPetForm(req, res) {
  res.render('admin/pets/form', { pet: null, isEdit: false });
}

export async function createPet(req, res) {
  const { name, type, species, breed, birthday, description, alt, status } = req.body;

  const image = req.file ? `/img/pets/${req.file.filename}` : null;

  await Pet.create({ name, type, species, breed, birthday: birthday || null, description, image, alt, status: status || 'available' });

  req.session.flash = { type: 'success', message: `Pet "${name}" created successfully.` };
  res.redirect('/admin/pets');
}

export async function editPetForm(req, res) {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    return res.redirect('/admin/pets');
  }
  res.render('admin/pets/form', { pet, isEdit: true });
}

export async function updatePet(req, res) {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    return res.redirect('/admin/pets');
  }

  const { name, type, species, breed, birthday, description, alt, status } = req.body;

  pet.name = name;
  pet.type = type;
  pet.species = species;
  pet.breed = breed;
  pet.birthday = birthday || null;
  pet.description = description;
  pet.alt = alt;
  pet.status = status || 'available';

  if (req.file) {
    if (pet.image) {
      await unlink(path.join(PUBLIC_DIR, pet.image)).catch(() => {});
    }
    pet.image = `/img/pets/${req.file.filename}`;
  }

  await pet.save();

  req.session.flash = { type: 'success', message: `Pet "${name}" updated successfully.` };
  res.redirect('/admin/pets');
}

export async function deletePet(req, res) {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    return res.redirect('/admin/pets');
  }

  if (pet.image) {
    await unlink(path.join(PUBLIC_DIR, pet.image)).catch(() => {});
  }

  const petName = pet.name;
  await pet.destroy();

  req.session.flash = { type: 'success', message: `Pet "${petName}" deleted.` };
  res.redirect('/admin/pets');
}
