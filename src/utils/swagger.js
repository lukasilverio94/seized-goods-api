import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Seized Goods API",
      version: "1.0.0",
      description: "Reallocate Seized Goods API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
