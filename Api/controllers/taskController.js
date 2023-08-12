const Task = require("../models/task");
const Comment = require("../models/taskComment");

const CreateTaskController = async (req,res,next)=>{
    try
    {
        const {title,description,project,staff} = req.body;
        const task = new Task({
            title,
            description,
            project,
            staff
        });
        const newTask = await task.save();
        res.status(200).json(newTask);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const EditTaskController = async (req,res,next)=>{
    try
    {
        const {title,description,project,staff,status} = req.body;
        const task = await Task.findById(req.params.id);
        if(title) task.title = title;
        if(description) task.description = description;
        if(project) task.project = project;
        if(staff) task.staff = staff;
        if(status) task.status = status;
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteTaskController = async (req,res,next)=>{
    try
    {
        const task = await Task.findById(req.params.id);
        if(!task)
        {
            return res.status(404).json({message:"task not found."});
        }
        await task.deleteOne();
        await Comment.deleteMany({task:task._id});
        res.status(200).json({message:"task deleted."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetTasksController = async (req,res,next)=>{
    try
    {
        var filter = {};
        const query = req.query;
        if(query)
        {
            for(const key in query)
            {
                filter[key] = query[key];
            }
        }
        const tasks = await Task.find(filter)
        .populate("project")
        .populate({path:"staff",select:"name staff_id"});
        res.status(200).json(tasks);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetTaskController = async (req,res,next)=>{
    try
    {
        const task = await Task.findById(req.params.id)
        .populate("project")
        .populate({path:"staff",select:"name staff_id"});
        if(!task)
        {
            return res.status(404).json({message:"task not found."});
        }
        res.status(200).json(task);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateTaskController,
    EditTaskController,
    DeleteTaskController,
    GetTasksController,
    GetTaskController,
}