const Course = require("../models/course");

const CreateCourseController = async (req,res,next)=>
{
    try
    {
        const {title,description,duration,fees} = req.body;
        const course = new Course({
            title,description,duration,fees
        });
        const newCourse = await course.save();
        res.status(200).json(newCourse);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const EditCourseController = async (req,res,next)=>
{
    try
    {
        const {title,description,duration,fees} = req.body;
        const course = await Course.findById(req.params.id);
        if(!course)
        {
            return res.status(404).json({message:"course not found"});
        }
        if(title) course.title = title;
        if(description) course.description = description;
        if(duration) course.duration = duration;
        if(fees) course.fees = fees;
        const editedCourse = await course.save();
        res.status(200).json(editedCourse);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteCourseController = async (req,res,next)=>
{
    try
    {
        const {title,description,fees} = req.body;
        const course = await Course.findById(req.params.id);
        if(!course)
        {
            return res.status(404).json({message:"course not found"});
        }
        await course.deleteOne();
        res.status(200).json({message:"course deleted successfully."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetCoursesController = async (req,res,next)=>
{
    try
    {
        const courses = await Course.find();
        res.status(200).json(courses);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetCourseController = async (req,res,next)=>
{
    try
    {
        const course = await Course.findById(req.params.id);
        if(!course)
        {
            return res.status(404).json({message:"course not found"});
        }
        res.status(200).json(course);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateCourseController,
    EditCourseController,
    DeleteCourseController,
    GetCoursesController,
    GetCourseController
};