import { Pet } from '../models/index.js';

function calculateAgeInYears(birthday) {
  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return Math.max(age, 0);
}

function enrichPet(pet) {
  const plain = pet.get({ plain: true });
  const age = calculateAgeInYears(plain.birthday);

  return {
    ...plain,
    age,
    ageLabel: age === null ? 'Age unknown' : `${age} ${age === 1 ? 'year' : 'years'} old`,
  };
}

export async function homePage(req, res) {
  const pets = await Pet.findAll();
  res.render('home', { pets: pets.map(enrichPet) });
}

export async function adoptPage(req, res) {
  res.render('adopt');
}

export async function privacyPage(req, res) {
  res.render('privacy');
}

export async function termsPage(req, res) {
  res.render('terms');
}
