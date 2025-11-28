// __tests__/setup.ts
import supabase from "../src/config/supabase";

beforeAll(async () => {
  // Truncate all tables before test suite
  await supabase.rpc('truncate_tables'); // Create this function in Supabase
});

afterAll(async () => {
  // Clean up after all tests
  await supabase.rpc('truncate_tables');
});