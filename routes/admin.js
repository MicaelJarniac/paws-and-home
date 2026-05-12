import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../middleware/auth.js';
import { loginPage, loginSubmit, logout } from '../controllers/auth.js';
import { listPets, newPetForm, createPet, editPetForm, updatePet, deletePet } from '../controllers/pet.js';
import { listAdmins, newAdminForm, createAdmin, editAdminForm, updateAdmin, deleteAdmin } from '../controllers/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'img', 'pets'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.get('/login', loginPage);
router.post('/login', loginSubmit);
router.get('/logout', logout);

router.use(requireAdmin);

router.get('/', (req, res) => res.render('admin/dashboard'));

router.get('/pets', listPets);
router.get('/pets/new', newPetForm);
router.post('/pets', upload.single('image'), createPet);
router.get('/pets/:id/edit', editPetForm);
router.post('/pets/:id', upload.single('image'), updatePet);
router.post('/pets/:id/delete', deletePet);

router.get('/admins', listAdmins);
router.get('/admins/new', newAdminForm);
router.post('/admins', createAdmin);
router.get('/admins/:id/edit', editAdminForm);
router.post('/admins/:id', updateAdmin);
router.post('/admins/:id/delete', deleteAdmin);

export default router;
