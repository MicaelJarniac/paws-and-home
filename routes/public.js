import { Router } from 'express';
import { homePage, adoptPage, privacyPage, termsPage } from '../controllers/home.js';

const router = Router();

router.get('/', homePage);
router.get('/home', (req, res) => res.redirect('/'));
router.get('/adopt', adoptPage);
router.get('/privacy', privacyPage);
router.get('/terms', termsPage);

export default router;
