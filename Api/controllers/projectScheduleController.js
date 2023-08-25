const Schedule = require("../models/projectSchedule");

const CreateScheduleController = async (req,res,next) =>{
    try
    {
        const {
            title,
            description,
            project,
            date,
            time,
        } = req.body;
        const schedule = new Schedule({
            title,
            description,
            project,
            date,
            time,
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
        const {
            title,
            description,
            project,
            date,
            time,
        } = req.body;
        const schedule = await Schedule.findById(req.params.id);
        if(!schedule)
        {
            return res.status(404).json({message:"schedule not found"});
        }
        if(title) schedule.title = title;
        if(description) schedule.description = description;
        if(project) schedule.project = project;
        if(date) schedule.date = date;
        if(time) schedule.time = time;
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
        const schedules = await Schedule.find()
        .populate("project");
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
        const schedule = await Schedule.findById(req.params.id)
        .populate("project");
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