const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres:daffa09062004@localhost:5432/sipanda_antigravity?schema=public"
JWT_SECRET="secret_key_sipanda_12345_secure"
`;
fs.writeFileSync('.env', content);
console.log('.env updated with new credentials');
