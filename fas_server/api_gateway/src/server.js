import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
