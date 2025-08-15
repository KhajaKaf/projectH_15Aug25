import bcrypt from 'bcrypt';
const pwd = process.argv[2] || 'Admin@123';
const hash = await bcrypt.hash(pwd, 10);
console.log(hash);