const asyncHandler = require("express-async-handler");
const {OrderModel , validateCreateOrder} = require("../models/OrderModel")
const {BookModel} = require("../models/BookModel");




// ==================================
// @desc Get All Order
// @route /api/orders
// @method GET
// @access private (only admin)
// ==================================
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 6;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.find({})
        .skip(skip)
        .limit(limit)
        .populate('books', 'title');

    res.status(200).json({ results: orders.length, page, data: orders });
});


// ==================================
// @desc Get Order by id
// @route /api/orders/:id
// @method GET
// @access private (only admin)
// ==================================
module.exports.getOrderById = asyncHandler(async(req , res) => {
    const order = await OrderModel.findById(req.params.id)
       .populate('books', 'title');
       if(!order){
        return res.status(404).json({message: "لم يتم العثور على الطلب"})
       }

       return res.status(200).json(order);
})




// ==================================
// @desc Create a new Order
// @route /api/orders
// @method POST 
// @access private (only admin)
// ==================================
module.exports.createOrder = asyncHandler(async (req, res) => {

    const { custmerName, books, status } = req.body; 


    // validate input data
  const { error } = validateCreateOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }



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


// ==================================
// @desc Update order
// @route /api/orders/:id
// @method PATCH
// @access private (only admin)
// ==================================
module.exports.updateOrder = asyncHandler(async (req, res) => {
    const { status } = req.body;


    // التحقق من صحة الحالة المدخلة
    const validStatuses = ['جاري التجهيز', 'تم التجهيز', 'تم الالغاء'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "حالة الطلب غير صالحة. يجب أن تكون 'جاري التجهيز' أو 'تم التجهيز' أو 'تم الالغاء'." });
    }

    // العثور على الطلب
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "لم يتم العثور على الطلب" });
    }

    // التحقق إذا كانت الحالة الحالية "تم الالغاء" فلا يمكن التغيير مرة أخرى
    if (order.status === 'تم الالغاء') {
        return res.status(400).json({ message: "لا يمكن تعديل طلب تم إلغاؤه" });
    }

    // تحديث حالة الطلب
    order.status = status;
    await order.save();

    // إذا كانت الحالة "تم الالغاء"، قم بإعادة النسخ إلى المخزن
    if (status === 'تم الالغاء') {
        for (const bookId of order.books) {
            await BookModel.updateOne({ _id: bookId }, { $inc: { quantity: 1 } });
        }
    }

    // استرجاع تفاصيل الطلب مع معلومات الكتب باستخدام populate
    const updatedOrder = await OrderModel.findById(order._id).populate('books', 'title');

    res.status(200).json({ message: "تم تحديث حالة الطلب بنجاح" });
});


// ==================================
// @desc Delete Order
// @route /api/orders/:id
// @method DELETE
// @access private (only admin)
// ==================================
module.exports.deleteOrder = asyncHandler(async(req , res) => {
    const order = await OrderModel.findByIdAndDelete(req.params.id);
    if(!order){
        return res.status(404).json({message: "لم يتم العثور على الطلب"})
    }

    return res.status(200).json({message: "تم حذف الطلب بنجاح"})
})
