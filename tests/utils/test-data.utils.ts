// tests/utils/test-data.utils.ts

/**
 * Memorizza le email create durante i test per eventuali cleanup massivi
 */
export const createdEmails: string[] = [];

/**
 * Genera un set di credenziali utente mock univoche
 */
export const generateMockUser = () => {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const email = `test_${uniqueId}@example.com`;
  
  createdEmails.push(email);

  return {
    email,
    password: 'Password123!',
  };
};

/**
 * Genera dati mock per un Publisher
 */
export const generateMockPublisher = () => ({
  name: `Publisher_${Math.floor(Math.random() * 10000)}`,
  description: 'Questa è una descrizione di test per il publisher.',
  type: 'newspaper',
  website_url: 'https://test-publisher.com',
  profile_image_url: 'https://test-publisher.com/logo.png'
});