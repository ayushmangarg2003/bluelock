// import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username } = req.body;

  const API_KEY = "ww-Jv7KCtylsgEtNjj4ecDdU7nSVfVxmgDO38k1Ez42DlVAOFpJWDkUqr";
  const appId = "1a801141-77aa-41ab-b11b-ac6fe5069f33";

  try {
    // Start the API request and handle the stream
    const r = await fetch(
      `https://app.wordware.ai/api/released-app/${appId}/run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {
            "Twitter Handle": username,
          },
          version: "^1.2",
        }),
      }
    );

    if (!r.ok) {
      console.error("Run failed:", await r.json());
      return res.status(500).json({ message: `Run failed: ${r.status}` });
    }

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buffer = [];
    let result = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        for (let i = 0; i < chunk.length; i++) {
          const isChunkSeparator = chunk[i] === "\n";

          // Keep buffering unless we've hit the end of a data chunk
          if (!isChunkSeparator) {
            buffer.push(chunk[i]);
            continue;
          }

          // Process the completed chunk
          const line = buffer.join("").trimEnd();

          try {
            const content = JSON.parse(line);
            const value = content.value;

            if (value.type === "chunk") {
              result += value.value ?? "";
            } else if (value.type === "outputs") {
              console.log("Final outputs:", value);
            }
          } catch (parseError) {
            console.error("Error parsing chunk:", line);
          }

          buffer = [];
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Return the streamed result
    res.status(200).json({ result });
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
