import { Router } from 'express';
import { homePage, adoptPage, privacyPage, termsPage } from '../controllers/home.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(homePage));
router.get('/home', (_req, res) => {
  res.redirect('/');
});
router.get('/adopt', asyncHandler(adoptPage));
router.get('/privacy', asyncHandler(privacyPage));
router.get('/terms', asyncHandler(termsPage));

export default router;
