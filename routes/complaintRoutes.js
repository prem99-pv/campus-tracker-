const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');

router.route('/')
  .post(createComplaint)
  .get(getAllComplaints);


router.route('/:id/status')
  .patch(updateComplaintStatus);


router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint)
  .delete(deleteComplaint);

module.exports = router;
