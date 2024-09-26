const asyncHandler = require("express-async-handler");
const {InvoiceModel}  = require("../models/InvoiceModel")
const {OrderModel} = require("../models/OrderModel")


// ==================================
// @desc create new invoice
// @route /api/invoice
// @method POST
// @access private (only admin)
// ==================================
module.exports.createNewInvoice = asyncHandler(async (req, res) => {
    const { order, paid } = req.body;

    // التحقق من وجود الطلب
    const existingOrder = await OrderModel.findById(order).populate('books');
    if (!existingOrder) {
        return res.status(404).json({ message: "لم يتم العثور على الطلب" });
    }

    // التحقق إذا كانت الفاتورة موجودة بالفعل للطلب
    const existingInvoice = await InvoiceModel.findOne({ order });
    if (existingInvoice) {
        return res.status(400).json({ message: "الفاتورة لهذا الطلب تم إنشاؤها مسبقًا" });
    }

    // إنشاء الفاتورة
    const newInvoice = new InvoiceModel({
        order: existingOrder._id,
        customerName: existingOrder.custmerName, 
        totalPrice: existingOrder.totalPrice, 
        orderStatus: existingOrder.status, 
        books: existingOrder.books.map(book => ({
            title: book.title,
            price: book.price,
        })),
        paid: paid || false, 
        status: paid ? 'مدفوع' : 'غير مدفوع',
        issueDate: Date.now()
    });

    await newInvoice.save();

    // استرجاع الفاتورة مع كافة تفاصيل الطلب
    const populatedInvoice = await InvoiceModel.findById(newInvoice._id).populate({
        path: 'order',
        populate: {
            path: 'books',
            select: 'title price author' 
        }
    });

    // إرجاع الفاتورة مع جميع معلومات الطلب
    res.status(201).json({ message: "تم إنشاء الفاتورة بنجاح", invoice: populatedInvoice });
});
