import type { RequestHandler } from 'express';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pet } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');

interface PetBody {
  name?: string;
  type?: string;
  species?: string;
  breed?: string;
  birthday?: string;
  description?: string;
  alt?: string;
  status?: string;
}

export const listPets: RequestHandler = async (_req, res) => {
  const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/pets/index', { pets });
};

export const newPetForm: RequestHandler = (_req, res) => {
  res.render('admin/pets/form', { pet: null, isEdit: false });
};

export const createPet: RequestHandler = async (req, res) => {
  const body = (req.body ?? {}) as PetBody;
  const image = req.file ? `/img/pets/${req.file.filename}` : null;

  await Pet.create({
    name: body.name ?? '',
    type: body.type ?? '',
    species: body.species ?? '',
    breed: body.breed ?? '',
    birthday: body.birthday || null,
    description: body.description ?? null,
    image,
    alt: body.alt ?? null,
    status: body.status || 'available',
  });

  req.session.flash = {
    type: 'success',
    message: `Pet "${body.name ?? ''}" created successfully.`,
  };
  res.redirect('/admin/pets');
};

export const editPetForm: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const pet = await Pet.findByPk(id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    res.redirect('/admin/pets');
    return;
  }
  res.render('admin/pets/form', { pet, isEdit: true });
};

export const updatePet: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const pet = await Pet.findByPk(id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    res.redirect('/admin/pets');
    return;
  }

  const body = (req.body ?? {}) as PetBody;

  if (body.name !== undefined) pet.name = body.name;
  if (body.type !== undefined) pet.type = body.type;
  if (body.species !== undefined) pet.species = body.species;
  if (body.breed !== undefined) pet.breed = body.breed;
  pet.birthday = body.birthday || null;
  pet.description = body.description ?? null;
  pet.alt = body.alt ?? null;
  pet.status = body.status || 'available';

  if (req.file) {
    if (pet.image) {
      await unlink(path.join(PUBLIC_DIR, pet.image)).catch(() => {});
    }
    pet.image = `/img/pets/${req.file.filename}`;
  }

  await pet.save();

  req.session.flash = { type: 'success', message: `Pet "${pet.name}" updated successfully.` };
  res.redirect('/admin/pets');
};

export const deletePet: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const pet = await Pet.findByPk(id);
  if (!pet) {
    req.session.flash = { type: 'danger', message: 'Pet not found.' };
    res.redirect('/admin/pets');
    return;
  }

  if (pet.image) {
    await unlink(path.join(PUBLIC_DIR, pet.image)).catch(() => {});
  }

  const petName = pet.name;
  await pet.destroy();

  req.session.flash = { type: 'success', message: `Pet "${petName}" deleted.` };
  res.redirect('/admin/pets');
};
