const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;  // Render provides dynamic port

// Your Render deploy hook URL
const deployHookUrl = "https://api.render.com/deploy/srv-cvs3i5s9c44c739oaf70?key=hQ-0tVwJwGs";

// Serve the HTML page with the restart button at the root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restart Website</title>
    </head>
    <body>
      <h1>Click the button below to restart the service</h1>
      <button id="restartButton">Restart</button>
      <script>
        document.getElementById('restartButton').addEventListener('click', async function() {
          try {
            const response = await fetch('/restart', { method: 'POST' });
            const data = await response.json();
            alert(data.message);
          } catch (error) {
            alert('Failed to trigger restart');
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Endpoint to trigger the deploy hook when the button is pressed
app.post("/restart", async (req, res) => {
  try {
    // Trigger the Render deploy hook
    const response = await axios.post(deployHookUrl, {}, {
      headers: {
        'Authorization': `Bearer rnd_MDCB3izGs5qFQlDXtzMEgX29Iqmn`  // Add your Render API key here
      }
    });

    if (response.status === 200) {
      res.json({ message: "Service restarted successfully!" });
    } else {
      res.status(500).json({ message: "Failed to restart service" });
    }
  } catch (error) {
    console.error("Error triggering deploy hook:", error);
    res.status(500).json({ message: "Failed to trigger restart" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
