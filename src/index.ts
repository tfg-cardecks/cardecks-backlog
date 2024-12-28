import { redBright } from "colorette";

//local imports
import app from "./app";
import { PORT } from "./config";
import { connectDB } from "./db";

void connectDB();
app.listen(PORT, () => {
  console.log(redBright(`Server is running on http://localhost:${PORT}`));
});
