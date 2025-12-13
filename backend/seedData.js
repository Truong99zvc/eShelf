import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import Book from './models/Book.js';
import Genre from './models/Genre.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read book data from frontend JSON
const loadBookData = () => {
  try {
    const bookDetailsPath = path.join(__dirname, '../src/data/book-details.json');
    const data = fs.readFileSync(bookDetailsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading book data:', error.message);
    return [];
  }
};

// Read genres from frontend JSON
const loadGenresData = () => {
  try {
    const genresPath = path.join(__dirname, '../src/data/genres.json');
    const data = fs.readFileSync(genresPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading genres data:', error.message);
    return [];
  }
};

// Create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Seed database
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Book.deleteMany({});
    await Genre.deleteMany({});

    // Seed genres
    console.log('📂 Seeding genres...');
    const genresData = loadGenresData();
    const genres = genresData.map((name) => ({
      name,
      slug: createSlug(name),
      bookCount: 0,
    }));
    await Genre.insertMany(genres);
    console.log(`   ✅ Inserted ${genres.length} genres`);

    // Seed books
    console.log('📚 Seeding books...');
    const booksData = loadBookData();
    
    // Add random stats to books and rename 'language' to 'bookLanguage'
    const booksWithStats = booksData.map((book) => {
      const { language, ...rest } = book;
      return {
        ...rest,
        bookLanguage: language || 'Tiếng Việt',
        viewCount: Math.floor(Math.random() * 1000),
        downloadCount: Math.floor(Math.random() * 500),
        favoriteCount: Math.floor(Math.random() * 200),
      };
    });

    await Book.insertMany(booksWithStats);
    console.log(`   ✅ Inserted ${booksWithStats.length} books`);

    // Update genre book counts
    console.log('📊 Updating genre book counts...');
    for (const genre of genresData) {
      const count = await Book.countDocuments({ genres: genre });
      await Genre.updateOne({ name: genre }, { bookCount: count });
    }
    console.log('   ✅ Updated genre counts');

    // Create admin user if not exists
    console.log('👤 Creating admin user...');
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@eshelf.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('   ✅ Admin user created (username: admin, password: Admin@123)');
    } else {
      console.log('   ℹ️  Admin user already exists');
    }

    // Create test user if not exists
    console.log('👤 Creating test user...');
    const testUserExists = await User.findOne({ username: 'testuser' });
    if (!testUserExists) {
      await User.create({
        username: 'testuser',
        email: 'test@eshelf.com',
        password: 'Test@123',
        role: 'user',
      });
      console.log('   ✅ Test user created (username: testuser, password: Test@123)');
    } else {
      console.log('   ℹ️  Test user already exists');
    }

    console.log('\n🎉 Database seeded successfully!\n');

    console.log('═══════════════════════════════════════════');
    console.log('   Database Summary:');
    console.log('═══════════════════════════════════════════');
    console.log(`   📚 Books: ${await Book.countDocuments()}`);
    console.log(`   📂 Genres: ${await Genre.countDocuments()}`);
    console.log(`   👤 Users: ${await User.countDocuments()}`);
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Clear database
const clearDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing all data...');
    await Book.deleteMany({});
    await Genre.deleteMany({});
    await User.deleteMany({});

    console.log('✅ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
};

// Run based on command line argument
const arg = process.argv[2];

if (arg === '--clear' || arg === '-c') {
  clearDatabase();
} else {
  seedDatabase();
}
