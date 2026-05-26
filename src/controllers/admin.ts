import type { RequestHandler } from 'express';
import { Admin } from '../models/index.js';

interface AdminBody {
  username?: string;
  email?: string;
  password?: string;
}

export const listAdmins: RequestHandler = async (_req, res) => {
  const admins = await Admin.findAll({ order: [['createdAt', 'ASC']] });
  res.render('admin/admins/index', { admins });
};

export const newAdminForm: RequestHandler = (_req, res) => {
  res.render('admin/admins/form', { admin: null, isEdit: false });
};

export const createAdmin: RequestHandler = async (req, res) => {
  const { username, email, password } = (req.body ?? {}) as AdminBody;

  if (!username || !email || !password) {
    req.session.flash = { type: 'danger', message: 'All fields are required.' };
    res.redirect('/admin/admins/new');
    return;
  }

  const existing = await Admin.findOne({ where: { username: username.trim() } });
  if (existing) {
    req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
    res.redirect('/admin/admins/new');
    return;
  }

  await Admin.create({ username: username.trim(), email: email.trim(), password });

  req.session.flash = { type: 'success', message: `Admin "${username}" created successfully.` };
  res.redirect('/admin/admins');
};

export const editAdminForm: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const admin = await Admin.findByPk(id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    res.redirect('/admin/admins');
    return;
  }
  res.render('admin/admins/form', { admin, isEdit: true });
};

export const updateAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const admin = await Admin.findByPk(id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    res.redirect('/admin/admins');
    return;
  }

  const { username, email, password } = (req.body ?? {}) as AdminBody;

  if (username && username.trim() !== admin.username) {
    const existing = await Admin.findOne({ where: { username: username.trim() } });
    if (existing) {
      req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
      res.redirect(`/admin/admins/${admin.id}/edit`);
      return;
    }
    admin.username = username.trim();
  }

  if (email) admin.email = email.trim();
  if (password) admin.password = password;

  await admin.save();

  req.session.flash = { type: 'success', message: `Admin "${admin.username}" updated.` };
  res.redirect('/admin/admins');
};

export const deleteAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  if (id === req.session.adminId) {
    req.session.flash = { type: 'danger', message: 'You cannot delete your own account.' };
    res.redirect('/admin/admins');
    return;
  }

  const admin = await Admin.findByPk(id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    res.redirect('/admin/admins');
    return;
  }

  const adminName = admin.username;
  await admin.destroy();

  req.session.flash = { type: 'success', message: `Admin "${adminName}" deleted.` };
  res.redirect('/admin/admins');
};
