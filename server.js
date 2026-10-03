const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');


dotenv.config();


connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Campus Complaint Tracker API',
    version: '1.0.0',
    documentation: {
      endpoints: {
        'POST   /api/complaints': 'Create a new complaint',
        'GET    /api/complaints': 'Get all complaints (query filters: status, category, priority, search)',
        'GET    /api/complaints/:id': 'Get complaint by ID',
        'PUT    /api/complaints/:id': 'Update complaint details',
        'PATCH  /api/complaints/:id/status': 'Update complaint status only',
        'DELETE /api/complaints/:id': 'Delete complaint',
      },
      validStatuses: ['Open', 'In Progress', 'Resolved', 'Rejected'],
      validCategories: ['Infrastructure', 'IT', 'Cleanliness', 'Security', 'Other'],
      validPriorities: ['Low', 'Medium', 'High'],
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/complaints', complaintRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error('[Error Details]:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field '${err.path}': '${err.value}'`,
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Campus Complaint Tracker API Server Running   `);
  console.log(` Port: ${PORT}                                 `);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base URL: http://localhost:${PORT}            `);
  console.log(`===============================================`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
