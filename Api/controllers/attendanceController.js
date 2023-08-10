const Staff = require("../models/staff");
const Attendance = require("../models/attendance");

const AttendanceController = async (req,res,next) =>{

    try
    {
        const { staff_id, status } = req.body;
        const staff = await Staff.findOne({staff_id:staff_id});
        if (!staff) {
        return res.status(404).json({ error: 'Staff not found' });
        }
        const currentDate = new Date();
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        if (status !== 'login') {
            const existingLoginAttendance = await Attendance.findOne({
              staff: staff._id,
              status: 'login',
              date: { $gte: currentDay, $lt: new Date(currentDay.getTime() + 86400000) },
            });
        
            if (!existingLoginAttendance) {
              return res.status(401).json({ message: `Attendance not recorded as login for this date. Cannot record ${status} without login` });
            }
        }
        
        const existingAttendance = await Attendance.findOne({
            staff: staff._id,
            date: { $gte: currentDay, $lt: new Date(currentDay.getTime() + 86400000) },
            status: status,
        });
        
        if (existingAttendance) {
            return res.status(401).json({ message: `Attendance already recorded as ${status} for this date` });
        }
        
        const attendance = new Attendance({
            staff: staff._id,
            date: currentDate,
            status,
        });
        
        await attendance.save();
    
        res.json({ message: 'Attendance recorded successfully' });
    }
    catch(error)
    {
        res.status(500).json(error);
    }   

};

const GetAttendancesController = async (req,res,next) => 
{
    try
    {
        const attendances = await Attendance.find().populate({path:"staff",select : "name staff_id"});

        const staffAttendanceMap = new Map();
        attendances.forEach((attendance) => {
            const staffId = attendance.staff._id.toString();
      
            if (!staffAttendanceMap.has(staffId)) {
              staffAttendanceMap.set(staffId, {
                _id:attendance._id,
                staff: attendance.staff,
                date: attendance.date,
                loginTime: null,
                logoutTime: null,
                totalLoginHours: 0,
              });
            }
      
            if (attendance.status === "login") 
            {
              staffAttendanceMap.get(staffId).loginTime = attendance.date;
            } 
            else if (attendance.status === "logout") 
            {
                const staffEntry = staffAttendanceMap.get(staffId);
                if (staffEntry.loginTime) {
                    const loginTime = staffEntry.loginTime.getTime();
                    const logoutTime = attendance.date.getTime();
                    const loginHours = (logoutTime - loginTime) / (1000 * 60 * 60); // Calculate login hours
                    staffEntry.totalLoginHours += loginHours;
                    staffEntry.totalLoginHours = Number(staffEntry.totalLoginHours.toFixed(2)); // Round to 2 decimal places
                    staffEntry.logoutTime = attendance.date;
                }
            }
        });
        const staffAttendance = Array.from(staffAttendanceMap.values());

        res.status(200).json(staffAttendance);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    } 
}

const GetAttendanceController = async (req,res,next) => {
    try
    {
        const staff = req.params.id;
        const attendance = await Attendance.find({staff:staff});
        res.status(200).json(attendance);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }   
};

const DeleteAttendaceController = async (req,res)=>
{
    try
    {
        const attendance = await Attendance.findById(req.params.id);
        if(!attendance)
        {
            return res.status(404).json({message:"attendance not found."});
        }
        await attendance.deleteOne();
        res.status(200).json({message:"attendance deleted."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    AttendanceController,
    GetAttendancesController,
    GetAttendanceController,
    DeleteAttendaceController,
};