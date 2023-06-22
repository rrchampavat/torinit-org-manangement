const config = require("./knexfile")["development"];
import knex from "knex";

module.exports = knex(config);
