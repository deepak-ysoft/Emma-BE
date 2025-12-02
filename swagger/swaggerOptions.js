const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Emma Health API',
      version: '1.0.0',
      description: 'API documentation for Emma Health',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: process.env.SWAGGER_URL || 'http://20.51.104.140:3000/',
        description: 'Live server',
      },
    ],
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './authentication/authRoutes.js', // Updated path
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;




