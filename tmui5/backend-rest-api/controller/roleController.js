const pool = require("../config/db");

// GET all roles from db
const getAllRoles = async (req, res) => {
  console.log("Role: Request GET");

  try {
    const result = await pool.query(
      'SELECT "roleId", "name" FROM "Role" ORDER BY "roleId" ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllRoles };
