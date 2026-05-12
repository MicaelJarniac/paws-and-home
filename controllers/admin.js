import { Admin } from '../models/index.js';

export async function listAdmins(req, res) {
  const admins = await Admin.findAll({ order: [['createdAt', 'ASC']] });
  res.render('admin/admins/index', { admins });
}

export async function newAdminForm(req, res) {
  res.render('admin/admins/form', { admin: null, isEdit: false });
}

export async function createAdmin(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    req.session.flash = { type: 'danger', message: 'All fields are required.' };
    return res.redirect('/admin/admins/new');
  }

  const existing = await Admin.findOne({ where: { username: username.trim() } });
  if (existing) {
    req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
    return res.redirect('/admin/admins/new');
  }

  await Admin.create({ username: username.trim(), email: email.trim(), password });

  req.session.flash = { type: 'success', message: `Admin "${username}" created successfully.` };
  res.redirect('/admin/admins');
}

export async function editAdminForm(req, res) {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    return res.redirect('/admin/admins');
  }
  res.render('admin/admins/form', { admin, isEdit: true });
}

export async function updateAdmin(req, res) {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    return res.redirect('/admin/admins');
  }

  const { username, email, password } = req.body;

  if (username && username.trim() !== admin.username) {
    const existing = await Admin.findOne({ where: { username: username.trim() } });
    if (existing) {
      req.session.flash = { type: 'danger', message: `Username "${username}" is already taken.` };
      return res.redirect(`/admin/admins/${admin.id}/edit`);
    }
    admin.username = username.trim();
  }

  if (email) admin.email = email.trim();
  if (password) admin.password = password;

  await admin.save();

  req.session.flash = { type: 'success', message: `Admin "${admin.username}" updated.` };
  res.redirect('/admin/admins');
}

export async function deleteAdmin(req, res) {
  if (req.params.id === req.session.adminId) {
    req.session.flash = { type: 'danger', message: 'You cannot delete your own account.' };
    return res.redirect('/admin/admins');
  }

  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    req.session.flash = { type: 'danger', message: 'Admin not found.' };
    return res.redirect('/admin/admins');
  }

  const adminName = admin.username;
  await admin.destroy();

  req.session.flash = { type: 'success', message: `Admin "${adminName}" deleted.` };
  res.redirect('/admin/admins');
}
