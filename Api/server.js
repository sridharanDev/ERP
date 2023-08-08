const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const invoiceConreoller = require("./controllers/invoiceController");
const PORT = 8080;



dotenv.config();
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


app.use("/api/staffs/roles",require("./routes/staffRole.route"));
app.use("/api/staffs",require("./routes/staff.route"));
app.use("/api/attendance",require("./routes/attendance.route"));
app.use("/api/projects",require("./routes/project.route"));
app.use("/api/courses",require("./routes/course.route"));
app.use("/api/students",require("./routes/student.route"));
app.use("/api/incomes",require("./routes/income.route"));
app.use("/api/invoices",require("./routes/invoice.route"));
app.use("/api/salaries",require("./routes/saleryDetails.route"));
app.use("/api/admin",require("./routes/admin.route"));
app.use("/api/tasks",require("./routes/task.route"));


app.get("/api/invoice-no",invoiceConreoller.GenerateInvoiceNumberController);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`API running in port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });