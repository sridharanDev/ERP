const Notification = require("../models/notifcation");


const CreateNotificationController = async (req,res,next)=>
{
    try
    {
        const {type,message,recipient,admin} = req.body;
        const notifcation = new Notification({type,message,recipient,admin});
        const newNotification = await notifcation.save();
        res.status(200).json(newNotification);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteNotificationController = async (req,res,next)=>
{
    try
    {
        const notifcation = await Notification.findById(req.params.id);
        if(!notifcation)
        {
            return res.status(404).json({message:"notification not found."});
        }
        const deletedNotification = await notifcation.deleteOne();
        res.status(200).json(deletedNotification);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetNotificationsController = async (req,res,next)=>
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
            filter.viewed = false;
        }
        const notifcations = await Notification.find(filter)
        .sort({ viewed: 1, createdAt: -1 })
        .exec();
        res.status(200).json(notifcations);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetNotificationController = async (req,res,next)=>
{
    try
    {
        const {staff_id,admin_id} = req.body;
        const notifcation = await Notification.findById(req.params.id);
        if(!notifcation)
        {
            return res.status(404).json({message:"notification not found."});
        }
        if(staff_id && notifcation.recipient == staff_id)
        {
            // notifcation.viewed = true;
            // notifcation.save();
            notifcation.deleteOne();
        }
        res.status(200).json(notifcation);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateNotificationController,
    DeleteNotificationController,
    GetNotificationsController,
    GetNotificationController,
}