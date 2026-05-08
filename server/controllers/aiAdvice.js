const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getAdvice = async (req, res) => {
  try {
    const {
      developerName,
      month,
      leadTime,
      cycleTime,
      deployments,
      prs,
      bugRate,
    } = req.body;

    const prompt = `
You are a senior engineering productivity coach.

Analyze this developer's metrics for ${month}.

Developer: ${developerName}

Metrics:
- Lead Time: ${leadTime} days
- Cycle Time: ${cycleTime} days
- Deployment Frequency: ${deployments}
- PR Throughput: ${prs}
- Bug Rate: ${bugRate}%

Tasks:
1. Explain what these metrics suggest
2. Mention strengths
3. Mention risks/problems
4. Give 3 practical recommendations

Keep answer concise and personalized.
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const advice =
      completion.choices[0].message.content;

    res.json({ advice });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to generate advice",
    });
  }
};

module.exports = getAdvice;
