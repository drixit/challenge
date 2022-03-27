import jwt from 'fastify-jwt';
import bcrypt from 'bcryptjs';
import SECRET from '../secret';

async function usersRoutes(fastify, _options) {
	const users = fastify.mongo.db.collection('users');

	fastify.register(jwt, { secret: SECRET });
	fastify.register(require("fastify-cors"), {
    origin: "*",
    methods: ["POST"]
  });

	fastify.post('/authenticate', async (req, reply) => {
		const user = await users.findOne({ email: req.body.email });

		if (user) {
			bcrypt.compare(req.body.password, user.password, function(err, _res) {
				if (err) {
					// TODO: Improve error handling
					return 'Invalid password';
				} else {
					const token = fastify.jwt.sign({ email: req.body.email });

					reply.send({ 'jwt': token });
				}
			});
		} else {
			// TODO: Improve error handling
			return 'Invalid user email';
		}
	});

  fastify.get('/users/me', async (req, reply) => {
		const token = req.headers.authorization.split('Bearer ')[1];
		const decoded = fastify.jwt.verify(token);

		if (decoded) {
			const filter = { email: decoded.email };
			const exclude = { projection: { password: 0 } };
			// TODO: See if I can avoid using projection and get away with <ClientUser> instead
			const user = await users.findOne(filter, exclude);

			reply
				.header('Authorization', `Bearer ${token}`)
				.send({ user: user });
		} else {
			// TODO: Improve error handling
			return 'Invalid credentials';
		}
  });

	fastify.post('/users/register', (req, reply) => {
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