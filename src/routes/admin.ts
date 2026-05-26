import { Router, type Request, type Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
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
