// Lista di campi che saltano la sanitizzazione
export const SANITIZATION_BLACKLIST = [
  'password',
  'oldPassword',
  'newPassword',
  'confirmPassword',
  'email',
  'id',
  'token',
  'accessToken',
  'refreshToken'
];