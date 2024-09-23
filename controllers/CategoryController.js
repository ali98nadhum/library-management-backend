const asyncHandler = require("express-async-handler");
const {
  CategoryModel,
  ValidateCreateCategory,
  ValidateUpdateCategory,
} = require("../models/CategoryModel");







// ==================================
// @desc Git Category by id
// @route /api/category/id
// @method GET
// @access private (only admin)
// ==================================
module.exports.getOneCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "لا يوجد قسم لهذا المعرف" });
  }

  return res.status(200).json({ data: category });
});





// ==================================
// @desc Git All Category
// @route /api/category
// @method GET
// @access private (only admin)
// ==================================
module.exports.getAllCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json({ data: categories });
  } catch (error) {
    res.status(404).json({ message: "فشل في جلب الاقسام" });
  }
});





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
      title: req.body.title,
    });

    res.status(201).json({ message: "تم اضافه القسم بنجاح" });
  } catch (error) {
    console.error("Error occurred while creating category:", error);
    res.status(500).json({ message: "فشل في اضافه القسم" });
  }
});



// ==================================
// @desc Git update category
// @route /api/category/id
// @method PUSH
// @access private (only admin)
// ==================================
module.exports.updateCategory = asyncHandler(async (req, res) => {
  // get category from database
  const category = await CategoryModel.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "لا يوجد تصنيف لهذا المعرف" });
  }

  // Validate input data
  const { error } = ValidateUpdateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // update category data
  category.title = req.body.title;

  // save updated category in database
  await category.save();

  return res.status(200).json({ message: "تم تحديث الفئه بنجاح" });
});




// ==================================
// @desc Delete category
// @route /api/category/:id
// @method DELETE
// @access private (only admin)
// ==================================
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    // get category from database
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }

    // delete category from database
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم مسح التصنيف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطا اثناء مسح التصنيف" });
  }
});
