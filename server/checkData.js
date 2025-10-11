const mongoose = require('mongoose');
const categoryLanguagesModel = require('./models/categoryLanguages.model');
const brandLanguagesModel = require('./models/brandLanguages.model');
require('dotenv').config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Kết nối MongoDB thành công');

        // Kiểm tra categories
        const categories = await categoryLanguagesModel.find({}).populate('brandLanguages');
        console.log(`\n=== CATEGORIES (${categories.length}) ===`);
        categories.forEach(cat => {
            console.log(`ID: ${cat._id}`);
            console.log(`Name: ${cat.nameC}`);
            console.log(`Slug: ${cat.slug}`);
            console.log(`BrandLanguages: ${cat.brandLanguages ? (Array.isArray(cat.brandLanguages) ? cat.brandLanguages.length : 1) : 0}`);
            console.log('---');
        });

        // Kiểm tra brands
        const brands = await brandLanguagesModel.find({});
        console.log(`\n=== BRANDS (${brands.length}) ===`);
        brands.forEach(brand => {
            console.log(`${brand.nameBrand} (${brand.slug})`);
        });

    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();