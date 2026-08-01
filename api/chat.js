// api/chat.js - Secure Serverless Proxy Endpoint

export default async function handler(req, res) {
  // 1. Block any non-POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid user message is required.' });
    }

    // 2. Read the secret key from the .env environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return res.status(500).json({ error: 'Server misconfiguration.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 3. Define System Context & Instructions
    const payload = {
      systemInstruction: {
        parts: [{
          text: `You are Prabhat Neupane's AI Virtual Assistant on his portfolio website.
          - Knowledge: Prabhat specializes in C, C++, JavaScript, HTML5, CSS3, Systems Programming, and Web Development.
          - Style: Professional, friendly, and concise (maximum 3 sentences per reply).
          - Objective: Answer visitor queries and encourage them to check out Prabhat's project portfolio or use the contact form.`
        }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    };

    // 4. Server-to-Server request to Google Gemini
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errDetails = await response.text();
      console.error("Gemini API Error details:", errDetails);
      return res.status(response.status).json({ error: 'Failed to fetch response from Gemini API.' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble phrasing an answer right now. Please try again!";

    // 5. Send clean response back to browser
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Internal Proxy Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}