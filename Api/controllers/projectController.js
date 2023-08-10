const Project = require("../models/project")
const Task = require("../models/task");

const CreateProjectCotroller = async(req,res,next) =>
{
    try
    {
        const {
            client_name,
            mobile,
            platform,
            project_name,
            reference,
            note,
            status} = req.body;
        const project = new Project({
            client_name,
            mobile,
            platform,
            project_name,
            reference,
            note,
            status
        });

        const newProject = await project.save();
        res.status(200).json(newProject);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditProjectController = async (req,res,next)=>
{
    try
    {
        const {
            client_name,
            mobile,
            platform,
            project_name,
            reference,
            note,
            start_date,
            end_date,
            staffs,
            status,
        } = req.body;
            
        const project = await Project.findById(req.params.id);
        if(!project)
        {
            return res.status(404).json("project not found.");
        }
        if (client_name) project.client_name = client_name;
        if (mobile) project.mobile = mobile;
        if (platform) project.platform = platform;
        if (project_name) project.project_name = project_name;
        if (reference) project.reference = reference;
        if (note) project.note = note;
        if (start_date) project.start_date = start_date;
        if (end_date) project.end_date = end_date;
        if (staffs) project.staffs = staffs;
        if (status) project.status = status;
        
        const editedProject = await project.save();
        res.status(200).json(editedProject);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteProjectController = async(req,res,next)=>{
    try
    {
        const project = await Project.findById(req.params.id);
        if(!project)
        {
            return res.status(404).json("project not found.");
        }
        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetProjectsController = async (req,res,next)=>{
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
        const projects = await Project.find(filter);
        res.status(200).json(projects);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetProjectController = async (req,res,next)=>{
    try
    {
        const project = await Project.findById(req.params.id)
        .populate({path:"staffs",select:"name staff_id"});
        if(!project)
        {
            return res.status(404).json("project not found.");
        }

        const tasks = await Task.find({project:project._id});
        const completedTasks = tasks.filter(task => task.status === "completed");
        const completionPercentage = ((completedTasks.length / tasks.length) * 100).toFixed(2);
        const projectObject = project.toObject();
        projectObject.tasks = tasks;
        projectObject.completionPercentage = completionPercentage;
        res.status(200).json(projectObject);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateProjectCotroller,
    EditProjectController,
    DeleteProjectController,
    GetProjectsController,
    GetProjectController
};