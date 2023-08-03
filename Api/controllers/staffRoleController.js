const Role = require("../models/staffRole");

const CreateRoleController = async (req,res,next)=>{
    try
    {
        const {name,salery} = req.body;
        const role = new Role({
            name,
            salery,
        });

        const newRole = await role.save();
        res.status(200).json(newRole);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditRoleController = async (req,res,next)=>{
    try
    {
        const {name,salery} = req.body;
        const role = await Role.findById(req.params.id);
        if(!role)
        {
            return res.status(404).json({message:"role not found."});
        }
        if(name) role.name = name;
        if(salery) role.salery = salery;
        const editRole = await role.save();
        res.status(200).json(editRole);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteRoleController = async (req,res,next)=>{
    try
    {
        const role = await Role.findById(req.params.id);
        if(!role)
        {
            return res.status(404).json({message:"role not found."});
        }
        await role.deleteOne();
        res.status(200).json({message:"role deleted successfully."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetRolesController = async (req,res,next)=>{
    try
    {
        const roles = await Role.find();
        res.status(200).json(roles);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetRoleController = async (req,res,next)=>{
    try
    {
        const role = await Role.findById(req.params.id);
        if(!role)
        {
            return res.status(404).json({message:"role not found."});
        }
        res.status(200).json(role);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateRoleController,
    EditRoleController,
    DeleteRoleController,
    GetRolesController,
    GetRoleController
};