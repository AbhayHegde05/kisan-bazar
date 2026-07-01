const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModel");
const Product = require("./models/ProductModel");
const Category = require("./models/CategoryModel");
const Order = require("./models/OrderModel");
const FarmerProfile = require("./models/FarmerProfileModel");
const Message = require("./models/MessageModel");

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const users = [
    // Admin
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        phone: "9876543210",
    },
    // Consumer
    {
        name: "Rahul Sharma",
        email: "consumer@example.com",
        password: "password123",
        role: "consumer",
        phone: "9876543211",
        address: {
            street: "123 Main St",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110001",
        },
    },
    // Farmers
    {
        name: "Ramesh Gupta",
        email: "ramesh@farmer.com",
        password: "password123",
        role: "farmer",
        phone: "9876543212",
        address: {
            street: "Village Raipur",
            city: "Nashik",
            state: "Maharashtra",
            zipCode: "422001",
        },
        profile: {
            farmName: "Gupta Organic Farms",
            description: "We specialize in organic vegetables grown without synthetic pesticides.",
            establishedYear: 2010,
            farmingPractices: ["Organic", "Crop Rotation"],
        },
    },
    {
        name: "Sita Devi",
        email: "sita@farmer.com",
        password: "password123",
        role: "farmer",
        phone: "9876543213",
        address: {
            street: "Village Kamalpur",
            city: "Jaipur",
            state: "Rajasthan",
            zipCode: "302001",
        },
        profile: {
            farmName: "Sita's Fresh Produce",
            description: "Direct from farm to table. Fresh seasonal fruits and vegetables.",
            establishedYear: 2015,
            farmingPractices: ["Traditional", "Hand-picked"],
        },
    },
    {
        name: "Vikram Singh",
        email: "vikram@farmer.com",
        password: "password123",
        role: "farmer",
        phone: "9876543214",
        address: {
            street: "Village Khanna",
            city: "Ludhiana",
            state: "Punjab",
            zipCode: "141001",
        },
        profile: {
            farmName: "Punjab Gold Fields",
            description: "High quality wheat and rice grains directly from Punjab.",
            establishedYear: 2005,
            farmingPractices: ["Modern", "Mechanized"],
        },
    },
    {
        name: "Lakshmi Reddy",
        email: "lakshmi@farmer.com",
        password: "password123",
        role: "farmer",
        phone: "9876543215",
        address: {
            street: "Village Gudur",
            city: "Guntur",
            state: "Andhra Pradesh",
            zipCode: "522001",
        },
        profile: {
            farmName: "Reddy Spices & Chillies",
            description: "Famous Guntur chillies and aromatic spices.",
            establishedYear: 2012,
            farmingPractices: ["Natural Drying", "Hand-sorted"],
        },
    },
    {
        name: "Mohammed Khan",
        email: "khan@farmer.com",
        password: "password123",
        role: "farmer",
        phone: "9876543216",
        address: {
            street: "Village Malihabad",
            city: "Lucknow",
            state: "Uttar Pradesh",
            zipCode: "226001",
        },
        profile: {
            farmName: "Royal Mango Orchards",
            description: "Premium Dussehri and Langra mangoes from Malihabad.",
            establishedYear: 1998,
            farmingPractices: ["Orchard Management", "Tree Ripened"],
        },
    },
];

const categories = [
    {
        name: "Vegetables",
        description: "Fresh and organic vegetables",
        icon: "FaCarrot",
    },
    {
        name: "Fruits",
        description: "Seasonal sweet fruits",
        icon: "FaAppleAlt",
    },
    {
        name: "Grains",
        description: "Rice, wheat, and pulses",
        icon: "FaBreadSlice",
    },
    {
        name: "Spices",
        description: "Aromatic spices and herbs",
        icon: "FaPepperHot",
    },
    {
        name: "Dairy",
        description: "Fresh milk and dairy products",
        icon: "FaCheese",
    },
];

