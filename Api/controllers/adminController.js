const jwt = require("jsonwebtoken");
const { verifyToken } = require('../utils/tokenVerify');
const Admin = require('../models/admin');
const AdminRole = require('../models/adminrole');
const bcrypt = require('bcrypt');


const adminLoginController = async (req, res, next) => {
    try 
    {
      const { username, password } = req.body;
      const user = await Admin.findOne({ username }).populate("role");
  
      if (!user) {
        return res.status(401).json({ field: "username", error: "Invalid username" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ field: "password", error: "Invalid password" });
      }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const expirationTime = 60 * 1000; // One minute in milliseconds
        res.cookie('token', token, {
            maxAge: expirationTime,
        });
        res.status(200).json({ token:token, modules:user.role.modules ,redirect: 'dashboard' });
    } 
    catch (error) 
    {
      return res.status(500).json({ error: "An error occurred during login" });
    }
};

const adminLogoutController = async (req,res,next) => {
    try
    {
        res.clearCookie("token");
        res.redirect("/admin/login");
        next();
    }
    catch(error)
    {
        res.status(200).json(error.message);
    }
};

const CreateAdminUserController = async (req,res,next) =>{
    try
    {
        const {username,password,role} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const admin = new Admin({
            username,
            password:HashedPassword,
            role
        });
        const newAdmin = await admin.save();
        res.status(200).json(newAdmin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const EditAdminUserController = async (req,res,next) =>{
    try
    {
        const {username,password,role} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const admin = await Admin.findById(req.params.id);
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        if(username) admin.username = username;
        if(HashedPassword) admin.password = HashedPassword;
        if(role) admin.role = role;
        const newAdmin = await admin.save();
        res.status(200).json(newAdmin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const DeleteAdminUserController = async (req,res,next) =>{
    try
    {
        const admin = await Admin.findById(req.params.id);
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        await admin.deleteOne();
        res.status(200).json("admin user deleted successfully.");
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUsersController = async (req,res,next) =>{
    try
    {
        const users = await Admin.find({},{ password: 0 });
        res.status(200).json(users);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUserController = async (req,res,next) =>{
    try
    {
        const admin = await Admin.findById(req.params.id,{ password: 0 });
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        res.status(200).json(admin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetAdminUserProfileController = async (req,res,next) =>{
    try
    {
        const {token} = req.body;
        const _id = await verifyToken(token,process.env.JWT_SECRET)._id;
        const admin = await Admin.findById(_id,{ password: 0 });
        if(!admin)
        {
            return res.status(404).json({message:"admin user not found."});
        }
        res.status(200).json(admin);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const createAdminRoleController = async (req,res,next) =>{
    try
    {
        const {name,modules} = req.body;
        const role = new AdminRole({
            name,
            modules
        });
        const newRole = await role.save();
        res.status(200).json(newRole);
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const editAdminRoleController = async (req,res,next) =>{
    try
    {
        const role_id = req.params.id;
        const {name,modules} = req.body;
        const role = await AdminRole.findById(role_id);
        if(!role)
        {
            return res.status(400).json("role not found");
        }
        if(name) role.name = name;
        if(modules) role.modules = modules;
        await role.save();
        res.status(200).json("role updated.");
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const deleteAdminRoleController = async (req,res,next) =>{
    try
    {
        const role_id = req.params.id;
        const role = await AdminRole.findById(role_id);
        if(!role)
        {
            return res.status(400).json("role not found");
        }
        await role.deleteOne();
        res.status(200).json("role deleted.");
        next();
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const getAdminRolesController = async (req,res,next) =>{
    try
    {
        const roles = await AdminRole.find();
        res.status(200).json(roles);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}
const getAdminRoleController = async (req,res,next) =>{
    try
    {
        const role_id = req.params.id;
        const role = await AdminRole.findById(role_id);
        if(!role)
        {
            return res.status(400).json("role not found");
        }
        res.status(200).json(role);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    adminLoginController,
    adminLogoutController,
    createAdminRoleController,
    editAdminRoleController,
    deleteAdminRoleController,
    getAdminRolesController,
    getAdminRoleController,
    CreateAdminUserController,
    EditAdminUserController,
    DeleteAdminUserController,
    GetAdminUsersController,
    GetAdminUserController,
    GetAdminUserProfileController
};