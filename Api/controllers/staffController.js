const Staff = require("../models/staff");
const jwt = require("jsonwebtoken");

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
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            status,
        } = req.body;
        const staff = new Staff({
            staff_id,
            name,
            father_name,
            dob,
            email,
            mobile,
            address,
            qualification,
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            status,
        });
        const newStaff = await staff.save();
        res.json(newStaff);
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
            interview_date,
            join_date,
            designation,
            role,
            schedule,
            status,
        } = req.body;
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
        if (status) {
            staff.status = status;
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
      res.status(500).json(error);  
    }
};

const DeleteStaffController = async (req, res, next) => {
    try {
      const staffId = req.params.id;
      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({ error: 'Staff not found' });
      }
      await staff.deleteOne();
      res.json({ message: 'Staff deleted successfully' });
      next();
    } catch (error) {
        res.status(500).json(error.message);  
    }
};

const GetStaffsController = async (req,res,next) =>{
    try
    {
        const staffs = await Staff.find()
        .populate({path:"role",select:"name salery"});
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

module.exports = {
    CreateStaffController,
    EditStaffController,
    DeleteStaffController,
    GetStaffsController,
    GetStaffController,
    StaffLoginController,
    GetStaffProfileController,
};