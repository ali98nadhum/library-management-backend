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
// @desc Update book
// @route /api/book/:id
// @method Pache
// @access private (only admin)
// ==================================
module.exports.updateBook = asyncHandler(async (req, res) => {
  // check if book exists
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "لا يوجد كتاب مرتبط بهذا المعرف" });
  }

  // validate input data

  const { error } = ValidateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let updateData = {};

  // check if update image

  if (req.file) {
    const uploadedImage = await cloudinaryUploadImage(
      req.file.buffer,
      req.file.originalname
    );
    updateData = {
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
    };

    // delete old image

    await cloudinaryDeleteImage(book.image.publicId);
  }

  updateData = {
    ...updateData,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    quantity: req.body.quantity,
    bookststatus: req.body.bookststatus,
    totalpage: req.body.totalpage,
    publishedDate: req.body.publishedDate,
    category: req.body.category,
  };

  // إزالة الحقول غير المحددة (undefined) من updatedData
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  Object.assign(book, updateData);

  // save updated data to database

  const updatedBook = await BookModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({ message: "تم تحديث المعلومات بنجاح" });
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






// ==================================
// @desc Search for a book by title
// @route /api/book/search
// @method GET
// @access private (only admin)
// ==================================
module.exports.searchBook = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query;

  // check if found book
  if (!searchTerm) {
    return res.status(400).json({ message: "يرجى تقديم مصطلح للبحث." });
  }

  // custom search term
  const searchCriteria = {
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } }, // بحث عن العنوان
      { author: { $regex: searchTerm, $options: 'i' } } // بحث عن المؤلف
    ]
  };

  // search book in database
  const books = await BookModel.find(searchCriteria);

  if (books.length === 0) {
    return res.status(404).json({ message: "لم يتم العثور على كتب تتطابق مع المعايير المحددة." });
  }

  res.status(200).json({ results: books.length, data: books });
});
