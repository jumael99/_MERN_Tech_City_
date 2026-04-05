import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';

dotenv.config();

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--admin') args.admin = true;
    else if (a === '--reset') args.reset = true;
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--email') args.email = argv[++i];
    else if (a === '--password') args.password = argv[++i];
    else if (a === '--role') args.role = argv[++i];
    else {
      console.warn(`Unknown arg: ${a}`);
    }
  }
  return args;
}

async function run() {
  const { name, email, password, role, admin, reset } = parseArgs(process.argv);
  if (!name || !email || !password) {
    console.error('Usage: node backend/scripts/createUser.js --name "Name" --email user@example.com --password 123456 [--role seller|user] [--admin] [--reset]');
    process.exit(1);
  }

  await connectDB();

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!reset) {
        console.log(`User already exists: ${email}. Use --reset to update.`);
        process.exit(0);
      }
      user.name = name;
      user.password = password; // will be hashed by pre-save hook
      if (typeof admin === 'boolean') user.isAdmin = admin;
      if (role) user.role = role;
      await user.save();
      console.log(`Updated existing user: ${email}`);
    } else {
      user = new User({
        name,
        email,
        password, // hashed by hook
        isAdmin: !!admin,
        role: role || 'user',
      });
      await user.save();
      console.log(`Created user: ${email} (admin=${!!admin}, role=${user.role})`);
    }
  } catch (err) {
    console.error('Error creating/updating user:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

run();
