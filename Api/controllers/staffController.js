const Staff = require("../models/staff");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const fs = require('fs');

const CreateStaffController = async (req,res,next) =>{
    try 
    {
        const {staff_id,
            name,
            father_name,
            dob,
            email,
            mobile,
            address,
            qualification,
            skills,
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            status,
        } = req.body;
        const password = generatePassword(name,dob);
        const HashedPassword = await bcrypt.hash(password,10);

        const attachments = [];
        if(req.files)
        {
            for (const file of req.files) {
                attachments.push(file.filename);
            }
        }

        const staff = new Staff({
            staff_id,
            name,
            father_name,
            dob,
            email,
            mobile,
            address,
            qualification,
            skills,
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            password : HashedPassword,
            status,
            attachments,
        });
        const newStaff = await staff.save();
        res.json(newStaff);
        next();
    } 
    catch (error) 
    {
        if (req.files)
        {
            for (const file of req.files) {
                fs.unlinkSync(`uploads/${file.filename}`);
            }
        }
        if(error.code == 11000)
        {
            if(error.keyValue.email)
            {
                return res.status(401).json({field:"email",error:"This email ID already taken."});
            }
            else if(error.keyValue.mobile)
            {
                return res.status(401).json({field:"mobile",error:"This mobile number already taken."});
            }
            
        }
      res.status(500).json(error);  
    }
};

const EditStaffController = async (req,res,next) =>{
    try 
    {
        const {staff_id,
            name,
            father_name,
            dob,
            email,
            mobile,
            address,
            qualification,
            skills,
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            password,
            status,
        } = req.body;
        let HashedPassword = null;
        if(password)
            HashedPassword = await bcrypt.hash(password,10);
        const staff = await Staff.findById(req.params.id)
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
          }
        if (staff_id) {
            staff.staff_id = staff_id;
        }
        if (name) {
            staff.name = name;
        }
        if (father_name) {
            staff.father_name = father_name;
        }
        if (dob) {
            staff.dob = dob;
        }
        if (email) {
            staff.email = email;
        }
        if (mobile) {
            staff.mobile = mobile;
        }
        if (address) {
            staff.address = address;
        }
        if (qualification) {
            staff.qualification = qualification;
        }
        if (skills) {
            staff.skills = skills;
        }
        if (interview_date) {
            staff.interview_date = interview_date;
        }
        if (join_date) {
            staff.join_date = join_date;
        }
        if (designation) {
            staff.designation = designation;
        }
        if (role) {
            staff.role = role;
        }
        if (schedule) {
            staff.schedule = schedule;
        }
        if (password) {
            staff.password = HashedPassword;
        }
        if (status) {
            staff.status = status;
        }
        if (req.files)
        {
            const oldFiles = staff.attachments;
            staff.attachments = [];
            for (const file of oldFiles) {
                fs.unlinkSync(`uploads/${file}`);
            }
            for (const file of req.files) {
                staff.attachments.push(file.filename);
            }

        }
        const editedStaff = await staff.save();
        res.json(editedStaff);
        next();
    } 
    catch (error) 
    {
        if(error.code == 11000)
        {
            if(error.keyValue.email)
            {
                return res.status(401).json({field:"email",error:"This email ID already taken."});
            }
            else if(error.keyValue.mobile)
            {
                return res.status(401).json({field:"mobile",error:"This mobile number already taken."});
            }
            
        }
      res.status(500).json(error.message);  
    }
};

const DeleteStaffController = async (req, res, next) => {
    try 
    {
        const staffId = req.params.id;
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        await staff.deleteOne();
        if (staff.attachments)
        {
            for (const file of staff.attachments) 
            {
                fs.unlinkSync(`uploads/${file}`);
            }
        }
        res.json({ message: 'Staff deleted successfully' });
        next();
    } 
    catch (error) 
    {
        res.status(500).json(error.message);  
    }
};

const GetStaffsController = async (req,res,next) =>{
    try
    {
        const staffs = await Staff.find()
        .populate({path:"role",select:"name salery"})
        .populate("schedule");
        res.json(staffs);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message); 
    }
};

const GetStaffController = async (req,res,next) =>{
    try
    {
        const staff = await Staff.findOne({staff_id:req.params.id})
        .populate({path:"role",select:"name salery"});
        if(!staff)
        {
            return res.status(404).json({message:"staff not found."});
        }
        res.json(staff);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message); 
    }
};

const StaffLoginController = async (req,res,next) =>{
    try
    {
        const { staff_id, password } = req.body;   
        const staff = await Staff.findOne({ staff_id });
        if (!staff) {
            return res.status(401).json({ field: "staff_id", error: "Invalid staff ID" });
        }
        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            return res.status(401).json({ field: "password", error: "Invalid password" });
        }
        const token = jwt.sign({ _id: staff._id }, process.env.JWT_SECRET);
        res.status(200).json({ token:token,staff_id:staff.staff_id });
    }
    catch(error)
    {
        res.status(500).json(error.message); 
    }
};

const GetStaffProfileController = async (req,res,next) =>{
    try
    {
        const staff = await Staff.findById(req.params.id)
        .populate({path:"role",select:"name salery"})
        .populate("schedule");
        if(!staff)
        {
            return res.status(404).json({message:"staff not found."});
        }
        res.json(staff);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message); 
    }
};

function generatePassword(username, dob) {
    const year = dob.split('-')[0];
    const cleanedUsername = username.replace(/\s/g, '');
    const password = cleanedUsername + year;
  
    return password;
};

module.exports = {
    CreateStaffController,
    EditStaffController,
    DeleteStaffController,
    GetStaffsController,
    GetStaffController,
    StaffLoginController,
    GetStaffProfileController,
};