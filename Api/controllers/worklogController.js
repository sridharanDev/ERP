const Worklog = require("../models/worklog");

const CreateWorklogController = async (req,res,next)=>{
    try
    {
        const {title,description,staff} = req.body;
        const worklog = new Worklog({
            title,
            description,
            staff
        });
        const newWorklog = await worklog.save();
        res.status(200).json(newWorklog);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const EditWorklogController = async (req,res,next)=>{
    try
    {
        const {title,description,staff,status} = req.body;
        const worklog = await Worklog.findById(req.params.id);
        if(title) worklog.title = title;
        if(description) worklog.description = description;
        if(staff) worklog.staff = staff;
        if(status) worklog.status = status;
        const updatedWorklog = await worklog.save();
        res.status(200).json(updatedWorklog);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteWorklogController = async (req,res,next)=>{
    try
    {
        const worklog = await Worklog.findById(req.params.id);
        if(!worklog)
        {
            return res.status(404).json({message:"Worklog not found."});
        }
        await worklog.deleteOne();
        res.status(200).json({message:"Worklog deleted."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetWorklogsController = async (req,res,next)=>{
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
        const worklogs = await Worklog.find(filter)
        .populate({path:"staff",select:"name staff_id"});
        res.status(200).json(worklogs);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetWorklogController = async (req,res,next)=>{
    try
    {
        const worklog = await Worklog.findById(req.params.id)
        .populate({path:"staff",select:"name staff_id"});
        if(!worklog)
        {
            return res.status(404).json({message:"Worklog not found."});
        }
        res.status(200).json(worklog);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateWorklogController,
    EditWorklogController,
    DeleteWorklogController,
    GetWorklogsController,
    GetWorklogController,
}