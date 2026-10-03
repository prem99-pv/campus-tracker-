const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const VALID_STATUSES = ['Open', 'In Progress', 'Resolved', 'Rejected'];
const VALID_CATEGORIES = ['Infrastructure', 'IT', 'Cleanliness', 'Security', 'Other'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Public
 */
const createComplaint = async (req, res, next) => {
  try {
    const { studentName, email, title, description, category, priority, location } = req.body;
    const missingFields = [];
    if (!studentName || !studentName.trim()) missingFields.push('studentName');
    if (!email || !email.trim()) missingFields.push('email');
    if (!title || !title.trim()) missingFields.push('title');
    if (!description || !description.trim()) missingFields.push('description');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(', ')}`,
      });
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category '${category}'. Allowed categories: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority '${priority}'. Allowed priorities: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    const newComplaint = new Complaint({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      priority: priority || 'Medium',
      location: location && location.trim() ? location.trim() : 'Campus Premises',
      status: 'Open', // Enforce Open status on creation
    });

    const savedComplaint = await newComplaint.save();

    return res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: savedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints with optional filtering and search
 * @route   GET /api/complaints
 * @access  Public
 * @query   status, category, priority, search
 */
const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search, sortBy, order } = req.query;

    const filter = {};

    if (status) {
      const matchedStatus = VALID_STATUSES.find(
        (s) => s.toLowerCase() === status.trim().toLowerCase()
      );
      if (matchedStatus) {
        filter.status = matchedStatus;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter '${status}'. Allowed values: ${VALID_STATUSES.join(', ')}`,
        });
      }
    }

    if (category) {
      const matchedCategory = VALID_CATEGORIES.find(
        (c) => c.toLowerCase() === category.trim().toLowerCase()
      );
      if (matchedCategory) {
        filter.category = matchedCategory;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid category filter '${category}'. Allowed values: ${VALID_CATEGORIES.join(', ')}`,
        });
      }
    }

    if (priority) {
      const matchedPriority = VALID_PRIORITIES.find(
        (p) => p.toLowerCase() === priority.trim().toLowerCase()
      );
      if (matchedPriority) {
        filter.priority = matchedPriority;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid priority filter '${priority}'. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
        });
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: { $regex: searchRegex } },
        { studentName: { $regex: searchRegex } },
      ];
    }

    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    const complaints = await Complaint.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Public
 */
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid complaint ID format: '${id}'`,
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint details
 * @route   PUT /api/complaints/:id
 * @access  Public
 */
const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid complaint ID format: '${id}'`,
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body cannot be empty for update',
      });
    }

    if (req.body.category && !VALID_CATEGORIES.includes(req.body.category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category '${req.body.category}'. Allowed categories: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority '${req.body.priority}'. Allowed priorities: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${req.body.status}'. Allowed values: ${VALID_STATUSES.join(', ')}`,
      });
    }

    if (req.body.createdAt) {
      delete req.body.createdAt;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change complaint status only
 * @route   PATCH /api/complaints/:id/status
 * @access  Public
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid complaint ID format: '${id}'`,
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required in request body',
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value '${status}'. Allowed values are: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to '${status}' successfully`,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a complaint
 * @route   DELETE /api/complaints/:id
 * @access  Public
 */
const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid complaint ID format: '${id}'`,
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
      data: {
        id: complaint._id,
        title: complaint.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
