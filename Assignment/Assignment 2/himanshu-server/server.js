const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
require("dotenv").config();

app.use(express.json());
app.use("/api/items", itemsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
