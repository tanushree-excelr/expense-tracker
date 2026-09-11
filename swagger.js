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
      description: 'Register, login, logout and authentication endpoints'
    },
    {
      name: 'Expenses',
      description: 'Operations for managing user expenses (Protected by JWT)'
    },
    {
      name: 'Admin',
      description: 'Admin-only endpoint for viewing all users and their expenses (Protected by JWT)'
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Creates a new user account. Username must be unique. Password is stored encrypted using bcrypt.',
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
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                example: {
                  message: 'User registered successfully',
                  userId: 'tanushree'
                }
              }
            }
          },
          '400': {
            description: 'Missing username or password'
          },
          '409': {
            description: 'Username already exists'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/auth/user-login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        // description: 'Authenticates a user, automatically sets an HttpOnly cookie containing the JWT access token, and also returns the token in the JSON body for client-side storage (localStorage / Bearer header).',
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
            description: 'User login successful',
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
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  userId: 'tanushree'
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
        description: 'Authenticates the admin user with hardcoded credentials. Returns a JWT with admin privileges.',
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
                  password: { type: 'string', example: 'admin@123' }
                }
              },
              example: {
                username: 'admin',
                password: 'admin@123'
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
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  userId: 'admin'
                }
              }
            }
          },
          '400': {
            description: 'Missing username or password'
          },
          '401': {
            description: 'Invalid admin credentials'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },

    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout',
        description: 'Clears the HttpOnly access token cookie. Requires a valid JWT token.',
        security: [{ bearerAuth: [] }],
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
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
          }
        }
      }
    },
    '/api/expenses': {
      post: {
        tags: ['Expenses'],
        summary: 'Add a new expense',
        description: 'Creates a new expense record automatically associated with the currently authenticated user.',
        security: [{ bearerAuth: [] }],
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
        description: 'Retrieves all expenses for the authenticated user.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'A list of expenses belonging to the user',
            content: {
              'application/json': {
                example: [
                  {
                    _id: '64e83c26fa2d192135a90101',
                    userId: 'tanushree',
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
        description: 'Returns total monetary sum for the authenticated user.',
        security: [{ bearerAuth: [] }],
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
        description: 'Calculates total expenses for a specific month (1-12) for the authenticated user.',
        security: [{ bearerAuth: [] }],
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
        description: 'Updates an expense by ID. Users can only update their own expenses.',
        security: [{ bearerAuth: [] }],
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
        description: 'Deletes an expense by ID. Users can only delete their own expenses.',
        security: [{ bearerAuth: [] }],
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
          '404': {
            description: 'Expense not found'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all registered users with expenses',
        description: 'Returns all non-admin users with their expenses array populated. Admin JWT token required.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All users retrieved with populated expenses',
            content: {
              'application/json': {
                example: {
                  count: 1,
                  users: [
                    {
                      _id: '64e83c26fa2d192135a90301',
                      username: 'tanushree',
                      expenses: [
                        {
                          _id: '64e83c26fa2d192135a90101',
                          userId: 'tanushree',
                          description: 'Groceries',
                          amount: 500,
                          category: 'Food',
                          date: '2026-09-11T06:29:46.898Z'
                        }
                      ],
                      isAdmin: false
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid token'
          },
          '403': {
            description: 'Access denied - Admin privileges required'
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
      }
    }
  }
};

// Function to attach Swagger UI middleware to the express app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
