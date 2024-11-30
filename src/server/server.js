require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    try {
        const port = process.env.PORT || 8080;

        const server = Hapi.server({
            port: port,
            host: '0.0.0.0', 
            routes: {
                cors: {
                    origin: ['*'], 
                },
            },
        });
t
        console.log('Loading ML model...');
        let model;
        try {
            model = await loadModel();
            console.log('Model loaded successfully!');
        } catch (error) {
            console.error('Failed to load model:', error);
            process.exit(1); 
        }

        server.app.model = model;

        server.route(routes);

        server.ext('onPreResponse', function (request, h) {
            const response = request.response;

            if (response instanceof InputError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: `${response.message}`,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (response.isBoom) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.output.statusCode);
                return newResponse;
            }

            return h.continue;
        });

        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); 
    }
})();
