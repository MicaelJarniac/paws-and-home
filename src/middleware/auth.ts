import type { RequestHandler } from 'express';

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.session.adminId) {
    next();
    return;
  }
  req.session.flash = { type: 'danger', message: 'Please log in to access the admin panel.' };
  res.redirect('/admin/login');
};

export const flashMiddleware: RequestHandler = (req, res, next) => {
  res.locals.flash = req.session.flash ?? null;
  delete req.session.flash;
  next();
};

export const adminLocals: RequestHandler = (req, res, next) => {
  res.locals.currentAdmin =
    req.session.adminId && req.session.adminUsername
      ? { id: req.session.adminId, username: req.session.adminUsername }
      : null;
  next();
};
