const Invoice = require("../models/invoice");

const getLastInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne({}, 'invoice_no').sort({ createdAt: -1 });
  return lastInvoice ? lastInvoice.invoice_no : null;
};

const generateInvoiceNumber = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const lastTwoDigits = currentYear.toString().slice(-2);
  const currentMonthWithLeadingZero = currentMonth.toString().padStart(2, '0');

  const lastInvoiceNo = await getLastInvoiceNumber();

  let newInvoiceNumericPart;
  if (lastInvoiceNo) {
    const lastInvoiceNumericPart = parseInt(lastInvoiceNo.slice(-4), 10);
    newInvoiceNumericPart = lastInvoiceNumericPart + 1;
  } else {
    newInvoiceNumericPart = 1;
  }

  const invoice_no =
    "ABC" +
    lastTwoDigits +
    currentMonthWithLeadingZero +
    newInvoiceNumericPart.toString().padStart(4, '0');

  return invoice_no;
};

module.exports = generateInvoiceNumber;
