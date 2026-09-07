const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description: 'A simple beginner-level Expense Tracker REST API built with Node.js, Express, and MongoDB, supporting user-specific tracking and admin views.'
  },
  servers: [
    {
      url: '/',
      description: 'Default Server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Login endpoints for User and Admin'
    },
    {
      name: 'Expenses',
      description: 'Operations for managing expenses'
    }
  ],
  paths: {
    '/api/auth/user-login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Authenticates a regular user and returns user details and role.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'tanushree' },
                  password: { type: 'string', example: 'password123' }
                }
              },
              example: {
                username: 'tanushree',
                password: 'password123'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User login successful',
            content: {
              'application/json': {
                example: {
                  message: 'User login successful',
                  userId: 'tanushree',
                  role: 'user'
                }
              }
            }
          },
          '400': {
            description: 'Missing username or password'
          },
          '401': {
            description: 'Invalid password'
          }
        }
      }
    },
    '/api/auth/admin-login': {
      post: {
        tags: ['Authentication'],
        summary: 'Admin Login',
        description: 'Authenticates an administrator (default credentials: username "admin", password "admin123").',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'admin123' }
                }
              },
              example: {
                username: 'admin',
                password: 'admin123'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Admin login successful',
            content: {
              'application/json': {
                example: {
                  message: 'Admin login successful',
                  userId: 'admin',
                  role: 'admin'
                }
              }
            }
          },
          '400': {
            description: 'Missing username or password'
          },
          '401': {
            description: 'Invalid admin credentials'
          }
        }
      }
    },
    '/api/expenses': {
      post: {
        tags: ['Expenses'],
        summary: 'Add a new expense',
        description: 'Creates a new expense record in the database.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'description', 'amount'],
                properties: {
                  userId: { type: 'string', example: 'user123' },
                  role: { type: 'string', enum: ['user', 'admin'], default: 'user', example: 'user' },
                  description: { type: 'string', example: 'Lunch' },
                  amount: { type: 'number', example: 20 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-03T10:00:00.000Z' }
                }
              },
              example: {
                userId: 'user123',
                role: 'user',
                description: 'Lunch',
                amount: 20,
                category: 'Food'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Expense added successfully',
            content: {
              'application/json': {
                example: {
                  message: 'Expense added successfully',
                  expense: {
                    _id: '64e83c26fa2d192135a90101',
                    userId: 'user123',
                    role: 'user',
                    description: 'Lunch',
                    amount: 20,
                    category: 'Food',
                    date: '2026-09-03T10:00:00.000Z'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error (missing description, amount, or userId)'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      },
      get: {
        tags: ['Expenses'],
        summary: 'Get all expenses',
        description: 'Retrieves expenses. Provide userId for personal expenses, or role=admin to view all users expenses.',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: 'Filter expenses by userId',
            schema: {
              type: 'string',
              example: 'user123'
            }
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: "Set to 'admin' to view all expenses across all users",
            schema: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          }
        ],
        responses: {
          '200': {
            description: 'A list of expenses',
            content: {
              'application/json': {
                example: [
                  {
                    _id: '64e83c26fa2d192135a90101',
                    userId: 'user123',
                    role: 'user',
                    description: 'Lunch',
                    amount: 20,
                    category: 'Food',
                    date: '2026-09-03T10:00:00.000Z'
                  }
                ]
              }
            }
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/expenses/summary': {
      get: {
        tags: ['Expenses'],
        summary: 'Get total summary of expenses',
        description: 'Returns total monetary sum. Filter by userId for personal total, or role=admin for total across all users.',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: 'Filter total summary by userId',
            schema: {
              type: 'string',
              example: 'user123'
            }
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: "Set to 'admin' to view total of all users",
            schema: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Total expenses calculated successfully',
            content: {
              'application/json': {
                example: {
                  totalExpenses: 20
                }
              }
            }
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/expenses/summary/month/{month}': {
      get: {
        tags: ['Expenses'],
        summary: 'Get monthly summary for the current year',
        description: 'Calculates total expenses for a specific month (1-12). Filter by userId or role=admin.',
        parameters: [
          {
            name: 'month',
            in: 'path',
            required: true,
            description: 'Month number from 1 (January) to 12 (December)',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              example: 9
            }
          },
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: 'Filter monthly summary by userId',
            schema: {
              type: 'string',
              example: 'user123'
            }
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: "Set to 'admin' to view monthly total of all users",
            schema: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Monthly summary calculated successfully',
            content: {
              'application/json': {
                example: {
                  month: 'September',
                  totalExpenses: 20
                }
              }
            }
          },
          '400': {
            description: 'Invalid month number (must be between 1 and 12)'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/expenses/{id}': {
      put: {
        tags: ['Expenses'],
        summary: 'Update an existing expense',
        description: 'Updates description, amount, category, date, or role of an expense by ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId of the expense to update',
            schema: {
              type: 'string',
              example: '64e83c26fa2d192135a90101'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: 'user123' },
                  role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                  description: { type: 'string', example: 'Dinner with friends' },
                  amount: { type: 'number', example: 35 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-03T10:00:00.000Z' }
                }
              },
              example: {
                description: 'Dinner with friends',
                amount: 35,
                category: 'Food'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Expense updated successfully'
          },
          '400': {
            description: 'Invalid ID format or invalid values'
          },
          '404': {
            description: 'Expense not found'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      },
      delete: {
        tags: ['Expenses'],
        summary: 'Delete an expense',
        description: 'Deletes an expense from the database using its MongoDB ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'MongoDB ObjectId of the expense to delete',
            schema: {
              type: 'string',
              example: '64e83c26fa2d192135a90101'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Expense deleted successfully',
            content: {
              'application/json': {
                example: { message: 'Expense deleted successfully' }
              }
            }
          },
          '400': {
            description: 'Invalid ID format'
          },
          '404': {
            description: 'Expense not found'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

// Function to attach Swagger UI middleware to the express app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
