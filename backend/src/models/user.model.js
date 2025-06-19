const mongoose=require("mongoose")

const bycrypt = require("bycrypt");

const UserSchema = new mongoose.Schema(
    {
        fullName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type:String, required: true},
        address: {type: String, required: true},
        district: {type:String, required: true},
        state: {type:String, required: true},
        city: {type:String, required: true},
        pin: {type:Number, required: true}
    }
)

//Hash password before saving
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password,10);
    next();
})

//Compare passwords
UserSchema.methods.comparePasswords = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password);
}

module.exports = mongoose.model("User",UserSchema);