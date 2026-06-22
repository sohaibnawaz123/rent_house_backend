const { users } = require("../db/models");

const getUsers = async (req, res) => {
    try {
        const usersData = await users.findAll();
        return res.status(200).json({ message: "Success", data: usersData });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ message: "First name and last name are required." });
        }

        const user = await users.create({ first_name, last_name, email, password });
        return res.status(201).json({ message: "User created", data: user });
    } catch (error) {
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, first_name, last_name } = req.body;

        if (!id || (!first_name && !last_name)) {
            return res.status(400).json({ message: "ID and at least one field to update are required." });
        }

        const [updated] = await users.update(
            { first_name, last_name },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found." });
        }

        const updatedUser = await users.findByPk(id);
        return res.status(200).json({ message: "User updated", data: updatedUser });
    } catch (error) {
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const deleted = await users.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(204).json(); // No content
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
