// model/association.js

const GRN = require("./grn");
const GRN_RentMachine = require("./grn_rent_machine");

function setupGRNAssociations() {
  // GRN has many GRN_RentMachine
  GRN.hasMany(GRN_RentMachine, {
    foreignKey: "grn_id",
    sourceKey: "grn_id",
    
  });

  // GRN_RentMachine belongs to GRN
  GRN_RentMachine.belongsTo(GRN, {
    foreignKey: "grn_id",
    targetKey: "grn_id",
    
  });
}

module.exports = { setupGRNAssociations };
