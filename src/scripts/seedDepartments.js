// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import Department from '../models/Department.js';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.join(__dirname, '../../.env') });

// const DEPARTMENTS = [
//   { name: 'Hostel & Residential Department', hod: '', budgetAllocated: 0 },
//   { name: 'School/Academic Department', hod: '', budgetAllocated: 0 },
//   { name: 'Hospital/Infirmary (Infirmary Room)', hod: '', budgetAllocated: 0 },
//   { name: 'Sports Department', hod: '', budgetAllocated: 0 },
//   { name: 'Dance & Fine Arts Department', hod: '', budgetAllocated: 0 },
//   { name: 'NCC (National Cadet Corps) Department', hod: '', budgetAllocated: 0 },
//   { name: 'Kitchen & Mess Department', hod: '', budgetAllocated: 0 },
//   { name: 'Computer & Technology Lab', hod: '', budgetAllocated: 0 },
//   { name: 'Network & IT Infrastructure', hod: '', budgetAllocated: 0 },
//   { name: 'Electrical & Maintenance Department', hod: '', budgetAllocated: 0 },
//   { name: 'Construction & Infrastructure Development', hod: '', budgetAllocated: 0 },
//   { name: 'Transport Department', hod: '', budgetAllocated: 0 },
//   { name: 'Cleaning & Housekeeping Department', hod: '', budgetAllocated: 0 },
// ];

// async function seed() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dream-resource-mgmt');
//     const existing = await Department.countDocuments();
//     if (existing > 0) {
//       console.log('Departments already exist. Skipping seed.');
//       process.exit(0);
//       return;
//     }
//     await Department.insertMany(DEPARTMENTS);
//     console.log(`Seeded ${DEPARTMENTS.length} departments.`);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// seed();








import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Department from '../models/Department.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DEPARTMENTS = [
  { name: 'Electrical Department', hod: '', budgetAllocated: 0 },
  { name: 'Transport Department', hod: '', budgetAllocated: 0 },
  // { name: 'IT (Network) Department', hod: '', budgetAllocated: 0 },
  { name: 'Hostel & Residential Department', hod: '', budgetAllocated: 0 },
  { name: 'School/Academic Department', hod: '', budgetAllocated: 0 },
  { name: 'Hospital/Infirmary (Infirmary Room)', hod: '', budgetAllocated: 0 },
  { name: 'Sports Department', hod: '', budgetAllocated: 0 },
  { name: 'Dance & Fine Arts Department', hod: '', budgetAllocated: 0 },
  { name: 'NCC (National Cadet Corps) Department', hod: '', budgetAllocated: 0 },
  { name: 'Kitchen & Mess Department', hod: '', budgetAllocated: 0 },
  { name: 'Computer & Technology Lab', hod: '', budgetAllocated: 0 },
  { name: 'Network & IT Infrastructure', hod: '', budgetAllocated: 0 },
  // { name: 'Electrical & Maintenance Department', hod: '', budgetAllocated: 0 },
  { name: 'Construction & Infrastructure Development', hod: '', budgetAllocated: 0 },
  { name: 'Cleaning & Housekeeping Department', hod: '', budgetAllocated: 0 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dream-resource-mgmt');
    await Department.collection.dropIndex("slug_1").catch(() => console.log("No slug index found, skipping..."));
    // Check if we need to add new ones or if the collection is empty
    const existingCount = await Department.countDocuments();
    
    if (existingCount > 0) {
      console.log('Departments already exist. Checking for missing entries...');
      
      for (const dept of DEPARTMENTS) {
        // upsert: true will add the department if the name doesn't exist
        await Department.updateOne(
          { name: dept.name },
          { $setOnInsert: dept },
          { upsert: true }
        );
      }
      console.log('Sync complete: New departments added without duplicating existing ones.');
    } else {
      await Department.insertMany(DEPARTMENTS);
      console.log(`Seeded ${DEPARTMENTS.length} departments.`);
    }

  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();