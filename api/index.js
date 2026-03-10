// Vercel serverless entry point — minimal test
module.exports = (req, res) => {
  res.status(200).json({ test: 'ok', url: req.url });
};
