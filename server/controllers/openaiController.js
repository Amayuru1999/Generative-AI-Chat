const dotenv = require("dotenv");
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);






const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


exports.runController = async (req, res) => {
  try {
    // Extract the prompt from the request body
    const { prompt } = req.body;

    // Check if the required data is present
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the provided prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text back to the client
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Error in runController:", error);
    return res.status(500).json({ message: "Error generating content", error: error.message });
  }
};

exports.summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Summarize this" }, { role: "user", content: text }],
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data && response.data.choices[0].message.content) {
      return res.status(200).json(response.data.choices[0].message.content);
    }
    throw new Error('No response text');
  } catch (err) {
    console.error('Error in summaryController:', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.paragraphController = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Write a detailed paragraph about this" }, { role: "user", content: text }],
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data && response.data.choices[0].message.content) {
      return res.status(200).json(response.data.choices[0].message.content);
    }
    throw new Error('No response text');
  } catch (err) {
    console.error('Error in paragraphController:', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Chat with the user" }, { role: "user", content: text }],
      max_tokens: 300,
      temperature: 0.7,
    });
    if (response.data && response.data.choices[0].message.content) {
      return res.status(200).json(response.data.choices[0].message.content);
    }
    throw new Error('No response text');
  } catch (err) {
    console.error('Error in chatbotController:', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.jsconverterController = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Convert these instructions into JavaScript code" }, { role: "user", content: text }],
      max_tokens: 400,
      temperature: 0.25,
    });
    if (response.data && response.data.choices[0].message.content) {
      return res.status(200).json(response.data.choices[0].message.content);
    }
    throw new Error('No response text');
  } catch (err) {
    console.error('Error in jsconverterController:', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.scifiImageController = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.createImage({
      prompt: `Generate a sci-fi image of ${text}`,
      n: 1,
      size: "512x512",
    });
    if (response.data && response.data.data[0].url) {
      return res.status(200).json(response.data.data[0].url);
    }
    throw new Error('No image URL found');
  } catch (err) {
    console.error('Error in scifiImageController:', err.response ? err.response.data : err.message);
    return res.status(500).json({ message: err.message });
  }
};
