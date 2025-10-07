import onHeaders from 'on-headers'

// Middleware to log response time for each request
export function responseTimeLogger(req, res, next) {
  const startHrTime = process.hrtime.bigint();

  onHeaders(res, () => {
    const endHrTime = process.hrtime.bigint();
    const durationNs = endHrTime - startHrTime;
    const durationMs = Number(durationNs) / 1_000_000; // convert to ms

    const method = req.method;
    const path = req.originalUrl || req.url;
    // Round to 2 decimals for readability
    const roundedMs = Math.round(durationMs * 100) / 100;

    // Basic log to stdout; replace with a logger if present
    console.log(`[RT] ${method} ${path} - ${roundedMs} ms`);
  });

  next();
}

export default responseTimeLogger;

