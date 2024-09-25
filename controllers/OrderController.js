const asyncHandler = require("express-async-handler");
const {OrderModel} = require("../models/OrderModel")
const {BookModel} = require("../models/BookModel");



// ==================================
// @desc Create a new Order
// @route /api/orders
// @method POST 
// @access private (only admin)
// ==================================
module.exports.createOrder = asyncHandler(async (req, res) => {
    const { custmerName, books, status } = req.body; // توقع مصفوفة من معرفات الكتب

    // تحقق من وجود الكتب في قاعدة البيانات
    const bookDetails = await BookModel.find({ _id: { $in: books } });
    if (bookDetails.length !== books.length) {
        return res.status(404).json({ message: 'One or more books not found' });
    }

    // تحقق من توافر النسخ المطلوبة
    for (const book of bookDetails) {
        if (book.quantity <= 0) {
            return res.status(400).json({ message: `The book "${book.title}" is out of stock` });
        }
    }

    // حساب السعر الإجمالي
    const totalPrice = bookDetails.reduce((sum, book) => sum + book.price, 0);

    // إنشاء الطلب
    const order = new OrderModel({
        custmerName,
        totalPrice,
        status: status || 'جاري التجهيز',
        books
    });

    await order.save();

    // إنقاص عدد النسخ المتاحة من كل كتاب
    for (const book of books) {
        await BookModel.updateOne({ _id: book }, { $inc: { quantity: -1 } });
    }

    // استرجاع تفاصيل الطلب مع معلومات الكتب باستخدام populate
    const populatedOrder = await OrderModel.findById(order._id).populate('books', 'title');

    res.status(201).json({ message: "تم انشاء الطلب بنجاح", order: populatedOrder });
});
