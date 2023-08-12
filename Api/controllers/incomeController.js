const Income = require("../models/income");

const CreateIncomeController = async (req,res,next) =>{
    try
    {
        const {entityType,
            entity,
            name,
            from,
            to,
            amount,
            payment_type,
            note,
            date
        } = req.body;
        const income = new Income({
            entityType,
            entity,
            name,
            from,
            to,
            amount,
            payment_type,
            note,
            date
        });
        const newIncome = await income.save();
        res.status(200).json(newIncome);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditIncomeController = async (req,res,next) =>{
    try
    {
        const {entityType,
            entity,
            name,
            from,
            to,
            amount,
            payment_type,
            note,
            date
        } = req.body;
        const income = await Income.findById(req.params.id);
        if(!income)
        {
            return res.status(404).json({message:"income record not found."});
        }
        if(entityType) income.entityType = entityType;
        if(entity) income.entity = entity;
        if(name) income.name = name;
        if(from) income.from = from;
        if(to) income.to = to;
        if(amount) income.amount = amount;
        if(payment_type) income.payment_type = payment_type;
        if(note) income.note = note;
        if(date) income.date = date;
        const editedIncome = await income.save();
        res.status(200).json(editedIncome);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteIncomeController = async (req,res,next) =>{
    try
    {
    
        const income = await Income.findById(req.params.id);
        if(!income)
        {
            return res.status(404).json({message:"income record not found."});
        }
        await income.deleteOne();
        res.status(200).json({message:"income record deleted."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetIncomesController = async (req,res,next)=>{
    try
    {
        const incomesWithProjects = await Income.find({ entityType: 'Project' }).populate('entity');
        const incomesWithCourses = await Income.find({ entityType: 'Course' }).populate('entity');
        const incomesWithInterns = await Income.find({ entityType: 'Intern' });
        const incomesWithRents = await Income.find({ entityType: 'Rent' });
        res.status(200).json({
            incomesWithProjects,
            incomesWithCourses,
            incomesWithInterns,
            incomesWithRents,
        });
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

const GetIncomeController = async (req,res,next)=>{
    try
    {
        const income = await Income.findById(req.params.id);
        if(!income)
        {
            return res.status(404).json({message:"income record not found."});
        }
        res.status(200).json(income);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}

module.exports = {
    CreateIncomeController,
    EditIncomeController,
    DeleteIncomeController,
    GetIncomesController,
    GetIncomeController,
};