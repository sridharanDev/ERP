const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['login', 'break out', 'break in', 'logout'], required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
