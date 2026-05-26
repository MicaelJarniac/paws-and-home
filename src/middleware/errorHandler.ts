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
  const rawMessage = err instanceof Error ? err.message : 'Unknown error';
  // For 5xx in production, hide the underlying error from the client — it
  // can leak internals (file paths, query fragments, library traces). 4xx
  // messages are intentional user-facing errors and stay verbatim. Full
  // detail is always preserved in the server log above.
  const isServerError = status >= 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isServerError && isProduction ? 'Internal server error' : rawMessage;
  res.status(status);
  if (req.accepts('html')) {
    res.render('error', { status, message });
  } else {
    res.json({ status, message });
  }
};
