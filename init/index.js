const mongoose=require("mongoose")
const Data=require("./data")
const Listing=require("../models/listing")

const initDB=async () => {
    await Listing.deleteMany({})
    const updatedData=Data.map((obj) => ({...obj,owner:'67b34dd804a0bd3ae616b1c7'}))
    await Listing.insertMany(updatedData)
    console.log("Data was initialized")
}

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
        console.log("Connected to MongoDB")
        await initDB()
    } catch (error) {
        console.log("Error:",error)
    }
}  

main()