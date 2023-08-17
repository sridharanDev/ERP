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
        if (status === 'lunch in')
        {
            const existingLunchOutAttendance = await Attendance.findOne({
                staff: staff._id,
                status: 'lunch out',
                date: { $gte: currentDay, $lt: new Date(currentDay.getTime() + 86400000) },
            });

            if(!existingLunchOutAttendance)
            {
                return res.status(401).json({ message: `Attendance lunch out recorded not available on this date` });
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
        await Promise.all(attendances.map(async (attendance) => {
            const date = attendance.date.toISOString().split("T")[0];
            if (!staffAttendanceMap.has(date)) {
              staffAttendanceMap.set(date, []);
            }
            
            const dateAttendance = staffAttendanceMap.get(date);
            
            const existingStaffEntry = dateAttendance.find(
              (entry) => entry.staff._id.toString() === attendance.staff._id.toString()
            );
            
            if (!existingStaffEntry) {
              dateAttendance.push({
                staff: attendance.staff,
                date: attendance.date,
                loginTime: null,
                logoutTime: null,
                lunchInTime: null, // Add lunch in time
                lunchOutTime: null, // Add lunch out time
                totalLoginHours: 0,
                lunchBreakHours: 0,
                lateLogin: false,
              });
            }
            
            const staffEntry = dateAttendance.find(
              (entry) => entry.staff._id.toString() === attendance.staff._id.toString()
            );
            
            if(attendance.status === "login")
            {
                if(!staffEntry.loginTime)
                {
                    staffEntry.loginTime = attendance.date;

                    const staff = await Staff.findById(attendance.staff._id).populate("schedule");
                    if (staff && staff.schedule) {
                        const inTime = parseTimeString(staff.schedule.in_time);
                        const loginTime = parseTimeString(attendance.date.toISOString().split("T")[1]);

                        const loginHours = loginTime.getHours();
                        const loginMinutes = loginTime.getMinutes();

                        const inHours = inTime.getUTCHours();
                        const inMinutes = inTime.getUTCMinutes();

                        const isLateLogin = loginHours > inHours || (loginHours === inHours && loginMinutes > inMinutes);

                        if (isLateLogin) {
                            staffEntry.lateLogin = true;
                        }
                    }

                }
            }
            else if(attendance.status === "logout")
            {
                if(!staffEntry.logoutTime)
                {
                    staffEntry.logoutTime = attendance.date;
                }
            }
            else if(attendance.status === "lunch out")
            {
                if(!staffEntry.lunchOutTime)
                {
                    staffEntry.lunchOutTime = attendance.date;
                }
            }
            else if(attendance.status === "lunch in")
            {
                if(!staffEntry.lunchInTime)
                {
                    staffEntry.lunchInTime = attendance.date;
                }
            }
            staffAttendanceMap.forEach((dateAttendance) => {
                dateAttendance.forEach((staffEntry) => {
                  const loginTime = staffEntry.loginTime ? staffEntry.loginTime.getTime() : 0;
                  const logoutTime = staffEntry.logoutTime ? staffEntry.logoutTime.getTime() : 0;
                  const lunchInTime = staffEntry.lunchInTime ? staffEntry.lunchInTime.getTime() : 0;
                  const lunchOutTime = staffEntry.lunchOutTime ? staffEntry.lunchOutTime.getTime() : 0;
              
                  const loginHours = (logoutTime - loginTime) / (1000 * 60 * 60);
                  const lunchBreakHours = (lunchInTime - lunchOutTime) / (1000 * 60 * 60);
                
                  if(loginTime !=0 && logoutTime != 0)
                  {
                      staffEntry.totalLoginHours = (loginHours - lunchBreakHours).toFixed(2);
                      staffEntry.lunchBreakHours = lunchBreakHours.toFixed(2);
                  }
                });
            });   
              
        }));
          
        const staffAttendance = [];
        staffAttendanceMap.forEach((dateAttendance) => {
        staffAttendance.push(...dateAttendance);
        });

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
        const date = req.body.date;
        const attendance = await Attendance.find({staff:staff,date:date});
        res.status(200).json(attendance);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }   
};

const DeleteAttendaceController = async (req, res) => {
    try {
        const staffId = req.params.id; // Assuming staffId is passed as a parameter
        const dateToDelete = req.params.date; // Assuming date is passed as a parameter

        const startOfDay = new Date(dateToDelete);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateToDelete);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.deleteMany({
            staff: staffId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (attendance.deletedCount === 0) {
            return res.status(404).json({ message: "No attendance records found for the given staff and date." });
        }

        res.status(200).json({ message: "Attendance records deleted." });
    } catch (error) {
        res.status(500).json(error.message);
    }
};




function parseTimeString(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    return date;
}


module.exports = {
    AttendanceController,
    GetAttendancesController,
    GetAttendanceController,
    DeleteAttendaceController,
};