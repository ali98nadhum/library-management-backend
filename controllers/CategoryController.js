const asyncHandler = require("express-async-handler");
const {
  CategoryModel,
  ValidateCreateCategory,
  ValidateUpdateCategory,
} = require("../models/CategoryModel");

// ==================================
// @desc Create a new category
// @route /api/category
// @method POST
// @access private (only admin)
// ==================================
module.exports.createCategory = asyncHandler(async (req, res) => {
  try {
    // validtion input data
    const { error } = ValidateCreateCategory(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if category title is unique
    const existingCategory = await CategoryModel.findOne({
      title: req.body.title,
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "القسم موجود بالفعل يرجى اختيار اسم اخر " });
    }

    // create and save category in database
    const category = await CategoryModel.create({
        title: req.body.title
    })

    res.status(201).json({message: "تم اضافه القسم بنجاح"})

  } catch (error) {
    console.error("Error occurred while creating category:", error); // عرض تفاصيل الخطأ
    res.status(500).json({ message: "فشل في اضافه القسم" });
  }
});
