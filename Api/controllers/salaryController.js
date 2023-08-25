const Salary = require("../models/salary");
const Staff = require("../models/staff");

const CreateSaleryController = async (req,res,next)=>{
    try
    {
        const {staff_id,
            working_days,
            salary_date,
            credited_date,
            actual_salary,
            paid,
            status,
            note,
            staff_status
        } = req.body;
        const salary = new Salary({
            staff_id,
            working_days,
            salary_date,
            credited_date,
            actual_salary,
            paid,
            status,
            note,
            staff_status
        });
        const newSalary = await salary.save();
        res.status(200).json(newSalary);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditSaleryController = async (req,res,next)=>{
    try
    {
        const {staff_id,
            working_days,
            salary_date,
            credited_date,
            actual_salary,
            paid,
            status,
            note,
            staff_status
        } = req.body;
        
        const salary = await Salary.findById(req.params.id);
        if(!salary)
        {
            return res.status(404).json({message:"salary not found"});
        }
        if(staff_id) salary.staff_id = staff_id;
        if(working_days) salary.working_days = working_days;
        if(salary_date) salary.salary_date = salary_date;
        if(credited_date) salary.credited_date = credited_date;
        if(actual_salary) salary.actual_salary = actual_salary;
        if(paid) salary.paid = paid;
        if(status) salary.status = status;
        if(note) salary.note = note;
        if(staff_status) salary.staff_status = staff_status;
        const editedSalary = await salary.save();
        res.status(200).json(editedSalary);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteSaleryController = async (req,res,next)=>{
    try
    {     
        const salary = await Salary.findById(req.params.id);
        if(!salary)
        {
            return res.status(404).json({message:"salary not found"});
        }


        await salary.deleteOne();
        res.status(200).json({message:"salary deleted successfully."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetSaleriesController = async (req,res,next)=>{
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
        const salaries = await Salary.find(filter);
        
        res.status(200).json(salaries);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetSalaryController = async (req,res,next)=>{
    try
    {     
        const salary = await Salary.findById(req.params.id);
        if(!salary)
        {
            return res.status(404).json({message:"salary not found"});
        }
        
        res.status(200).json(salary);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const UploadSalaryController = async (req,res,next)=>{
    try
    {  
        const csvData = req.csvData;
        const staffs = [];  
        const notfound = [];  
        for (const data of csvData) {
            const staff = await Staff.findOne({ staff_id: data.staff_id });
            if(staff)
            {
                const salary = new Salary(data);
                const newSalary = await salary.save();
                staffs.push(data);
            }
            else
            {
                notfound.push(data);
            }
        }
        res.status(200).json({staffs,notfound});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateSaleryController,
    EditSaleryController,
    DeleteSaleryController,
    GetSaleriesController,
    GetSalaryController,
    UploadSalaryController,
};