const LeaveApplication = require("../models/leaveApplication");

const CreateLeaveApplicationController = async (req,res,next)=>
{
    try
    {
        const {from_date,to_date,reason,staff} = req.body;
        const leave = new LeaveApplication({
            from_date,to_date,reason,staff
        });
        const newLeave = await leave.save();
        res.status(200).json(newLeave);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditLeaveApplicationController = async (req,res,next)=>
{
    try
    {
        const {from_date,to_date,reason,status} = req.body;
        const leave = await LeaveApplication.findById(req.params.id);
        if(!leave)
        {
            return res.status(404).json({message:"application not found."});
        }
        if(from_date) leave.from_date = from_date;
        if(to_date) leave.to_date = to_date;
        if(reason) leave.reason = reason;
        if(status) leave.status = status;
        const updatedLeave = await leave.save();
        res.status(200).json(updatedLeave);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteLeaveApplicationController = async (req,res,next)=>
{
    try
    {
        const leave = await LeaveApplication.findById(req.params.id);
        if(!leave)
        {
            return res.status(404).json({message:"application not found."});
        }
        const deletedLeave = await leave.deleteOne();
        res.status(200).json(deletedLeave);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetLeaveApplicationsController = async (req,res,next)=>
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
        const leaves = await LeaveApplication.find(filter)
        .populate({path:"staff",select:"name staff_id"})
        .sort({ createdAt: -1 });
        res.status(200).json(leaves);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetLeaveApplicationController = async (req,res,next)=>
{
    try
    {
        const leave = await LeaveApplication.findById(req.params.id)
        .populate({path:"staff",select:"name staff_id"});
        if(!leave)
        {
            return res.status(404).json({message:"application not found."});
        }
        res.status(200).json(leave);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateLeaveApplicationController,
    EditLeaveApplicationController,
    DeleteLeaveApplicationController,
    GetLeaveApplicationsController,
    GetLeaveApplicationController,
}