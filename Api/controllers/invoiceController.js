const Invoice = require("../models/invoice");
const Student = require("../models/student");
const GenerateInvoiceNumber = require("../utils/generateInvoiceNumber");

const CreateInvoiceController = async (req,res,next)=>
{
    try
    {
        const {type,
            refrenece,
            invoice_no,
            date,
            student_id,
            customer_name,
            customer_email,
            customer_mobile,
            tax,
            discount_percent,
            pay_type,
            paid,
            remider_date,
            items,
        } = req.body;
        const invoice = new Invoice({
            type,
            refrenece,
            invoice_no,
            date,
            customer_name,
            customer_email,
            customer_mobile,
            tax,
            discount_percent,
            pay_type,
            paid,
            remider_date,
            items
        });

        const newInvoice = await invoice.save();
        const student = await Student.findById(student_id);
        if(student)
        {
            student.paid = student.paid + paid;
            student.save();
        }
        res.status(200).json(invoice);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditInvoiceController = async (req,res,next)=>
{
    try
    {
        const invoice_no = req.params.id;
        const {type,
            refrenece,
            date,
            customer_name,
            customer_email,
            customer_mobile,
            tax,
            discount_percent,
            pay_type,
            paid,
            remider_date,
            items,
        } = req.body;
        
        const invoice = await Invoice.findOne({invoice_no:invoice_no});
        if(!invoice)
        {
            return res.status(404).json({message:"invoice not found"});
        }
        if(type) invoice.type = type;
        if(refrenece) invoice.refrenece = refrenece;
        if(date) invoice.date = date;
        if(customer_name) invoice.customer_name = customer_name;
        if(customer_email) invoice.customer_email = customer_email;
        if(customer_mobile) invoice.customer_mobile = customer_mobile;
        if(tax) invoice.tax = tax;
        if(discount_percent) invoice.discount_percent = discount_percent;
        if(pay_type) invoice.pay_type = pay_type;
        if(paid) invoice.paid = paid;
        if(remider_date) invoice.remider_date = remider_date;
        if(items) invoice.items = items;
        const newInvoice = await invoice.save();
        res.status(200).json(newInvoice);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteInvoiceController = async (req,res,next)=>
{
    try
    {
        const invoice = await Invoice.findById(req.params.id);
        if(!invoice)
        {
            return res.status(404).json({message:"invoice not found"});
        }
        await invoice.deleteOne();
        res.status(200).json({message:"invoice deleted."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetInvoicesController = async (req,res,next)=>
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
        const invoices = await Invoice.find(filter);
        res.status(200).json(invoices);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetInvoiceController = async (req,res,next)=>
{
    try
    {
        const invoice_no = req.params.id;
        const invoice = await Invoice.findOne({invoice_no:invoice_no});
        res.status(200).json(invoice);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GenerateInvoiceNumberController = async (req,res,next)=>
{
    try
    {
        const invoice_no = await GenerateInvoiceNumber();
        res.status(200).json({invoice_no:invoice_no});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
}


module.exports = {
    GenerateInvoiceNumberController,
    CreateInvoiceController,
    EditInvoiceController,
    DeleteInvoiceController,
    GetInvoicesController,
    GetInvoiceController,
};