const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const User = require("./models/UserModel");
const FarmerProfile = require("./models/FarmerProfileModel");

dotenv.config();

const verifyDebug = async () => {
    await connectDB();

    try {
        const farmers = await User.find({ role: "farmer" });
        console.log(`Farmers found: ${farmers.length}`);
        farmers.forEach(f => console.log(` - ${f.name} (${f._id})`));

        const profiles = await FarmerProfile.find();
        console.log(`FarmerProfiles found: ${profiles.length}`);
        profiles.forEach(p => console.log(` - Profile for user: ${p.user}`));

    } catch (error) {
        console.error("Error verifying database:", error);
    } finally {
        mongoose.connection.close();
    }
};

verifyDebug();
