import app from "./app";
import { env } from "./config/env";

// app.listen(env.PORT, () => {
//   console.log(`Server running on port ${env.PORT}`);
// });


app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
