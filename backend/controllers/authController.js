// Auth işlemleri için controller
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const jwtSecret = process.env.JWT_SECRET || 'recipe-app-dev-secret';

function toPublicUser(row) {
	return {
		id: row.id,
		fullName: row.full_name,
		email: row.email,
		role: row.role
	};
}

function readBearerToken(req) {
	const auth = req.headers.authorization || '';
	if (!auth.startsWith('Bearer ')) {
		return null;
	}
	return auth.slice('Bearer '.length).trim();
}

function createToken(user) {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
			role: user.role
		},
		jwtSecret,
		{ expiresIn: '7d' }
	);
}

export async function register(req, res) {
	const fullName = String(req.body?.fullName || '').trim();
	const email = String(req.body?.email || '').trim().toLowerCase();
	const password = String(req.body?.password || '');

	if (!fullName || !email || !password) {
		return res.status(400).json({
			message: 'fullName, email ve password zorunlu.'
		});
	}

	if (password.length < 6) {
		return res.status(400).json({
			message: 'Sifre en az 6 karakter olmali.'
		});
	}

	try {
		const passwordHash = await bcrypt.hash(password, 10);
		const result = await pool.query(
			`
			INSERT INTO users (full_name, email, password_hash)
			VALUES ($1, $2, $3)
			RETURNING id, full_name, email, role
			`,
			[fullName, email, passwordHash]
		);

		const user = toPublicUser(result.rows[0]);
		const token = createToken(user);
		return res.status(201).json({ token, user });
	} catch (error) {
		if (error.code === '23505') {
			return res.status(400).json({ message: 'Bu e-posta zaten kayitli.' });
		}
		console.error('register error:', error);
		return res.status(500).json({ message: 'Kayit olurken hata olustu.' });
	}
}

export async function login(req, res) {
	const email = String(req.body?.email || '').trim().toLowerCase();
	const password = String(req.body?.password || '');

	if (!email || !password) {
		return res.status(400).json({ message: 'email ve password zorunlu.' });
	}

	try {
		const result = await pool.query(
			`
			SELECT id, full_name, email, password_hash, role
			FROM users
			WHERE email = $1
			LIMIT 1
			`,
			[email]
		);

		if (result.rows.length === 0) {
			return res.status(401).json({ message: 'E-posta veya sifre hatali.' });
		}

		const row = result.rows[0];
		const ok = await bcrypt.compare(password, row.password_hash);
		if (!ok) {
			return res.status(401).json({ message: 'E-posta veya sifre hatali.' });
		}

		const user = toPublicUser(row);
		const token = createToken(user);
		return res.json({ token, user });
	} catch (error) {
		console.error('login error:', error);
		return res.status(500).json({ message: 'Giris yaparken hata olustu.' });
	}
}

export function requireAuth(req, res, next) {
	const token = readBearerToken(req);
	if (!token) {
		return res.status(401).json({ message: 'Giris yapman gerekiyor.' });
	}
	try {
		const payload = jwt.verify(token, jwtSecret);
		req.userId = payload.userId;
		return next();
	} catch (_error) {
		return res.status(401).json({ message: 'Oturum gecersiz veya suresi dolmus.' });
	}
}

export async function me(req, res) {
	try {
		const result = await pool.query(
			`
			SELECT id, full_name, email, role
			FROM users
			WHERE id = $1
			LIMIT 1
			`,
			[req.userId]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'Kullanici bulunamadi.' });
		}

		return res.json({ user: toPublicUser(result.rows[0]) });
	} catch (error) {
		console.error('me error:', error);
		return res.status(500).json({ message: 'Kullanici bilgisi alinamadi.' });
	}
}
