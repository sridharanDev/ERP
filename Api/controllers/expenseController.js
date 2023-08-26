const ExpType = require("../models/expenseType");
const Expense = require("../models/expense");

const CreateTypeController = async (req,res,next)=>{
    try
    {
        const {name}=req.body;
        const expType = new ExpType({name});
        const newExpType = await expType.save();
        res.status(200).json(newExpType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditTypeController = async (req,res,next)=>{
    try
    {
        const {name}=req.body;
        const expType = await ExpType.findById(req.params.id);
        if(!expType)
        {
            return res.status(404).json({message:"type not found."});
        }
        if(name) expType.name = name;
        const updatedExpType = await expType.save();
        res.status(200).json(updatedExpType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteTypeController = async (req,res,next)=>{
    try
    {
        const expType = await ExpType.findById(req.params.id);
        if(!expType)
        {
            return res.status(404).json({message:"type not found."});
        }
        const deletedExpType = await expType.deleteOne();
        res.status(200).json(deletedExpType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetTypesController = async (req,res,next)=>{
    try
    {
        const expTypes = await ExpType.find();
        res.status(200).json(expTypes);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetTypeController = async (req,res,next)=>{
    try
    {
        const expType = await ExpType.findById(req.params.id);
        res.status(200).json(expType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const CreateExpenseController = async (req,res,next)=>{
    try
    {
        const {type,date,amount,note,from,to,payment_type}=req.body;
        const expense = new Expense({
            type,
            date,
            amount,
            note,
            from,
            to,
            payment_type
        });
        const newExpense = await expense.save();
        res.status(200).json(newExpense);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditExpenseController = async (req,res,next)=>{
    try
    {
        const {type,date,amount,note,from,to,payment_type}=req.body;
        const expense = await Expense.findById(req.params.id);
        if(!expense)
        {
            return res.status(404).json({message:"expense not found."});
        }
        if(type) expense.type = type;
        if(date) expense.date = date;
        if(amount) expense.amount = amount;
        if(note) expense.note = note;
        if(from) expense.from = from;
        if(to) expense.to = to;
        if(payment_type) expense.payment_type = payment_type;
        const updatedExpense = await expense.save();
        res.status(200).json(updatedExpense);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteExpenseController = async (req,res,next)=>{
    try
    {
        const expense = await Expense.findById(req.params.id);
        if(!expense)
        {
            return res.status(404).json({message:"expense not found."});
        }
        const deletedExpense = await expense.deleteOne();
        res.status(200).json(deletedExpense);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetExpensesController = async (req,res,next)=>{
    try
    {
        const expenses = await Expense.find().populate("type");
        res.status(200).json(expenses);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetExpenseController = async (req,res,next)=>{
    try
    {
        const expense = await Expense.findById(req.params.id);
        if(!expense)
        {
            return res.status(404).json({message:"expense not found."});
        }
        res.status(200).json(expense);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateTypeController,
    EditTypeController,
    DeleteTypeController,
    GetTypesController,
    GetTypeController,
    CreateExpenseController,
    EditExpenseController,
    DeleteExpenseController,
    GetExpensesController,
    GetExpenseController
}