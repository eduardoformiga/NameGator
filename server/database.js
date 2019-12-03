const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "admin",
  host: "localhost",
  database: "namegator",
  port: 5432
});

client.connect();

exports.execute = (query, values) => {
  return new Promise((resolve, reject) => {
    client.query(query, values, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
};
