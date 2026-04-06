const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard Backend API',
      version: '1.0.0',
      description: 'API documentation for Finance Dashboard Backend',
      contact: {
        name: 'Tanushree Dutta',
        email: 'duttatanushree2302@gmail.com',
        url: 'https://www.linkedin.com/in/tanushree-dutta-td23/', 
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/swagger/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };