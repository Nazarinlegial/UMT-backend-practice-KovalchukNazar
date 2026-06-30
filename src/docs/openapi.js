// Hand-authored OpenAPI 3 document served at /api-docs (Swagger UI) and
// /api-docs.json. Schemas stay in sync with the Joi schemas and the Prisma
// model. Mutations require a Bearer JWT (obtained via POST /api/auth/login);
// reads and placing an order are public.

const Error = {
  type: "object",
  properties: { message: { type: "string", example: "Bouquet not found" } },
  required: ["message"],
};

const Bouquet = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    title: { type: "string", example: "Peach Meadow" },
    description: { type: "string" },
    price: { type: "integer", description: "Price in whole US dollars", example: 55 },
    photoURL: { type: "string", example: "https://res.cloudinary.com/ddoti9rca/image/upload/flora/rose.jpg" },
    photoURL2x: { type: "string", nullable: true },
    alt: { type: "string", nullable: true },
    descriptionLong: { type: "string", nullable: true },
    favorite: { type: "boolean", example: false },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const BouquetCreate = {
  type: "object",
  required: ["title", "description", "price", "photo"],
  properties: {
    title: { type: "string", example: "Midnight Rose" },
    description: { type: "string", example: "Deep red roses with eucalyptus." },
    price: { type: "integer", example: 60 },
    descriptionLong: { type: "string" },
    alt: { type: "string" },
    photoURL2x: { type: "string" },
    favorite: { type: "boolean" },
    photo: { type: "string", format: "binary", description: "Image file (jpeg/png/webp/gif)" },
  },
};

const BouquetUpdate = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "integer" },
    descriptionLong: { type: "string" },
    alt: { type: "string" },
    photoURL2x: { type: "string" },
    favorite: { type: "boolean" },
  },
};

const PaginationMeta = {
  type: "object",
  properties: {
    page: { type: "integer" },
    perPage: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
    hasNextPage: { type: "boolean" },
    hasPrevPage: { type: "boolean" },
  },
};

const Feedback = {
  type: "object",
  properties: {
    id: { type: "integer" },
    text: { type: "string" },
    author: { type: "string" },
    location: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
};

const FeedbackCreate = {
  type: "object",
  required: ["text", "author"],
  properties: {
    text: { type: "string", example: "Beautiful bouquet, fast delivery!" },
    author: { type: "string", example: "Sam P." },
    location: { type: "string", example: "Lviv" },
  },
};

const Order = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    phone: { type: "string" },
    address: { type: "string", nullable: true },
    message: { type: "string" },
    quantity: { type: "integer" },
    bouquetId: { type: "integer", nullable: true },
    bouquet: { allOf: [{ $ref: "#/components/schemas/Bouquet" }], nullable: true },
    createdAt: { type: "string", format: "date-time" },
  },
};

const OrderCreate = {
  type: "object",
  required: ["name", "phone"],
  properties: {
    name: { type: "string", example: "Jane Doe" },
    phone: { type: "string", example: "+1 202 555 0142" },
    address: { type: "string", example: "5 Garden St" },
    message: { type: "string", example: "Deliver before noon" },
    quantity: { type: "integer", example: 1 },
    bouquetId: { type: "integer", nullable: true, example: 1 },
  },
};

const LoginCredentials = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", example: "admin" },
    password: { type: "string", example: "your_admin_password" },
  },
};

const LoginResponse = {
  type: "object",
  properties: {
    token: { type: "string" },
    user: {
      type: "object",
      properties: { id: { type: "integer" }, username: { type: "string" }, role: { type: "string" } },
    },
  },
};

