import Address from "../models/Address.js"


//Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body
        // await Address.create({ ...address, userId })
        await Address.create({
            userId: req.userId,
            ...req.body
        });
        res.json({ success: true, message: "Address Added Successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Add Address : /api/address/get

export const getAddress = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.userId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

