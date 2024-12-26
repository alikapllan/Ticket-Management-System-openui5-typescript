const pool = require("../config/db");

// GET all customers
const getAllCustomers = async (req, res) => {
  console.log("Customer: Request GET");

  try {
    const result = await pool.query(
      `
      SELECT 
        "customerId", 
        TRIM("name") AS "name",
        TRIM("email") AS "email",
        "phone"
       FROM "Customer" 
       ORDER BY "customerId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a customer
const createCustomer = async (req, res) => {
  const { name, email, phone } = req.body;

  console.log("Customer: Request body POST:", req.body);

  try {
    const result = await pool.query(
      'INSERT INTO "Customer" ("name", "email", "phone", "createdAt") VALUES ($1, $2, $3, NOW()::timestamp) RETURNING *',
      [name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  console.log("Customer: Request body DELETE, customerId: ", id);

  try {
    await pool.query('DELETE FROM "Customer" WHERE "customerId" = $1', [id]);
    res.status(204).send(); // nocontent
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCustomers, createCustomer, deleteCustomer };
