const Schedule = require("../models/schedule");

const CreateScheduleController = async (req,res,next) =>{
    try
    {
        const {in_time,out_time} = req.body;
        const schedule = new Schedule({
            in_time,
            out_time
        });
        const newSchedule = await schedule.save();
        res.status(200).json(newSchedule);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditScheduleController = async (req,res,next) =>{
    try
    {
        const {in_time,out_time} = req.body;
        const schedule = await Schedule.findById(req.params.id);
        if(!schedule)
        {
            return res.status(404).json({message:"schedule not found"});
        }
        if(in_time) schedule.in_time = in_time;
        if(out_time) schedule.out_time = out_time;
        const updatedSchedule = await schedule.save();
        res.status(200).json(updatedSchedule);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteScheduleController = async (req,res,next) =>{
    try
    {
        const schedule = await Schedule.findById(req.params.id);
        if(!schedule)
        {
            return res.status(404).json({message:"schedule not found"});
        }
        const deletedSchedule = await schedule.deleteOne();
        res.status(200).json(deletedSchedule);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetSchedulesController = async (req,res,next) =>{
    try
    {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetScheduleController = async (req,res,next) =>{
    try
    {
        const schedule = await Schedule.findById(req.params.id);
        if(!schedule)
        {
            return res.status(404).json({message:"schedule not found"});
        }
        res.status(200).json(schedule);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateScheduleController,
    EditScheduleController,
    DeleteScheduleController,
    GetSchedulesController,
    GetScheduleController,
}