const asyncHandler = require("express-async-handler");
const {BookModel , ValidateCreateBook , ValidateUpdateBook} = require("../models/BookModel");
const fs = require("fs");
const {
    cloudinaryUploadImage,
    cloudinaryDeleteImage,
  } = require("../middlewares/cloudinary");



// ==================================
// @desc Get all books
// @route /api/book
// @method GET
// @access private (only admin)
// ==================================
module.exports.getAllBook = asyncHandler(async(req , res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 6 || 6;
    const skip = (page-1) * limit;

    const books = await BookModel.find({}).skip(skip).limit(limit);
  res.status(200).json({results:books.length , page , data:books});
})

// ==================================
// @desc Get book by id
// @route /api/book/:id
// @method GET
// @access private (only admin)
// ==================================
module.exports.getBookById = asyncHandler(async(req , res) => {
  const book = await BookModel.findById(req.params.id);
  if(!book){
    return res.status(404).json({message: "لم يتم العثور على كتاب مرتبط بهذا المعرف"})
  }

  res.status(200).json({data: book})
})




// ==================================
// @desc Create new book
// @route /api/book
// @method POST
// @access private (only admin)
// ==================================
module.exports.createBook = asyncHandler(async (req, res) => {
  //   cheack if not found image
  if (!req.file) {
    return res.status(400).json({ message: "قم بوضع صوره" });
  }

  // validate input data
  const { error } = ValidateCreateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if category title is unique
  const existingBook = await BookModel.findOne({
    title: req.body.title,
  });
  if (existingBook) {
    return res
      .status(400)
      .json({ message: "اسم الكتاب موجود بالفعل. يرجى اختيار اسم مختلف." });
  }

  // save image in cloud
  const result = await cloudinaryUploadImage(
    req.file.buffer,
    req.file.originalname
  );

  try {
    // create book
    const newBook = new BookModel({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      quantity: req.body.quantity,
      bookststatus: req.body.bookststatus,
      totalpage: req.body.totalpage,
      publishedDate: req.body.publishedDate,
      category: req.body.category,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    // save data in database
    await newBook.save();

    res.status(201).json({ message: "تم إنشاء الكتاب بنجاح" });
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ أثناء إنشاء الكتاب" });
  }
});



// ==================================
// @desc Delete Book
// @route /api/book/:id
// @method DELETE
// @access private (only admin)
// ==================================
module.exports.deleteBook = asyncHandler(async(req , res) => {
  const book = await BookModel.findById(req.params.id);
  if(!book){
    return res.status(404).json({message: "لا يوجد كتاب بهذا المعرف"})
  }

  // delete image from cloudinary
  await cloudinaryDeleteImage(book.image.publicId);

  // delete book from database
  await BookModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({message: "تم حذف الكتاب بنجاح"})
})