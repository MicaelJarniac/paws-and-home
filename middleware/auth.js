export function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.session.flash = { type: 'danger', message: 'Please log in to access the admin panel.' };
  res.redirect('/admin/login');
}

export function flashMiddleware(req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
}

export function adminLocals(req, res, next) {
  res.locals.currentAdmin = req.session.adminId
    ? { id: req.session.adminId, username: req.session.adminUsername }
    : null;
  next();
}