const seedDB = async () => {
    try {
        await connectDB();

        console.log("Adding Farmers and Products...");

        await Order.deleteMany({});
        await Product.deleteMany({});
        await FarmerProfile.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});
        await Message.deleteMany({});

        // Create Categories
        const createdCategories = await Category.insertMany(categories);
        const catMap = {};
        createdCategories.forEach((cat) => {
            catMap[cat.name] = cat._id;
        });

        // Create Users (with Hashed Passwords)
        const createdUsers = [];
        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            const newUser = await User.create({
                ...user,
                password: hashedPassword,
            });
            createdUsers.push(newUser);

            // Create Farmer Profile if role is farmer
            if (user.role === "farmer") {
                await FarmerProfile.create({
                    user: newUser._id,
                    ...user.profile,
                    farmImages: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854"],
                });
            }
        }

        const farmers = createdUsers.filter((u) => u.role === "farmer");

        // Products
        const products = [
            // Ramesh (Vegetables)
            {
                farmer: farmers[0]._id,
                category: catMap["Vegetables"],
                name: "Organic Tomatoes",
                description: "Juicy, red organic tomatoes. Perfect for curries and salads.",
                price: 40,
                unit: "kg",
                quantityAvailable: 100,
                images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea"],
                isOrganic: true,
            },
            {
                farmer: farmers[0]._id,
                category: catMap["Vegetables"],
                name: "Fresh Spinach",
                description: "Leafy green spinach, harvested daily.",
                price: 30,
                unit: "bunch",
                quantityAvailable: 50,
                images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb"],
                isOrganic: true,
            },
            {
                farmer: farmers[0]._id,
                category: catMap["Vegetables"],
                name: "Cauliflower",
                description: "White, fresh cauliflower heads.",
                price: 50,
                unit: "kg",
                quantityAvailable: 40,
                images: ["https://images.unsplash.com/photo-1568584711075-3d021a7c3d54"],
                isOrganic: false,
            },

            // Sita (Fruits & Veg)
            {
                farmer: farmers[1]._id,
                category: catMap["Fruits"],
                name: "Pomegranate",
                description: "Sweet and red pomegranate, rich in antioxidants.",
                price: 120,
                unit: "kg",
                quantityAvailable: 80,
                images: ["https://images.unsplash.com/photo-1596363505729-4190a9506133"],
                isOrganic: true,
            },
            {
                farmer: farmers[1]._id,
                category: catMap["Vegetables"],
                name: "Carrots",
                description: "Crunchy orange carrots, sweet and fresh.",
                price: 50,
                unit: "kg",
                quantityAvailable: 200,
                images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37"],
                isOrganic: true,
            },

            // Vikram (Grains)
            {
                farmer: farmers[2]._id,
                category: catMap["Grains"],
                name: "Basmati Rice",
                description: "Premium long-grain Basmati rice, aromatic and aged.",
                price: 150,
                unit: "kg",
                quantityAvailable: 1000,
                images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c"],
                isOrganic: false,
            },
            {
                farmer: farmers[2]._id,
                category: catMap["Grains"],
                name: "Whole Wheat",
                description: "Golden wheat grains, perfect for making rotis.",
                price: 40,
                unit: "kg",
                quantityAvailable: 2000,
                images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"],
                isOrganic: false,
            },

            // Lakshmi (Spices)
            {
                farmer: farmers[3]._id,
                category: catMap["Spices"],
                name: "Guntur Red Chilli",
                description: "Spicy and fiery red chillies dried in the sun.",
                price: 250,
                unit: "kg",
                quantityAvailable: 500,
                images: ["https://images.unsplash.com/photo-1564466199617-e04870503f6f"],
                isOrganic: false,
            },
            {
                farmer: farmers[3]._id,
                category: catMap["Spices"],
                name: "Turmeric Powder",
                description: "Pure home-ground turmeric powder.",
                price: 200,
                unit: "500g",
                quantityAvailable: 300,
                images: ["https://images.unsplash.com/photo-1615485500704-8e99099928b3"],
                isOrganic: true,
            },

            // Khan (Fruits - Mangoes)
            {
                farmer: farmers[4]._id,
                category: catMap["Fruits"],
                name: "Dussehri Mango",
                description: "Sweetest mangoes from the heart of UP.",
                price: 100,
                unit: "kg",
                quantityAvailable: 100,
                images: ["https://images.unsplash.com/photo-1623862660417-64906f237834"], // generic mango
                isOrganic: false,
            },
            {
                farmer: farmers[4]._id,
                category: catMap["Fruits"],
                name: "Guava",
                description: "Fresh green guavas with pink flesh.",
                price: 60,
                unit: "kg",
                quantityAvailable: 150,
                images: ["https://images.unsplash.com/photo-1536510344784-b43e9772a2c0"],
                isOrganic: true,
            },
        ];

        await Product.insertMany(products);

        console.log("Data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
