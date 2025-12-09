// ===============================
// Controller de Autenticação
// ===============================
import jwt from "jsonwebtoken";

// Login extremamente simples só para começar
// Depois ligamos com banco de dados / usuários reais
export const login = (req, res) => {
  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ error: "Informe usuário e senha" });
  }

  // Usuário fixo por enquanto
  if (user !== "admin" || pass !== "123") {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  try {
    const token = jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Erro ao gerar token de login:", err);
    return res.status(500).json({ error: "Erro interno ao gerar token" });
  }
};