const idParam = { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } };
const errRef = { content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } };
const PUBLIC = []; // operation-level override: no auth required
const dataOf = (ref) => ({ type: "object", properties: { data: { $ref: ref } } });
const listOf = (ref) => ({ type: "object", properties: { data: { type: "array", items: { $ref: ref } } } });

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Flora API",
    version: "1.0.0",
    description:
      "REST API for the Flora flower boutique. Resource **bouquets** (CRUD + favorite + photo upload to " +
      "Cloudinary), plus **feedbacks** and **orders**. Mutations require a Bearer JWT from " +
      "`POST /api/auth/login`; reads and placing an order are public. Errors are `{ message }`.",
  },
  servers: [{ url: "/api", description: "Same host" }],
  tags: [{ name: "Auth" }, { name: "Bouquets" }, { name: "Feedbacks" }, { name: "Orders" }],
  // Default: every operation needs a Bearer token unless it overrides with `security: []`.
  // Either: log in with username/password (adminLogin) OR paste a JWT (bearerAuth).
  security: [{ adminLogin: [] }, { bearerAuth: [] }],
  components: {
    securitySchemes: {
      // Swagger "Authorize" shows a username/password form and fetches the token.
      adminLogin: { type: "oauth2", flows: { password: { tokenUrl: "/api/auth/login", scopes: {} } } },
      // Alternative: paste a raw "Bearer <token>".
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error,
      Bouquet,
      BouquetCreate,
      BouquetUpdate,
      PaginationMeta,
      PaginatedBouquets: {
        type: "object",
        properties: { data: { type: "array", items: { $ref: "#/components/schemas/Bouquet" } }, meta: { $ref: "#/components/schemas/PaginationMeta" } },
      },
      Feedback,
      FeedbackCreate,
      Order,
      OrderCreate,
      LoginCredentials,
      LoginResponse,
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in as admin → returns a JWT",
        security: PUBLIC,
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginCredentials" } } } },
        responses: {
          200: { description: "Token issued.", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          401: { description: "Invalid credentials.", ...errRef },
        },
      },
    },
    "/bouquets": {
      get: {
        tags: ["Bouquets"],
        summary: "List bouquets (all, or paginated with page/perPage)",
        security: PUBLIC,
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "perPage", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "favorite", in: "query", schema: { type: "boolean" } },
        ],
        responses: { 200: { description: "List.", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedBouquets" } } } }, 400: { description: "Invalid query.", ...errRef } },
      },
      post: {
        tags: ["Bouquets"],
        summary: "Create a bouquet (admin; image → Cloudinary)",
        requestBody: { required: true, content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/BouquetCreate" } } } },
        responses: {
          201: { description: "Created.", content: { "application/json": { schema: dataOf("#/components/schemas/Bouquet") } } },
          400: { description: "Validation failed / image missing.", ...errRef },
          401: { description: "Unauthorized.", ...errRef },
        },
      },
    },
    "/bouquets/favorites": {
      get: { tags: ["Bouquets"], summary: "List favorite bouquets", security: PUBLIC, responses: { 200: { description: "Favorites.", content: { "application/json": { schema: listOf("#/components/schemas/Bouquet") } } } } },
    },
    "/bouquets/{id}": {
      parameters: [idParam],
      get: { tags: ["Bouquets"], summary: "Get a bouquet by id", security: PUBLIC, responses: { 200: { description: "The bouquet.", content: { "application/json": { schema: dataOf("#/components/schemas/Bouquet") } } }, 404: { description: "Not found.", ...errRef } } },
      put: {
        tags: ["Bouquets"],
        summary: "Update a bouquet (admin; empty body → 400)",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BouquetUpdate" } } } },
        responses: { 200: { description: "Updated.", content: { "application/json": { schema: dataOf("#/components/schemas/Bouquet") } } }, 400: { description: "Empty/invalid.", ...errRef }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } },
      },
      delete: {
        tags: ["Bouquets"],
        summary: "Delete a bouquet (admin)",
        responses: { 200: { description: "Deleted.", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" }, data: { $ref: "#/components/schemas/Bouquet" } } } } } }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } },
      },
    },
    "/bouquets/{id}/favorite": {
      parameters: [idParam],
      patch: {
        tags: ["Bouquets"],
        summary: "Toggle/set favorite (admin)",
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { favorite: { type: "boolean" } } } } } },
        responses: { 200: { description: "Updated.", content: { "application/json": { schema: dataOf("#/components/schemas/Bouquet") } } }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } },
      },
    },
    "/bouquets/{id}/photo": {
      parameters: [idParam],
      patch: {
        tags: ["Bouquets"],
        summary: "Replace bouquet photo (admin; Cloudinary)",
        requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", required: ["photo"], properties: { photo: { type: "string", format: "binary" } } } } } },
        responses: { 200: { description: "Updated.", content: { "application/json": { schema: dataOf("#/components/schemas/Bouquet") } } }, 400: { description: "Missing/invalid file.", ...errRef }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } },
      },
    },
    "/feedbacks": {
      get: { tags: ["Feedbacks"], summary: "List all feedbacks", security: PUBLIC, responses: { 200: { description: "Feedbacks.", content: { "application/json": { schema: listOf("#/components/schemas/Feedback") } } } } },
      post: { tags: ["Feedbacks"], summary: "Create a feedback (admin)", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FeedbackCreate" } } } }, responses: { 201: { description: "Created.", content: { "application/json": { schema: dataOf("#/components/schemas/Feedback") } } }, 400: { description: "Validation failed.", ...errRef }, 401: { description: "Unauthorized.", ...errRef } } },
    },
    "/feedbacks/{id}": {
      parameters: [idParam],
      get: { tags: ["Feedbacks"], summary: "Get a feedback", security: PUBLIC, responses: { 200: { description: "Feedback.", content: { "application/json": { schema: dataOf("#/components/schemas/Feedback") } } }, 404: { description: "Not found.", ...errRef } } },
      put: { tags: ["Feedbacks"], summary: "Update a feedback (admin)", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FeedbackCreate" } } } }, responses: { 200: { description: "Updated.", content: { "application/json": { schema: dataOf("#/components/schemas/Feedback") } } }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } } },
      delete: { tags: ["Feedbacks"], summary: "Delete a feedback (admin)", responses: { 200: { description: "Deleted." }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } } },
    },
    "/orders": {
      get: { tags: ["Orders"], summary: "List orders (admin)", parameters: [{ name: "page", in: "query", schema: { type: "integer" } }, { name: "perPage", in: "query", schema: { type: "integer" } }], responses: { 200: { description: "Orders.", content: { "application/json": { schema: { type: "object", properties: { data: { type: "array", items: { $ref: "#/components/schemas/Order" } }, meta: { $ref: "#/components/schemas/PaginationMeta" } } } } } }, 401: { description: "Unauthorized.", ...errRef } } },
      post: { tags: ["Orders"], summary: "Place an order (public)", security: PUBLIC, requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderCreate" } } } }, responses: { 201: { description: "Created.", content: { "application/json": { schema: dataOf("#/components/schemas/Order") } } }, 400: { description: "Validation failed.", ...errRef } } },
    },
    "/orders/{id}": {
      parameters: [idParam],
      get: { tags: ["Orders"], summary: "Get an order (admin)", responses: { 200: { description: "Order.", content: { "application/json": { schema: dataOf("#/components/schemas/Order") } } }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } } },
      put: { tags: ["Orders"], summary: "Update an order (admin)", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderCreate" } } } }, responses: { 200: { description: "Updated.", content: { "application/json": { schema: dataOf("#/components/schemas/Order") } } }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } } },
      delete: { tags: ["Orders"], summary: "Delete an order (admin)", responses: { 200: { description: "Deleted." }, 401: { description: "Unauthorized.", ...errRef }, 404: { description: "Not found.", ...errRef } } },
    },
  },
};
