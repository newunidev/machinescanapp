const ITAsset = require('../model/it_asset');
const { Op } = require('sequelize');
const ITCategory = require('../model/it_category');

const ITAssetController = {
  // Create a new IT asset
  async createItAsset(req, res) {
    try {
      const { serial_no, brand, name, processor, os, storage, ram, virus_guard, condition, supplier, description, itCategoryId } = req.body;
      
      if (!serial_no || !name || !itCategoryId) {
        return res.status(400).json({ success: false, message: 'serial_no, name, and itCategoryId are required' });
      }
      
      // Check if asset already exists
      const existingAsset = await ITAsset.findOne({ where: { serial_no } });
      if (existingAsset) {
        return res.status(400).json({ success: false, message: 'Asset with this serial number already exists' });
      }

      // Create the asset
      const asset = await ITAsset.create({ serial_no, brand, name, processor, os, storage, ram, virus_guard, condition, supplier, description, itCategoryId });
      
      res.status(201).json({ success: true, message: 'IT Asset created successfully', asset });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating IT Asset', error: error.message });
    }
  },

  // Get all IT assets with optional filtering by brand or category
  async getAllItAssets(req, res) {
    try {
      const { brand, itCategoryId } = req.query;
      let condition = {};

      if (brand) {
        condition.brand = { [Op.like]: `%${brand}%` };
      }
      if (itCategoryId) {
        condition.itCategoryId = itCategoryId;
      }

      const assets = await ITAsset.findAll({ where: condition });
      res.status(200).json({ success: true, assets });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching IT assets', error: error.message });
    }
  },

  // Get a single IT asset by asset_id
  async getOne(req, res) {
    try {
      const { asset_id } = req.query;
      if (!asset_id) {
        return res.status(400).json({ success: false, message: 'asset_id is required' });
      }

      const asset = await ITAsset.findOne({ where: { asset_id }, include: ITCategory });
      if (!asset) {
        return res.status(404).json({ success: false, message: 'IT Asset not found' });
      }

      res.status(200).json({ success: true, asset });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching IT Asset', error: error.message });
    }
  },

  // Update an IT asset
  async update(req, res) {
    try {
      const { asset_id } = req.query;
      if (!asset_id) {
        return res.status(400).json({ success: false, message: 'asset_id is required' });
      }

      const [updated] = await ITAsset.update(req.body, { where: { asset_id } });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'IT Asset not found or no changes made' });
      }

      res.status(200).json({ success: true, message: 'IT Asset updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating IT Asset', error: error.message });
    }
  },

  // Delete an IT asset
  async delete(req, res) {
    try {
      const { asset_id } = req.query;
      if (!asset_id) {
        return res.status(400).json({ success: false, message: 'asset_id is required' });
      }

      const deleted = await ITAsset.destroy({ where: { asset_id } });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'IT Asset not found' });
      }

      res.status(200).json({ success: true, message: 'IT Asset deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting IT Asset', error: error.message });
    }
  },


  // Create or update IT assets in bulk
  async createOrUpdateItAssets(req, res) {
    try {
      const assetsToProcess = req.body.assets; // Expecting an array of IT assets

      // Validate that the input is an array
      if (!Array.isArray(assetsToProcess)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of assets.',
        });
      }

      const processedAssets = [];

      for (const assetData of assetsToProcess) {
        // Log the serial number being processed
        console.log(`Processing asset with serial number: ${assetData.serial_no}`);

        // Use findOrCreate to create a new asset or retrieve the existing one
        const [asset, created] = await ITAsset.findOrCreate({
          where: { serial_no: assetData.serial_no }, // Use serial_no as the unique identifier
          defaults: assetData,
          individualHooks: true, // Trigger hooks
        });

        // If the asset was found, update it
        if (!created) {
          // If the categories are different, skip the update
          if (asset.itCategoryId !== assetData.itCategoryId) {
            console.log(`Skipping update for asset ${assetData.serial_no}. Categories do not match.`);
            continue; // Skip to the next asset without updating
          }

          // Otherwise, update the asset
          await asset.update(assetData, {
            individualHooks: true, // Trigger hooks during update
          });
        }

        processedAssets.push(asset);
      }

      res.status(200).json({
        success: true,
        message: 'IT assets processed successfully',
        assets: processedAssets,
      });
    } catch (error) {
      console.error('Error processing IT assets:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Get IT asset details by asset_code with category name
  async getItAssetByAssetCode(req, res) {
    try {
      const { asset_code } = req.query;
  
      if (!asset_code) {
        return res.status(400).json({ success: false, message: 'asset_code is required' });
      }
  
      // Find IT asset by asset_code and include the entire ITCategory model
      const asset = await ITAsset.findOne({
        where: { asset_id: asset_code }, // Use asset_code as the identifier
        include: [{
          model: ITCategory,
          attributes: ['cat_id', 'cat_name'], // Remove description if not needed
          as: 'ITCategory', // Use the alias defined in the association
        }],
      });
  
      if (!asset) {
        return res.status(404).json({ success: false, message: 'IT Asset not found' });
      }
  
      // Respond with asset details including the whole ITCategory model
      res.status(200).json({
        success: true,
        asset: {
          asset_id: asset.asset_id,
          serial_no: asset.serial_no,
          brand: asset.brand,
          name: asset.name,
          processor: asset.processor,
          os: asset.os,
          storage: asset.storage,
          ram: asset.ram,
          virus_guard: asset.virus_guard,
          condition: asset.condition,
          supplier: asset.supplier,
          description: asset.description,
          itCategory: asset.ITCategory, // Include the whole category model
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching IT Asset details',
        error: error.message,
      });
    }
  }
  
};

module.exports = ITAssetController;
