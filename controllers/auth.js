import { Admin } from '../models/index.js';

export async function loginPage(req, res) {
  if (req.session.adminId) {
    return res.redirect('/admin/');
  }
  res.render('admin/login');
}

export async function loginSubmit(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    req.session.flash = { type: 'danger', message: 'Please enter both username and password.' };
    return res.redirect('/admin/login');
  }

  const admin = await Admin.findOne({ where: { username: username.trim() } });

  if (!admin || !(await admin.checkPassword(password))) {
    req.session.flash = { type: 'danger', message: 'Invalid username or password.' };
    return res.redirect('/admin/login');
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.flash = { type: 'success', message: `Welcome back, ${admin.username}!` };
  res.redirect('/admin/');
}

export async function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
}
