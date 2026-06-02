import type { RequestHandler } from 'express';
import { Admin } from '../models/index.js';
import { adminCreateSchema, adminUpdateSchema } from '../shared/adminSchema.js';

export const listAdmins: RequestHandler = async (_req, res) => {
  const admins = await Admin.findAll({ order: [['createdAt', 'ASC']] });
  res.render('admin/admins/index', { admins });
};

export const newAdminForm: RequestHandler = (_req, res) => {
  res.render('admin/admins/form', { admin: null, isEdit: false });
};

export const createAdmin: RequestHandler = async (req, res) => {
  const parsed = adminCreateSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const firstMessage =
      parsed.error.issues[0]?.message ?? 'All fields are required.';
    req.session.flash = { type: 'danger', message: firstMessage };
    res.redirect('/admin/admins/new');
    return;
  }
  const { username, email, password } = parsed.data;

  const existing = await Admin.findOne({ where: { username } });
  if (existing) {
    req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
    res.redirect('/admin/admins/new');
    return;
  }

  await Admin.create({ username, email, password });

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

  const parsed = adminUpdateSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const firstMessage =
      parsed.error.issues[0]?.message ?? 'Invalid input.';
    req.session.flash = { type: 'danger', message: firstMessage };
    res.redirect(`/admin/admins/${admin.id}/edit`);
    return;
  }
  const { username, email, password } = parsed.data;

  if (username !== admin.username) {
    const existing = await Admin.findOne({ where: { username } });
    if (existing) {
      req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
      res.redirect(`/admin/admins/${admin.id}/edit`);
      return;
    }
    admin.username = username;
  }

  admin.email = email;
  if (password !== undefined) admin.password = password;

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
