export default async function handler(req, res) {
  // 1. Ensure method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please send a POST request.' });
  }

  // 2. Extract message from request body
  const { message } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Bad Request: "message" field is required.' });
  }

  // 3. Retrieve environment variable from Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Vercel Backend Error: GEMINI_API_KEY environment variable is not defined.");
    return res.status(500).json({ error: 'Server Configuration Error: GEMINI_API_KEY is missing on Vercel.' });
  }

  try {
    // 4. Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    // 5. Check if Gemini API returned an HTTP error
    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Failed to communicate with Google Gemini API.' 
      });
    }

    // 6. Safely extract generated text from response
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(500).json({ error: 'No response text returned from Gemini API.' });
    }

    // 7. Send successful response back to frontend
    return res.status(200).json({ reply: replyText });

  } catch (err) {
    console.error("Serverless Function Exception:", err);
    return res.status(500).json({ error: 'Internal Server Error while reaching backend API.' });
  }
}
