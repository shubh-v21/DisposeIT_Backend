import mongoose, {Schema} from "mongoose";

const pickupreqSchema = new Schema(
    {
        requestId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
            lowecase: true,
            trim: true, 
        },
        centerId: {
            type: Schema.Types.ObjectId,
            ref:"Center",
            required: true,
            trim: true, 
            index: true
        },
       
        pickupDate: {
            type: Date,
            required: true
        },
        pickupTime: {
            type: String,
            required: true
        },
        pickupStatus: {
            type: Boolean
        }
        
    },
    {
        timestamps: true
    }
)

export const PickupReq = mongoose.model("PickupReq" , pickupreqSchema);