export const health = (req, res) => {
  res.json({ status: 'ok', service: 'magic-spa-api' });
};

export const me = (req, res) => {
  res.json({ user: req.user });
};
