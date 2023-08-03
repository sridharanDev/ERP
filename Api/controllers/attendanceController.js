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
              return res.json({ message: `Attendance not recorded as login for this date. Cannot record ${status} without login` });
            }
        }
        
        const existingAttendance = await Attendance.findOne({
            staff: staff._id,
            date: { $gte: currentDay, $lt: new Date(currentDay.getTime() + 86400000) },
            status: status,
        });
        
        if (existingAttendance) {
            return res.json({ message: `Attendance already recorded as ${status} for this date` });
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

const GetAttendanceController = async (req,res,next) => {
    try
    {
        const { staff_id, status } = req.body;
        const {q,date} = req.query;
        
        const staff = await Staff.findOne({staff_id:staff_id});
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        
        if(q == "time")
        {
            
            const currentDate = new Date();
            var currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

            if(date)
            {
                const [day, month, year] = date.split('/');
                currentDay = new Date(`${year}-${month}-${day}`);
            }

            const attendance = await Attendance.find({
                staff: staff._id,
                date: { $gte: currentDay, $lt: new Date(currentDay.getTime() + 86400000) },
            });
            let totalLoginHours = 0;
            let loginTime = null;
            let breakStartTime = null;
            let breakTime = 0;

            attendance.forEach((entry) => {
                if (entry.status === 'login') {
                  loginTime = entry.date;
                } else if (entry.status === 'logout') {
                  if (loginTime) {
                    totalLoginHours += entry.date - loginTime - breakTime;
                    loginTime = null;
                  }
                } else if (entry.status === 'break out') {
                  if (loginTime) {
                    breakStartTime = entry.date;
                  }
                } else if (entry.status === 'break in') {
                  if (loginTime && breakStartTime) {
                    breakTime += entry.date - breakStartTime;
                    breakStartTime = null;
                  }
                }
            });
            if (loginTime && (currentDate.toISOString().split("T")[0] == loginTime.toISOString().split("T")[0])) 
            {
                logoutTime = currentDate;
                totalLoginHours += logoutTime - loginTime - breakTime;
            } 
            else if (loginTime) 
            {
                const endOfDay = new Date(currentDay.getTime() + 86400000 - 1);
                totalLoginHours += endOfDay - loginTime - breakTime;
            }
            res.status(200).json({totalLoginHours,totalBreakTime:breakTime});
        }
        else if(date)
        {
            
            const [day, month, year] = date.split('/');
            const isoDate = new Date(`${year}-${month}-${day}`);
            
            const attendance = await Attendance.find({
                staff: staff._id,
                date: { $gte: isoDate, $lt: new Date(isoDate.getTime() + 86400000) },
            });       
            
            res.status(200).json(attendance);
        }
        else
        {
            const attendance = await Attendance.find({
                staff: staff._id,
            });
            res.status(200).json(attendance);
        }
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }   
};

module.exports = {
    AttendanceController,
    GetAttendanceController,
};