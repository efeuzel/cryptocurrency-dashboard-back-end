import DataTypes from "sequelize";

const getPriceEntryDefinition = (sequelize) => {
  const PriceEntry = sequelize.define("price_entry", {
    exchange: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    bestBid: {
      type: DataTypes.DOUBLE,
    },
    bestBidQuantity: {
      type: DataTypes.DOUBLE,
    },
    bestAsk: {
      type: DataTypes.DOUBLE,
    },
    bestAskQuantity: {
      type: DataTypes.DOUBLE,
    },
  });

  return PriceEntry;
};

export { getPriceEntryDefinition };
