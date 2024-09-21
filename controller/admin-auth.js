const ownerModel = require("../models/Owner");
const bcrypt = require("bcrypt");
const {generateToken} = require("../utils/generateTokens");

module.exports.register = async (req,res)=>{
    const owner = await ownerModel.findOne();
    if(owner){
        return res.send("You can't create account");
    }
    let {fullname, email, password} = req.body;
    const bcrypt = require("bcrypt");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new owner
    let New_Owner = await ownerModel.create({
        fullname,
        email,
        password: hashedPassword // Store the hashed password
    });

    res.send("Owner account created successfully.");
}

module.exports.login = async (req,res) => {
    let {email , password} = req.body;
    const owner = await ownerModel.findOne({email : email});
    if(!owner){
        return res.send("WRONG EMAIL");
    }
    else{
        bcrypt.compare(password, owner.password,(err, isMatch) => {
            if(err){
                console.log(err.message);
            }
            if(isMatch){
                let token = generateToken(owner);
                res.cookie("token",token);
                res.render("createproduct");
            }
            else{
                return res.send("WRONG PASSWORD");
            }
        })
    }
}