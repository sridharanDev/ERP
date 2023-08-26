const Student = require("../models/student");

const CreateStudetCotroller = async (req,res,next)=>{
    try
    {
        const {name,
            mobile,
            email,
            gender,
            dob,
            qualification,
            passed_out_year,
            current_status,
            institute_or_company,
            courses,
            note,
            paid,
            staffs,
            status,
            call_back_date,
            join_date,

        } = req.body;
        const student = new Student({
            name,
            mobile,
            email,
            gender,
            dob,
            qualification,
            passed_out_year,
            current_status,
            institute_or_company,
            courses,
            note,
            paid,
            staffs,
            status,
            call_back_date,
            join_date,
        });
        const newStudent = await student.save();
        res.status(200).json(newStudent);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditStudetCotroller = async (req,res,next)=>{
    try
    {
        const {
            name,
            mobile,
            email,
            gender,
            dob,
            qualification,
            passed_out_year,
            current_status,
            institute_or_company,
            courses,
            note,
            paid,
            staffs,
            status,
            call_back_date,
            join_date,
        } = req.body;
        const student = await Student.findById(req.params.id);
        if(!student)
        {
            return res.status(404).json({message:"student not found."});
        }
        if(name) student.name = name;
        if(mobile) student.mobile = mobile;
        if(email) student.email = email;
        if(gender) student.gender = gender;
        if(dob) student.dob = dob;
        if(qualification) student.qualification = qualification;
        if(passed_out_year) student.passed_out_year = passed_out_year;
        if(current_status) student.current_status = current_status;
        if(institute_or_company) student.institute_or_company = institute_or_company;
        if(courses) student.courses = courses;
        if(note) student.note = note;
        if(paid) student.paid = paid;
        if(staffs) student.staffs = staffs;
        if(status) student.status = status;
        if(call_back_date) student.call_back_date = call_back_date;
        if(join_date) student.join_date = join_date;
        const editedStudent = await student.save();
        res.status(200).json(editedStudent);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteStudetCotroller = async (req,res,next)=>{
    try
    {
        const student = await Student.findById(req.params.id);
        if(!student)
        {
            return res.status(404).json({message:"student not found."});
        }
        await student.deleteOne();
        res.status(200).json({message:"student deleted successfully."});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetStudetsCotroller = async (req,res,next)=>{
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
        const students = await Student.find(filter)
        .populate({path:"courses"})
        .populate({path:"staffs",select : "name staff_id"});
        const updatedStudents = students.map((student) => {
            const totalFees = student.courses.reduce((acc, course) => acc + course.fees, 0);
            const balanceFees = totalFees - student.paid;
            return { ...student.toObject(), totalFees ,balanceFees};
        });
        res.status(200).json(updatedStudents);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetStudetCotroller = async (req,res,next)=>{
    try
    {
        const student = await Student.findById(req.params.id)
        .populate({path:"courses"})
        .populate({path:"staffs",select : "name staff_id"});
        if(!student)
        {
            return res.status(404).json({message:"student not found."});
        }
        const totalFees = student.courses.reduce((acc, course) => acc + course.fees, 0);
        const balanceFees = totalFees - student.paid;
        const updatedStudent = { ...student.toObject(), totalFees, balanceFees };

        res.status(200).json(updatedStudent);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateStudetCotroller,
    EditStudetCotroller,
    DeleteStudetCotroller,
    GetStudetsCotroller,
    GetStudetCotroller
}