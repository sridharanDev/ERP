const Comment = require("../models/taskComment");

const CreateCommandController = async (req,res,next)=>
{
    try
    {
        const {task,content,staff,admin} = req.body;
        const comment = new Comment({
            task,content,staff,admin 
        });
        const newComment = await comment.save();
        res.status(200).json(newComment);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditCommandController = async (req,res,next)=>
{
    try
    {
        const {content} = req.body;
        const comment = await Comment.findById(req.params.id);
        if(!comment)
        {
            return res.status(404).json({message:"comment not found."});
        }
        if(content) comment.content = content;
        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteCommandController = async (req,res,next)=>
{
    try
    {
        const comment = await Comment.findById(req.params.id);
        if(!comment)
        {
            return res.status(404).json({message:"comment not found."});
        }
        const deletedComment = await comment.deleteOne();
        res.status(200).json(deletedComment);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetCommandsController = async (req,res,next)=>
{
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
        const comments = await Comment.find(filter)
        .populate({path:"staff",select:"name staff_id"})
        .populate({path:"admin",select:"username"});
        res.status(200).json(comments);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetCommandController = async (req,res,next)=>
{
    try
    {
        const comment = await Comment.findById(req.params.id)
        .populate({path:"staff",select:"name staff_id"})
        .populate({path:"admin",select:"username"});
        if(!comment)
        {
            return res.status(404).json({message:"comment not found."});
        }
        res.status(200).json(comment);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateCommandController,
    EditCommandController,
    DeleteCommandController,
    GetCommandsController,
    GetCommandController,
}