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
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", description: "UUID of the user" },
            firstName: { type: "string", description: "User's first name" },
            lastName: { type: "string", description: "User's last name" },
            email: {
              type: "string",
              description: "User's unique email address",
            },
            password: { type: "string", description: "User's hashed password" },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              description: "Role of the user",
              default: "USER",
            },
            organizationId: {
              type: "integer",
              nullable: true,
              description: "ID of the associated social organization",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the user was last updated",
            },
          },
        },
        SocialOrganization: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Auto-generated ID of the organization",
            },
            name: { type: "string", description: "Name of the organization" },
            contactPerson: {
              type: "string",
              description: "Name of the contact person",
            },
            email: {
              type: "string",
              description: "Unique email address of the organization",
            },
            phone: {
              type: "string",
              description: "Contact phone number of the organization",
            },
            streetName: {
              type: "string",
              description: "Street name of the organization's address",
            },
            number: {
              type: "string",
              description: "Street number of the organization's address",
            },
            city: {
              type: "string",
              description: "City of the organization's address",
            },
            country: {
              type: "string",
              description: "Country of the organization's address",
            },
            zipCode: {
              type: "string",
              description: "Postal code of the organization's address",
            },
            qualifications: {
              type: "string",
              description: "Qualifications of the organization",
            },
            status: {
              type: "string",
              enum: ["PENDING", "APPROVED", "REJECTED"],
              description: "Approval status of the organization",
              default: "PENDING",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the organization was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the organization was last updated",
            },
          },
        },
        // Add other models here similarly
        SeizedGood: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Auto-generated ID of the seized good",
            },
            name: { type: "string", description: "Name of the seized good" },
            description: {
              type: "string",
              description: "Description of the seized good",
            },
            value: {
              type: "number",
              format: "float",
              description: "Estimated monetary value of the seized good",
            },
            quantity: {
              type: "integer",
              default: 1,
              description: "Total quantity of the seized good",
            },
            availableQuantity: {
              type: "integer",
              default: 0,
              description: "Quantity currently available for allocation",
            },
            status: {
              type: "string",
              enum: ["PENDING", "ALLOCATED", "RECEIVED", "DESTROYED"],
              description: "Current status of the seized good",
              default: "PENDING",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the seized good was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the seized good was last updated",
            },
          },
        },
        // Add other schemas for Image, Category, Request, Feedback, Allocation, etc.
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
