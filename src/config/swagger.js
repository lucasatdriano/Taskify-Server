import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Taskify-Server',
            version: '1.0.0',
            description:
                'Documentação da API feita no swagger para a aplicação Taskify',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local',
            },
        ],
    },
    apis: ['../routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
