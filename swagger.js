const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description: 'expense'
  },
  servers: [
    {
      url: '/',
      description: 'Default Server'
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Login, logout and authentication endpoints'
    },
    {
      name: 'Expenses',
      description: 'Operations for managing user-specific and admin expenses (Protected by JWT)'
    }
  ],
  paths: {
    '/api/auth/user-login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Authenticates a regular user, automatically sets an HttpOnly cookie containing the JWT access token, and also returns the token in the JSON body for client-side storage (localStorage / Bearer header).',
        security: [],
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
            description: 'User login successful. Sets an HttpOnly cookie named "token" and returns access token.',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example: 'token=eyJhbGciOi...; Path=/; HttpOnly; SameSite=Lax'
                }
              }
            },
            content: {
              'application/json': {
                example: {
                  message: 'User login successful',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.exampleToken...',
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
        description: 'Authenticates an administrator (default credentials: username "admin", password "admin123"), sets an HttpOnly cookie, and returns the JWT access token.',
        security: [],
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
            description: 'Admin login successful. Sets an HttpOnly cookie named "token" and returns access token.',
            content: {
              'application/json': {
                example: {
                  message: 'Admin login successful',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.exampleAdminToken...',
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
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout',
        description: 'Clears the HttpOnly access token cookie.',
        security: [],
        responses: {
          '200': {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                example: {
                  message: 'Logged out successfully'
                }
              }
            }
          }
        }
      }
    },
    '/api/expenses': {
      post: {
        tags: ['Expenses'],
        summary: 'Add a new expense',
        description: 'Creates a new expense record automatically associated with the currently authenticated user.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['description', 'amount'],
                properties: {
                  description: { type: 'string', example: 'Lunch with team' },
                  amount: { type: 'number', example: 25.5 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-07T12:00:00.000Z' }
                }
              },
              example: {
                description: 'Lunch with team',
                amount: 25.5,
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
                    userId: 'tanushree',
                    role: 'user',
                    description: 'Lunch with team',
                    amount: 25.5,
                    category: 'Food',
                    date: '2026-09-07T12:00:00.000Z'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error (missing description or invalid amount)'
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      },
      get: {
        tags: ['Expenses'],
        summary: 'Get all expenses',
        description: 'Retrieves expenses for the authenticated user. If the caller is an admin, all users expenses are returned (or filtered by ?userId=).',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: '(Admin only) Filter expenses by specific userId',
            schema: {
              type: 'string',
              example: 'tanushree'
            }
          }
        ],
        responses: {
          '200': {
            description: 'A list of expenses belonging to the user (or all expenses for admin)',
            content: {
              'application/json': {
                example: [
                  {
                    _id: '64e83c26fa2d192135a90101',
                    userId: 'tanushree',
                    role: 'user',
                    description: 'Lunch with team',
                    amount: 25.5,
                    category: 'Food',
                    date: '2026-09-07T12:00:00.000Z'
                  }
                ]
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
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
        description: 'Returns total monetary sum for the authenticated user (or all users if admin).',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: '(Admin only) Filter summary by specific userId',
            schema: {
              type: 'string',
              example: 'tanushree'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Total expenses calculated successfully',
            content: {
              'application/json': {
                example: {
                  totalExpenses: 25.5
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
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
        description: 'Calculates total expenses for a specific month (1-12) for the authenticated user (or all users if admin).',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
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
            description: '(Admin only) Filter monthly summary by specific userId',
            schema: {
              type: 'string',
              example: 'tanushree'
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
                  totalExpenses: 25.5
                }
              }
            }
          },
          '400': {
            description: 'Invalid month number (must be between 1 and 12)'
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
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
        description: 'Updates an expense by ID. Non-admin users are strictly forbidden from updating expenses owned by other users.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
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
                  description: { type: 'string', example: 'Dinner with friends' },
                  amount: { type: 'number', example: 35 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-07T20:00:00.000Z' }
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
          '401': {
            description: 'Unauthorized - Missing or invalid token'
          },
          '403': {
            description: 'Forbidden - Cannot update another user expense'
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
        description: 'Deletes an expense by ID. Non-admin users can only delete their own expenses.',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
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
          '401': {
            description: 'Unauthorized - Missing or invalid token'
          },
          '403': {
            description: 'Forbidden - Cannot delete another user expense'
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
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/user-login or /api/auth/admin-login'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'HttpOnly cookie set automatically upon user or admin login'
      }
    }
  }
};

// Function to attach Swagger UI middleware to the express app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
