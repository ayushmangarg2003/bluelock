// pages/api/match-character.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username } = req.body;

  try {
    const response = await axios.post(
      "https://app.wordware.ai/api/released-app/1a801141-77aa-41ab-b11b-ac6fe5069f33/run",
      {
        inputs: {
          "Twitter Handle": username,
        },
        version: "^1.0",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ww-Jv7KCtylsgEtNjj4ecDdU7nSVfVxmgDO38k1Ez42DlVAOFpJWDkUqr`,
        },
      }
    );

    console.log(response.data.json());

    res.status(200).json(response.data);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred",
    });
  }
}
