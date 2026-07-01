const dotenv = require('dotenv');
dotenv.config();

const Groq = require('groq-sdk');
const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('Using GROQ_API_KEY:', GROQ_API_KEY ? 'Present' : 'Missing');

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello, say test",
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 10,
    });
    console.log('Success! Reply:', chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error occurred:', error.message || error);
    if (error.status) console.error('Status code:', error.status);
    if (error.headers) console.error('Headers:', error.headers);
  }
}

test();
