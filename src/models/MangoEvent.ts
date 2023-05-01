import mongoose from "mongoose";

const MangoEventSchema = new mongoose.Schema({
    transactionSignature: { type: String, required: true},
    eventName: String,
    blockTime: String,
    eventData: mongoose.Schema.Types.Mixed
});

const MangoEvent = mongoose.model("mangoEvent", MangoEventSchema)

export default MangoEvent;