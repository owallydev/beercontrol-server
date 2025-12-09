// ===============================
// Controller de Estações (Totens / Máquinas)
// ===============================
import jwt from "jsonwebtoken";

// Gera um token de autorização para a estação se registrar / comunicar
export const generateToken = (req, res) => {
  const { stationId } = req.body;

  if (!stationId) {
    return res.status(400).json({ error: "stationId é obrigatório" });
  }

  try {
    const token = jwt.sign(
      { stationId },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Erro ao gerar token de estação:", err);
    return res.status(500).json({ error: "Erro interno ao gerar token" });
  }
};
