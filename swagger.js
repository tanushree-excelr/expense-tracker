const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description: 'A simple beginner-level Expense Tracker REST API built with Node.js, Express, and MongoDB.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server'
    }
  ],
  tags: [
    {
      name: 'Expenses',
      description: 'Operations for managing expenses'
    }
  ],
  paths: {
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
                required: ['description', 'amount'],
                properties: {
                  description: { type: 'string', example: 'Lunch' },
                  amount: { type: 'number', example: 20 },
                  category: { type: 'string', example: 'Food' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-03T10:00:00.000Z' }
                }
              },
              example: {
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
                  expense: { _id: '64e83c26fa2d192135a90101', description: 'Lunch', amount: 20, category: 'Food', date: '2026-09-03T10:00:00.000Z' }
                }
              }
            }
          },
          '400': {
            description: 'Validation error (missing description or invalid amount)',
            content: {
              'application/json': {
                example: { message: 'Description cannot be empty' }
              }
            }
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      },
      get: {
        tags: ['Expenses'],
        summary: 'Get all expenses',
        description: 'Retrieves a list of all recorded expenses, ordered by newest first.',
        responses: {
          '200': {
            description: 'A list of expenses',
            content: {
              'application/json': {

                example: [
                  {
                    _id: '64e83c26fa2d192135a90101',
                    description: 'Lunch',
                    amount: 20,
                    category: 'Food',
                    date: '2026-09-03T10:00:00.000Z'
                  },
                  {
                    _id: '64e83c26fa2d192135a90102',
                    description: 'Metro Ticket',
                    amount: 5,
                    category: 'Transportation',
                    date: '2026-09-03T08:30:00.000Z'
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
        summary: 'Get total summary of all expenses',
        description: 'Returns the total monetary sum of all recorded expenses.',
        responses: {
          '200': {
            description: 'Total expenses calculated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalExpenses: { type: 'number', example: 30 }
                  }
                },
                example: {
                  totalExpenses: 30
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
        description: 'Calculates the total expenses for a specific month (1-12) of the current year.',
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
              example: 8
            }
          }
        ],
        responses: {
          '200': {
            description: 'Monthly summary calculated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    month: { type: 'string', example: 'August' },
                    totalExpenses: { type: 'number', example: 20 }
                  }
                },
                example: {
                  month: 'August',
                  totalExpenses: 20
                }
              }
            }
          },
          '400': {
            description: 'Invalid month number (must be between 1 and 12)',
            content: {
              'application/json': {
                example: { message: 'Month must be a number between 1 and 12' }
              }
            }
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
        description: 'Updates description, amount, category, or date of an expense by ID.',
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
            description: 'Expense updated successfully',
            content: {
              'application/json': {
                example: {
                  message: 'Expense updated successfully',
                  expense: { _id: '64e83c26fa2d192135a90101', description: 'Dinner with friends', amount: 35, category: 'Food', date: '2026-09-03T10:00:00.000Z' }
                }
              }
            }
          },
          '400': {
            description: 'Invalid ID format or invalid field values'
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
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Expense deleted successfully' }
                  }
                }
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
  },

};

// Function to attach Swagger UI middleware to the express app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;
