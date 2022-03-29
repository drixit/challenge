import bcrypt from 'bcryptjs';
import { JWT_SECRET, COOKIE_SECRET } from '../secrets';
import { AUTHENTICATE, USER_INFO, NEW_USER } from '../endpoints';

async function usersRoutes(fastify, _options) {
	const users = fastify.mongo.db.collection('users');

	fastify.register(require('fastify-jwt'), {
		secret: JWT_SECRET,
		cookie: {
			cookieName: 'jwt',
			signed: true
		}
	});
	fastify.register(require('fastify-cookie'), {
		secret: COOKIE_SECRET
	});
	fastify.register(require("fastify-cors"), {
    origin: true,
    methods: ["POST", "GET"],
		credentials: true,
		exposedHeaders: ['set-cookie']
  });

	fastify.post(AUTHENTICATE, async (req, reply) => {
		const user = await users.findOne({ email: req.body.email });

		if (user) {
			bcrypt.compare(req.body.password, user.password, function(err, res) {
				if (err) {
					// TODO: Improve error handling
					throw new Error('Could not compare passwords');
				} else if (!res) {
					reply
						.code(401)
						.header('WWW-Authenticate', 'Basic realm="Login"')
						.send('Incorrect password');
				} else {
					const token = fastify.jwt.sign({ email: req.body.email });

					reply
						.cookie('jwt', token)
						.send({ 'jwt': token });
				}
			});
		} else {
			// TODO: Improve error handling
			return 'Invalid user email';
		}
	});

  fastify.get(USER_INFO, async (req, reply) => {
		const token = req.headers.authorization.split('Bearer ')[1];
		const decoded = fastify.jwt.verify(token);

		if (decoded) {
			const filter = { email: decoded.email };
			const exclude = { projection: { password: 0 } };
			const user = await users.findOne(filter, exclude);

			reply
				.header('Authorization', `Bearer ${token}`)
				.send({ user: user });
		} else {
			// TODO: Improve error handling
			return 'Invalid credentials';
		}
  });

	fastify.post(NEW_USER, (req, reply) => {
		const newUser: ServerUser = req.body;
		const passwordPlain = req.body.password;

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(passwordPlain, salt, async function(err, hash) {
					newUser.password = hash;
					const insertionResult = await users.insertOne(newUser);
					reply
						.code(201)
						.send(insertionResult);
			});
		});
	});
}

export default usersRoutes;