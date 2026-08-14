const isAdmin = (req, res, next) => {
  const userRole = req.headers['x-user-role']; 

  if (userRole === 'admin') {
    return next();
  }

  return res.status(403).json({ 
    message: 'Acesso negado! Esta área é restrita a administradores.' 
  });
};

module.exports = { isAdmin };