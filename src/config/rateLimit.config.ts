export const RATE_LIMIT_CONFIG = {
  // Limite applicato se l'endpoint non è mappato negli overrides
  default: {
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100,                 // limite richieste
    message: "Too many requests from this IP, please try again later."
  },
  // Limiti specifici per endpoint sensibili
  overrides: {
    '/api/v1/auth/login': {
      windowMs: 15 * 60 * 1000,
      max: 5, // Massimo 5 tentativi di login ogni 15 min
      message: "Security alert: Too many login attempts. IP throttled."
    },
    '/api/v1/auth/register': {
      windowMs: 60 * 60 * 1000, // 1 ora
      max: 3,
      message: "Registration limit exceeded."
    }
  }
};