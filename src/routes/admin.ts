import { Router, type Request, type Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { loginPage, loginSubmit, logout } from '../controllers/auth.js';
import {
  listPets,
  newPetForm,
  createPet,
  editPetForm,
  updatePet,
  deletePet,
} from '../controllers/pet.js';
import {
  listAdmins,
  newAdminForm,
  createAdmin,
  editAdminForm,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'img', 'pets');

// Ensure upload destination exists before multer first writes to it. Multer
// itself errors out if the directory is missing, and the directory is only
// created as a side effect of `npm run seed:images` — so a deploy that skips
// seeding would otherwise crash on the first pet image upload.
mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Use a server-generated UUID + the validated extension. The fileFilter
  // below restricts to a known image-extension allowlist, so the only
  // attacker-controlled part of the final filename is the extension itself,
  // which is bounded. This blocks path-traversal (`..`, `/`, `\`) and
  // control-character payloads in `file.originalname`.
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.get('/login', asyncHandler(loginPage));
router.post('/login', asyncHandler(loginSubmit));
router.get('/logout', asyncHandler(logout));

router.use(requireAdmin);

router.get('/', (_req: Request, res: Response) => {
  res.render('admin/dashboard');
});

router.get('/pets', asyncHandler(listPets));
router.get('/pets/new', asyncHandler(newPetForm));
router.post('/pets', upload.single('image'), asyncHandler(createPet));
router.get('/pets/:id/edit', asyncHandler(editPetForm));
router.post('/pets/:id', upload.single('image'), asyncHandler(updatePet));
router.post('/pets/:id/delete', asyncHandler(deletePet));

router.get('/admins', asyncHandler(listAdmins));
router.get('/admins/new', asyncHandler(newAdminForm));
router.post('/admins', asyncHandler(createAdmin));
router.get('/admins/:id/edit', asyncHandler(editAdminForm));
router.post('/admins/:id', asyncHandler(updateAdmin));
router.post('/admins/:id/delete', asyncHandler(deleteAdmin));

export default router;
