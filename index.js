import config from "./appConfig.js";
import db from "./src/service/DbService.js";
import BtcTurkService from "./src/service/BtcTurkService.js";
import TickerHandler from "./src/service/AppService.js";
import BinanceService from "./src/service/BinanceService.js";

const tickerHandler = new TickerHandler(db.PriceEntry);

db.sequelize.sync({ force: true }); //truncate all tables in database

const btcTurk = new BtcTurkService(config.exhangeList[0].wsUrl, tickerHandler);
const binance = new BinanceService(config.exhangeList[1].wsUrl, tickerHandler);

btcTurk.connectToServer();
binance.connectToServer();
setTimeout(() => {
  config.currencyList.forEach((currency) => btcTurk.subscribeTo(currency));
  config.currencyList.forEach((currency) => binance.subscribeTo(currency));
}, 2000);
