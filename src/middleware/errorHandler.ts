import type { RequestHandler, ErrorRequestHandler } from 'express';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('[errorMiddleware]', err);
  const status =
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 500;
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(status);
  if (req.accepts('html')) {
    res.render('error', { status, message });
  } else {
    res.json({ status, message });
  }
};
