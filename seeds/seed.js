const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Complaint = require('../models/Complaint');

dotenv.config();

const sampleComplaints = [
  {
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    title: 'Broken Projector in Lecture Hall 3B',
    description: 'The ceiling projector flickers constantly and shuts down every 10 minutes during classes.',
    category: 'Infrastructure',
    priority: 'High',
    location: 'Science Block, Room 3B',
    status: 'Open',
  },
  {
    studentName: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    title: 'Wi-Fi Connection Dropping in Library 2nd Floor',
    description: 'Students on the 2nd floor library reading zone cannot access the campus Wi-Fi network.',
    category: 'IT',
    priority: 'Medium',
    location: 'Central Library, 2nd Floor',
    status: 'In Progress',
  },
  {
    studentName: 'Rohan Verma',
    email: 'rohan.verma@campus.edu',
    title: 'Water Cooler Leakage near Cafeteria',
    description: 'The drinking water cooler is leaking continuously creating a slipping hazard on the corridor floor.',
    category: 'Cleanliness',
    priority: 'Low',
    location: 'Main Cafeteria Corridor',
    status: 'Resolved',
  },
  {
    studentName: 'Neha Gupta',
    email: 'neha.gupta@campus.edu',
    title: 'Gate 4 Streetlight Not Functioning at Night',
    description: 'The streetlight outside pedestrian Gate 4 is completely off, causing safety concerns for evening students.',
    category: 'Security',
    priority: 'High',
    location: 'Pedestrian Exit Gate 4',
    status: 'Rejected',
  },
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_complaints';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing complaints
    await Complaint.deleteMany({});
    console.log('[Seed] Cleared existing complaints');

    // Insert sample complaints
    const createdComplaints = await Complaint.insertMany(sampleComplaints);
    console.log(`[Seed] Successfully inserted ${createdComplaints.length} sample complaints:`);
    createdComplaints.forEach((c) => {
      console.log(` - [${c.category} | ${c.priority} | ${c.status}] ${c.title} (ID: ${c._id})`);
    });

    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
