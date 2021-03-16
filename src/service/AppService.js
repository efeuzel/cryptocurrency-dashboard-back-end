class TickerHandler {
  constructor(dbObjectDefinition) {
    this.dbObjectDefinition = dbObjectDefinition;
  }

  handleTicker(
    exchangeName,
    currencyName,
    bestBid,
    bestBidQuantity,
    bestAsk,
    bestAskQuantity
  ) {
    this.dbObjectDefinition.create({
      exchange: exchangeName,
      currency: currencyName,
      bestBid: bestBid,
      bestBidQuantity: bestBidQuantity,
      bestAsk: bestAsk,
      bestAskQuantity: bestAskQuantity,
    });
  }
}

export default TickerHandler;
