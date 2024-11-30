const { postPredictHandler, predictHistories } = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000 * 1000, // Maksimal ukuran payload (1 MB)
        allow: 'multipart/form-data', // Mengizinkan form-data
        multipart: true, // Mengaktifkan parsing multipart
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: predictHistories,
  },
  {
    path: '/', // Route tambahan untuk root endpoint
    method: 'GET',
    handler: (request, h) => {
      return h.response({
        status: 'success',
        message: 'ML API is running', // Pesan sederhana untuk root endpoint
      });
    },
  },
];

module.exports = routes;
