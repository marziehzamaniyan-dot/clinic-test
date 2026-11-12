import { defineConfig } from 'drizzle-kit';

const sqlHost = process.env.SQL_HOST || '/cloudsql/optical-karst-5vr20:us-west2:ai-studio-036a630d';
const sqlDbName = process.env.SQL_DB_NAME || 'postgres';
const user = process.env.SQL_ADMIN_USER || 'postgres';
const password = process.env.SQL_ADMIN_PASSWORD || '';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: false,
  },
  verbose: true,
});
