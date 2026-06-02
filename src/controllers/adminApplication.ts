import type { RequestHandler } from 'express';
import { Application } from '../models/index.js';
import { adminApplicationStatusSchema } from '../shared/adminApplicationSchema.js';

export const listApplications: RequestHandler = async (_req, res) => {
  const applications = await Application.findAll({
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/applications/index', { applications });
};

export const showApplication: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const application = await Application.findByPk(id);
  if (!application) {
    req.session.flash = { type: 'danger', message: 'Application not found.' };
    res.redirect('/admin/applications');
    return;
  }
  res.render('admin/applications/show', { application });
};

export const updateApplicationStatus: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const application = await Application.findByPk(id);
  if (!application) {
    req.session.flash = { type: 'danger', message: 'Application not found.' };
    res.redirect('/admin/applications');
    return;
  }

  const parsed = adminApplicationStatusSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const firstMessage =
      parsed.error.issues[0]?.message ?? 'Invalid status.';
    req.session.flash = { type: 'danger', message: firstMessage };
    res.redirect(`/admin/applications/${application.id}`);
    return;
  }

  application.status = parsed.data.status;
  await application.save();

  req.session.flash = {
    type: 'success',
    message: `Application status updated to "${application.status}".`,
  };
  res.redirect(`/admin/applications/${application.id}`);
};

export const deleteApplication: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const application = await Application.findByPk(id);
  if (!application) {
    req.session.flash = { type: 'danger', message: 'Application not found.' };
    res.redirect('/admin/applications');
    return;
  }

  const applicantName = application.fullName;
  await application.destroy();

  req.session.flash = {
    type: 'success',
    message: `Application from "${applicantName}" deleted.`,
  };
  res.redirect('/admin/applications');
};
