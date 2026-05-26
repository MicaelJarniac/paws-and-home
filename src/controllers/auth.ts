import type { RequestHandler } from 'express';
import { Admin } from '../models/index.js';

export const loginPage: RequestHandler = (req, res) => {
  if (req.session.adminId) {
    res.redirect('/admin/');
    return;
  }
  res.render('admin/login');
};

export const loginSubmit: RequestHandler = async (req, res) => {
  const { username, password } = (req.body ?? {}) as { username?: string; password?: string };

  if (!username || !password) {
    req.session.flash = { type: 'danger', message: 'Please enter both username and password.' };
    res.redirect('/admin/login');
    return;
  }

  const admin = await Admin.findOne({ where: { username: username.trim() } });

  if (!admin || !(await admin.checkPassword(password))) {
    req.session.flash = { type: 'danger', message: 'Invalid username or password.' };
    res.redirect('/admin/login');
    return;
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.flash = { type: 'success', message: `Welcome back, ${admin.username}!` };
  res.redirect('/admin/');
};

export const logout: RequestHandler = async (req, res) => {
  await new Promise<void>((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  res.redirect('/admin/login');
};
