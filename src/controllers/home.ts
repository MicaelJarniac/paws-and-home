import type { RequestHandler } from 'express';
import { Pet } from '../models/index.js';

interface EnrichedPet {
  id: string;
  name: string;
  type: string;
  species: string;
  breed: string;
  birthday: string | null;
  description: string | null;
  image: string | null;
  alt: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  age: number | null;
  ageLabel: string;
}

function calculateAgeInYears(birthday: string | null): number | null {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return Math.max(age, 0);
}

function enrichPet(pet: Pet): EnrichedPet {
  const plain = pet.get({ plain: true }) as Omit<EnrichedPet, 'age' | 'ageLabel'>;
  const age = calculateAgeInYears(plain.birthday);
  return {
    ...plain,
    age,
    ageLabel: age === null ? 'Age unknown' : `${age} ${age === 1 ? 'year' : 'years'} old`,
  };
}

export const homePage: RequestHandler = async (_req, res) => {
  const pets = await Pet.findAll();
  res.render('home', { pets: pets.map(enrichPet) });
};

export const adoptPage: RequestHandler = async (_req, res) => {
  res.render('adopt');
};

export const privacyPage: RequestHandler = async (_req, res) => {
  res.render('privacy');
};

export const termsPage: RequestHandler = async (_req, res) => {
  res.render('terms');
};
