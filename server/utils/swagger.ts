import swaggerJsdoc from 'swagger-jsdoc';

export function setupSwagger() {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Notice Board API',
        version: '1.0.0',
        description: 'API documentation for the Notice Board application',
        contact: {
          name: 'API Support',
          email: 'support@noticeboard.com'
        }
      },
      servers: [
        {
          url: '/api',
          description: 'API Server'
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'error'
              },
              message: {
                type: 'string',
                example: 'Error message'
              },
              errors: {
                type: 'object',
                additionalProperties: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                example: {
                  email: ['Invalid email address'],
                  password: ['Password is too short']
                }
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uuid: { type: 'string', format: 'uuid' },
              username: { type: 'string' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              phone: { type: 'string' },
              profileImage: { type: 'string' },
              role: { type: 'string', enum: ['user', 'admin'] },
              visibility: { type: 'string', enum: ['public', 'private'] },
              location: { type: 'string', enum: ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram'] },
              isVerified: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          UserPreferences: {
            type: 'object',
            properties: {
              userId: { type: 'integer' },
              selectedCategories: { 
                type: 'array',
                items: { 
                  type: 'string',
                  enum: ['announcement', 'event', 'traffic_alert', 'looking_for', 'rental_to_let',
                         'reviews', 'recommendations', 'news', 'citizen_reporter', 'community_services',
                         'health_capsule', 'science_knowledge', 'article', 'jobs', 'help',
                         'sale', 'property', 'rental_required', 'promotion', 'page_3']
                }
              },
              notificationPreferences: {
                type: 'object',
                additionalProperties: { type: 'boolean' }
              }
            }
          },
          Post: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uuid: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              description: { type: 'string' },
              categoryId: { type: 'integer' },
              subcategoryId: { type: 'integer' },
              location: { type: 'string', enum: ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram'] },
              locationDetails: { type: 'string' },
              imageUrl: { type: 'string' },
              visibility: { type: 'string', enum: ['public', 'private'] },
              metadata: {
                type: 'object',
                additionalProperties: { type: 'string' }
              },
              viewCount: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          Comment: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              postId: { type: 'integer' },
              userId: { type: 'integer' },
              content: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          Category: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              displayName: { type: 'string' },
              icon: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          Subcategory: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              categoryId: { type: 'integer' },
              name: { type: 'string' },
              displayName: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          Login: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', format: 'password' }
            }
          },
          Registration: {
            type: 'object',
            required: ['username', 'email', 'password', 'name', 'location'],
            properties: {
              username: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string', format: 'password' },
              name: { type: 'string' },
              phone: { type: 'string' },
              location: { type: 'string', enum: ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram'] },
              visibility: { type: 'string', enum: ['public', 'private'], default: 'public' }
            }
          },
          AuthResponse: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'success' },
              data: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      uuid: { type: 'string', format: 'uuid' },
                      username: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      name: { type: 'string' },
                      profileImage: { type: 'string' },
                      role: { type: 'string' },
                      location: { type: 'string' }
                    }
                  },
                  token: { type: 'string' }
                }
              }
            }
          },
          PostWithDetails: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              uuid: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              description: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  displayName: { type: 'string' }
                }
              },
              subcategory: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  displayName: { type: 'string' }
                }
              },
              location: { type: 'string' },
              locationDetails: { type: 'string' },
              imageUrl: { type: 'string' },
              visibility: { type: 'string' },
              metadata: {
                type: 'object',
                additionalProperties: { type: 'string' }
              },
              viewCount: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  uuid: { type: 'string' },
                  name: { type: 'string' },
                  username: { type: 'string' },
                  profileImage: { type: 'string' }
                }
              },
              likeCount: { type: 'integer' },
              commentCount: { type: 'integer' },
              isLiked: { type: 'boolean' },
              isSaved: { type: 'boolean' },
              isFollowed: { type: 'boolean' }
            }
          },
          PaginatedResponse: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'success' },
              data: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/PostWithDetails'
                    }
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      totalPages: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    apis: ['./server/routes/*.ts'], // Path to the API docs
  };

  return swaggerJsdoc(options);
}
