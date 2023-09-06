const AssetType = require("../models/assetsType");
const Asset = require("../models/asset");

const CreateTypeController = async (req,res,next)=>{
    try
    {
        const {name}=req.body;
        const assetType = new AssetType({name});
        const newAssetType = await assetType.save();
        res.status(200).json(newAssetType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditTypeController = async (req,res,next)=>{
    try
    {
        const {name}=req.body;
        const assetType = await AssetType.findById(req.params.id);
        if(!assetType)
        {
            return res.status(404).json({message:"type not found."});
        }
        if(name) assetType.name = name;
        const updatedAssetType = await assetType.save();
        res.status(200).json(updatedAssetType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteTypeController = async (req,res,next)=>{
    try
    {
        const assetType = await AssetType.findById(req.params.id);
        if(!assetType)
        {
            return res.status(404).json({message:"type not found."});
        }
        const deletedAssetType = await assetType.deleteOne();
        res.status(200).json(deletedAssetType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetTypesController = async (req,res,next)=>{
    try
    {
        const assetTypes = await AssetType.find();
        res.status(200).json(assetTypes);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetTypeController = async (req,res,next)=>{
    try
    {
        const assetType = await AssetType.findById(req.params.id);
        res.status(200).json(assetType);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const CreateAssetController = async (req,res,next)=>{
    try
    {
        const {type,name,asset_id,to,note,status}=req.body;
        const asset = new Asset({
            type,name,asset_id,to,note,status
        });
        const newAsset = await asset.save();
        res.status(200).json(newAsset);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const EditAssetController = async (req,res,next)=>{
    try
    {
        const {type,name,asset_id,to,note,status}=req.body;
        const asset = await Asset.findById(req.params.id);
        if(!asset)
        {
            return res.status(404).json({message:"asset not found."});
        }
        if(type) asset.type = type;
        if(name) asset.name = name;
        if(asset_id) asset.asset_id = asset_id;
        if(to) asset.to = to;
        if(note) asset.note = note;
        if(status) asset.status = status;
        const updatedAsset = await asset.save();
        res.status(200).json(updatedAsset);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const DeleteAssetController = async (req,res,next)=>{
    try
    {
        const asset = await Asset.findById(req.params.id);
        if(!asset)
        {
            return res.status(404).json({message:"asset not found."});
        }
        const deletedAsset = await asset.deleteOne();
        res.status(200).json(deletedAsset);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetAssetsController = async (req,res,next)=>{
    try
    {
        const assets = await Asset.find().populate("type");
        res.status(200).json(assets);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const GetAssetController = async (req,res,next)=>{
    try
    {
        const asset = await Asset.findById(req.params.id);
        if(!asset)
        {
            return res.status(404).json({message:"asset not found."});
        }
        res.status(200).json(asset);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

const UploadAssetsController = async (req,res,next)=>{
    try
    {  
        const csvData = req.csvData;
        const assets = [];  
        for (let data of csvData) {
            const type = await AssetType.findOne({name:data.type});
            if(type)
            {
                data.type = type._id;
                const asset = new Asset(data);
                const newAsset = await asset.save();
                assets.push(newAsset);
            }
        }
        res.status(200).json({assets});
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
};

module.exports = {
    CreateTypeController,
    EditTypeController,
    DeleteTypeController,
    GetTypesController,
    GetTypeController,
    CreateAssetController,
    EditAssetController,
    DeleteAssetController,
    GetAssetsController,
    GetAssetController,
    UploadAssetsController,
}