const mongoose = require('mongoose');
const categoryLanguagesModel = require('./models/categoryLanguages.model');
const brandLanguagesModel = require('./models/brandLanguages.model');
require('dotenv').config();

const restoreData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Kết nối MongoDB thành công');

        // Lấy tất cả brands
        const brands = await brandLanguagesModel.find({});
        console.log(`Tìm thấy ${brands.length} brands`);

        if (brands.length === 0) {
            console.log('Không có brands. Tạo brands mới...');
            const newBrands = await brandLanguagesModel.insertMany([
                { nameBrand: "JavaScript", slug: "javascript", logoBrand: "https://cdn.jsdelivr.net/npm/programming-languages-logos@0.0.3/src/javascript/javascript.png" },
                { nameBrand: "Python", slug: "python", logoBrand: "https://cdn.jsdelivr.net/npm/programming-languages-logos@0.0.3/src/python/python.png" },
                { nameBrand: "Java", slug: "java", logoBrand: "https://cdn.jsdelivr.net/npm/programming-languages-logos@0.0.3/src/java/java.png" },
                { nameBrand: "React", slug: "react", logoBrand: "https://cdn.jsdelivr.net/npm/programming-languages-logos@0.0.3/src/javascript/javascript.png" }
            ]);
            brands.push(...newBrands);
            console.log('Đã tạo brands mới');
        }

        // Xóa categories cũ và tạo mới với liên kết đúng
        await categoryLanguagesModel.deleteMany({});
        console.log('Đã xóa categories cũ');

        const categoriesData = [
            {
                nameC: "Web Development",
                slug: "web-development",
                descriptionC: "Phát triển ứng dụng web với các công nghệ hiện đại",
                imageC: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
                brandLanguages: brands[0]._id  // Single ObjectId
            },
            {
                nameC: "Mobile Development", 
                slug: "mobile-development",
                descriptionC: "Phát triển ứng dụng di động cho iOS và Android",
                imageC: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
                brandLanguages: brands[1]._id  // Single ObjectId
            },
            {
                nameC: "Data Science",
                slug: "data-science", 
                descriptionC: "Khoa học dữ liệu và machine learning",
                imageC: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
                brandLanguages: brands[2]._id  // Single ObjectId
            }
        ];

        const newCategories = await categoryLanguagesModel.insertMany(categoriesData);
        console.log(`Đã tạo ${newCategories.length} categories mới`);

        // Kiểm tra kết quả
        const result = await categoryLanguagesModel.find({}).populate('brandLanguages');
        console.log('\n=== KẾT QUẢ SAU KHI KHÔI PHỤC ===');
        result.forEach(cat => {
            console.log(`${cat.nameC}: ${cat.brandLanguages?.nameBrand || 'No brand'}`);
        });

    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Hoàn thành khôi phục dữ liệu!');
    }
};

restoreData();