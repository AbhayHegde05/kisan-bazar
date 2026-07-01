const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const Product = require("./models/ProductModel");
const Category = require("./models/CategoryModel");
const User = require("./models/UserModel");
const FarmerProfile = require("./models/FarmerProfileModel");

dotenv.config();

const farmers = [
    {
        name: "Ram Singh",
        email: "ram.singh@example.com",
        password: "password123",
        role: "farmer",
        phone: "9876543210",
        address: {
            street: "123 Kisan Marg",
            city: "Gaon",
            state: "Pradesh",
            zipCode: "123456",
        },
    },
    {
        name: "Ramesh Kumar",
        email: "ramesh.kumar@example.com",
        password: "securepassword",
        role: "farmer",
        phone: "9876543211",
        address: {
            street: "45 Green Lane",
            city: "Mysore",
            state: "Karnataka",
            zipCode: "570001",
        },
    },
    {
        name: "Sita Devi",
        email: "sita.devi@example.com",
        password: "securepassword",
        role: "farmer",
        phone: "9876543212",
        address: {
            street: "12 Farm Road",
            city: "Jaipur",
            state: "Rajasthan",
            zipCode: "302001",
        },
    },
];

const categories = [
    {
        name: "Vegetables",
        description: "Fresh, organic, and locally grown vegetables.",
        icon: "🥕",
    },
    {
        name: "Fruits",
        description: "Seasonal and exotic fruits straight from the orchard.",
        icon: "🍎",
    },
    {
        name: "Grains",
        description: "High-quality rice, wheat, and other essential grains.",
        icon: "🌾",
    },
];

const products = [
    {
        name: "Fresh Organic Tomatoes",
        description: "Juicy, ripe tomatoes grown using organic farming methods. Perfect for salads, sauces, and sandwiches.",
        price: 60.0,
        categoryName: "Vegetables",
        unit: "kg",
        quantityAvailable: 100,
        isOrganic: true,
        images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070"],
    },
    {
        name: "Crisp Green Apples",
        description: "Sweet and tangy green apples, great for snacking or baking into a delicious pie.",
        price: 120.0,
        categoryName: "Fruits",
        unit: "kg",
        quantityAvailable: 80,
        isOrganic: false,
        images: ["https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070"],
    },
    {
        name: "Farm Fresh Carrots",
        description: "Bright orange carrots, rich in vitamins. Harvested fresh from the farm.",
        price: 40.0,
        categoryName: "Vegetables",
        unit: "kg",
        quantityAvailable: 150,
        isOrganic: true,
        images: ["https://images.unsplash.com/photo-1590431306482-f700ee050c59?q=80&w=1974"],
    },
    {
        name: "Basmati Rice",
        description: "Long-grain aromatic basmati rice, perfect for biryani and pulao.",
        price: 150.0,
        categoryName: "Grains",
        unit: "kg",
        quantityAvailable: 200,
        isOrganic: false,
        images: ["https://images.unsplash.com/photo-1586201375765-c1235d56e42b?q=80&w=1974"],
    },
    {
        name: "Organic Spinach",
        description: "Tender organic spinach leaves, packed with iron and nutrients.",
        price: 30.0,
        categoryName: "Vegetables",
        unit: "bunch",
        quantityAvailable: 50,
        isOrganic: true,
        images: ["https://images.unsplash.com/photo-1576045057995-568f588f21ea?q=80&w=1974"],
    },
    {
        name: "Organic Wheat",
        description: "High-quality organic wheat grown using sustainable practices.",
        price: 50.0,
        categoryName: "Grains",
        unit: "kg",
        quantityAvailable: 200,
        isOrganic: true,
        images: ["https://example.com/images/organic-wheat.jpg"],
    },
    {
        name: "Fresh Mangoes",
        description: "Sweet and juicy mangoes harvested fresh from the farm.",
        price: 100.0,
        categoryName: "Fruits",
        unit: "kg",
        quantityAvailable: 150,
        isOrganic: false,
        images: ["https://example.com/images/fresh-mangoes.jpg"],
    },
];

const seedDB = async () => {
    await connectDB();

    try {
        console.log("Clearing existing data...");
        await Product.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({ role: "farmer" });
        await FarmerProfile.deleteMany({});

        console.log("Seeding farmers...");
        for (const farmerData of farmers) {
            await User.create(farmerData);
        }

        // Seed Farmer Profiles
        console.log("Seeding farmer profiles...");
        const createdFarmers = await User.find({ role: "farmer" });

        for (const farmer of createdFarmers) {
            const profile = new FarmerProfile({
                user: farmer._id,
                farmName: `${farmer.name}'s Farm`,
                description: `Experience the best organic produce from the fields of ${farmer.address.city}. We are dedicated to sustainable farming.`,
                farmImages: [`https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop`],
                farmingPractices: ["Organic", "Sustainable", "Eco-friendly"],
                establishedYear: 2015,
                deliveryRadius: 15,
                acceptsPickup: true,
                acceptsDelivery: true,
                isVerified: true
            });
            await profile.save();
        }

        console.log("Seeding categories...");
        for (const categoryData of categories) {
            await Category.create(categoryData);
        }

        console.log("Seeding products...");
        const farmer = await User.findOne({ role: "farmer" });
        for (const productData of products) {
            const category = await Category.findOne({ name: productData.categoryName });
            if (!category) {
                console.warn(`Category not found for product: ${productData.name}`);
                continue;
            }
            const newProduct = new Product({
                ...productData,
                category: category._id,
                farmer: farmer._id,
            });
            await newProduct.save();
        }

        console.log("Database seeded successfully!!!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedDB();
