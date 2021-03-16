import { Sequelize } from "sequelize";
import { getPriceEntryDefinition } from "../model/PriceEntry.js";
const db = {};

db.sequelize = new Sequelize("postgresql://eu:@localhost:5432/eu");

db.PriceEntry = getPriceEntryDefinition(db.sequelize);

export default db;
