import express, { Request, Response } from 'express';
import cors from 'cors';
import pg from 'pg';
import crypto from 'crypto';
import path from 'path';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3333;

// 🔓 CORS: Permite que o Dashboard (React) se comunique com a API
app.use(cors({ origin: '*' }));
app.use(express.json());

// ==========================================
// 🗄️ CONEXÃO COM O BANCO DE DADOS
// ==========================================
// Se estiver no Railway, usa a variável de ambiente. Se estiver no PC, usa o seu WSL.
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: 'postgres',
        host: '172.20.144.1',
        database: 'postgres',
        password: 'inazuma',
        port: 5432,
      }
);

pool.connect()
  .then(() => console.log('[+] Connected to PostgreSQL database successfully!'))
  .catch(err => console.error('[!] Database connection error:', err.stack));

// ==========================================
// 🚀 ENDPOINTS DA API
// ==========================================

// 1. Validação do C# Loader (Verifica Chave, HWID e Tempo)
app.get('/validate', async (req: Request, res: Response) => {
  const { license, hwid } = req.query;

  if (!license || !hwid) {
    return res.status(400).json({ error: "Missing license or hwid parameters" });
  }

  const keyString = license.toString();
  const hwidString = hwid.toString();

  try {
    const result = await pool.query('SELECT * FROM licenses WHERE key = $1', [keyString]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ status: "invalid", message: "License not found" });
    }

    const foundLicense = result.rows[0];

    // Verifica se a chave foi banida ou já usada
    if (!foundLicense.is_active) {
      return res.status(403).json({ status: "expired", message: "License is banned or already used" });
    }

    // 🔒 SEGURANÇA HWID
    if (foundLicense.hwid) {
      if (foundLicense.hwid !== hwidString) {
        return res.status(403).json({ status: "invalid_hwid", message: "Locked to another PC" });
      }
    } else {
      // Primeiro uso: Trava o HWID na chave
      await pool.query('UPDATE licenses SET hwid = $1 WHERE key = $2', [hwidString, keyString]);
      console.log(`[+] Key ${keyString} linked to HWID: ${hwidString}`);
    }

    // 🧠 REGRAS DE PREFIXO
    if (keyString.startsWith('SORA-ONCE-')) {
      // Kamikaze: Queima após o uso
      await pool.query('UPDATE licenses SET is_active = false WHERE key = $1', [keyString]);
      console.log(`[-] Key ${keyString} burned after single use.`);
    } 
    else if (keyString.startsWith('SORA-TIME-')) {
      // Trial: 24 horas a partir do primeiro login
      if (!foundLicense.expires_at) {
        await pool.query("UPDATE licenses SET expires_at = NOW() + INTERVAL '24 hours' WHERE key = $1", [keyString]);
        console.log(`[*] Cronometer started for ${keyString}.`);
      } else if (new Date() > new Date(foundLicense.expires_at)) {
        await pool.query('UPDATE licenses SET is_active = false WHERE key = $1', [keyString]);
        return res.status(403).json({ status: "expired", message: "Trial period ended" });
      }
    }

    return res.status(200).json({ 
      status: "active", 
      type: keyString.split('-')[1] || 'UNKNOWN'
    });

  } catch (err) {
    console.error("Validate Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 2. Gerador de Chaves Seguras
app.post('/generate', async (req: Request, res: Response) => {
  const type = req.body.type || 'TIME'; 
  
  const secureHash = crypto.randomBytes(8).toString('hex').toUpperCase();
  
  const block1 = secureHash.slice(0, 8);
  const block2 = secureHash.slice(8, 16);
  
  const newKey = `SORA-${type}-${block1}-${block2}`;
  
  try {
    await pool.query('INSERT INTO licenses (key) VALUES ($1)', [newKey]);
    return res.status(201).json({ key: newKey });
  } catch (err) {
    console.error("Generate Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 3. Listar todas as licenças (Usado pelo Dashboard React)
app.get('/licenses', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, key, is_active, hwid, expires_at FROM licenses ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("List Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 4. Resetar HWID (Usado pelo Dashboard React)
app.post('/reset-hwid', async (req: Request, res: Response) => {
  const { key } = req.body;
  
  if (!key) {
    return res.status(400).json({ error: "Key is required" });
  }

  try {
    await pool.query('UPDATE licenses SET hwid = NULL WHERE key = $1', [key]);
    return res.status(200).json({ message: "HWID reset successfully" });
  } catch (err) {
    console.error("Reset Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 5. Rota de Login do Painel Admin
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1 AND password = $2', [email, password]);
    
    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, message: "Login autorizado" });
    } else {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// 6. Rota de Download Seguro do Core para Memória
app.get('/download-core', (req: Request, res: Response) => {
  // ATENÇÃO: Para funcionar no Railway, o spoofer.exe precisará estar dentro da pasta do projeto!
  // Por enquanto, configurei para procurar um arquivo "spoofer.exe" na mesma pasta da API.
  const filePath = path.join(__dirname, 'spoofer.exe'); 
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Erro ao enviar o spoofer:", err);
      return res.status(404).json({ error: "Módulo central não encontrado no servidor." });
    } else {
      console.log("[+] Spoofer transmitido com sucesso para a memória do Loader!");
    }
  });
});

// ==========================================
// 🎧 INICIANDO O SERVIDOR
// ==========================================
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[+] Sora API is running on port ${PORT}`);
});