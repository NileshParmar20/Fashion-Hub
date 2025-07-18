import { Product } from "../models/Product.js";

export const createProduct = async (req, res)=>{
    try {
        let product = await Product.create(req.body);
        res.status(201).json({success:true, message:"product added",product});

    } catch (error) {
        res.status(500).json({message:"something went wrong",error:error.message});
    }
};

export const getProducts = async(req,res)=>{
    try{
        let products = await Product.find().populate("category");
        res.status(200).json({success:true,products});
    }catch (error){
        res.status(500).json({success:false,error:error.message})
    }
};

export const getProduct = async(req,res)=>{
    try{
        let product = await Product.findById(req.params.id).populate("category");
        res.status(404).json({success:false,message:"Product not Found"});
        res.status(200).json({success:true,product});
    }catch (error){
        res.status(500).json({success:false,error:error.message})
    }
};

export const updateProduct = async(req,res)=>{
    try{
        let product = await Product.findByIdAndUpdate(req.params.id,req.body, {
            new:true,
        })
        res.status(200).json({success:true,product,message: "Prodct updated"});
    }catch (error){
        res.status(500).json({success:false,error:error.message})
    }
};

export const deleteProduct = async(req,res)=>{
    try{
        let product = await Product.findByIdAndDelete(req.params.id,);
        res.status(200).json({success:true,product,message: "Prodct updated"});
    }catch (error){
        res.status(500).json({success:false,error:error.message})
    }
};

