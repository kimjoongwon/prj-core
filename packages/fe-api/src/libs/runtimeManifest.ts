// Orval input transformer가 codegen 시 갱신합니다.
import type { RuntimeManifest } from "./runtimeSchema";

export const runtimeManifest: RuntimeManifest = {
  "operations": [
    {
      "operationId": "getUsers",
      "method": "GET",
      "path": "/api/v1/users",
      "parameterSchemas": {
        "query:skip": {
          "minimum": 0,
          "type": "number"
        },
        "query:take": {
          "minimum": 1,
          "maximum": 200,
          "type": "number"
        },
        "query:name": {
          "type": "string"
        },
        "query:email": {
          "type": "string"
        },
        "query:phone": {
          "type": "string"
        },
        "query:nickname": {
          "type": "string"
        },
        "query:roles": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "query:status": {
          "$ref": "#/components/schemas/DeleteFilter"
        },
        "query:categorySeq": {
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
          "type": "string"
        },
        "query:groupIds": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
          }
        },
        "query:createdFrom": {
          "format": "date-time",
          "type": "string"
        },
        "query:createdTo": {
          "format": "date-time",
          "type": "string"
        },
        "query:sort": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/UserDto"
                  }
                },
                "meta": {
                  "$ref": "#/components/schemas/UserPaginationMetaDto"
                },
                "stats": {
                  "$ref": "#/components/schemas/UserStatsDto"
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getUserById",
      "method": "GET",
      "path": "/api/v1/users/{userId}",
      "parameterSchemas": {
        "path:userId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/UserDetailResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getUserTenantDetail",
      "method": "GET",
      "path": "/api/v1/users/{userId}/tenants/{tenantId}",
      "parameterSchemas": {
        "path:userId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        },
        "path:tenantId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/UserTenantDetailResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getAssetContent",
      "method": "GET",
      "path": "/api/v1/assets/{assetId}/content",
      "parameterSchemas": {
        "path:assetId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {}
    },
    {
      "operationId": "getMyAbilities",
      "method": "GET",
      "path": "/api/v1/abilities/my",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AbilityResponseDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getRoles",
      "method": "GET",
      "path": "/api/v1/roles",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/RoleDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "createRole",
      "method": "POST",
      "path": "/api/v1/roles",
      "requestSchema": {
        "$ref": "#/components/schemas/CreateRoleDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "201": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 201
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/RoleDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getRoleById",
      "method": "GET",
      "path": "/api/v1/roles/{id}",
      "parameterSchemas": {
        "path:id": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/RoleDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "updateRole",
      "method": "PATCH",
      "path": "/api/v1/roles/{id}",
      "requestSchema": {
        "$ref": "#/components/schemas/UpdateRoleDto"
      },
      "parameterSchemas": {
        "path:id": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/RoleDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "deleteRole",
      "method": "DELETE",
      "path": "/api/v1/roles/{id}",
      "parameterSchemas": {
        "path:id": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/RoleDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getI18nCatalog",
      "method": "GET",
      "path": "/api/v1/i18n/catalog/{languageCode}",
      "parameterSchemas": {
        "path:languageCode": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/I18nCatalogResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getCommunityPosts",
      "method": "GET",
      "path": "/api/v1/community/posts",
      "parameterSchemas": {
        "query:skip": {
          "minimum": 0,
          "type": "number"
        },
        "query:take": {
          "minimum": 1,
          "maximum": 200,
          "type": "number"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CommunityPostDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "createCommunityPost",
      "method": "POST",
      "path": "/api/v1/community/posts",
      "requestSchema": {
        "$ref": "#/components/schemas/CreateCommunityPostPayloadDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "201": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 201
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/CommunityPostDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getPolicies",
      "method": "GET",
      "path": "/api/v1/policies",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PolicyResponseDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getRoleAssignments",
      "method": "GET",
      "path": "/api/v1/roles/{roleId}/assignments",
      "parameterSchemas": {
        "path:roleId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/RoleAssignmentResponseDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "syncRoleAssignments",
      "method": "PUT",
      "path": "/api/v1/roles/{roleId}/assignments",
      "requestSchema": {
        "$ref": "#/components/schemas/SyncRoleAssignmentsDto"
      },
      "parameterSchemas": {
        "path:roleId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/RoleAssignmentResponseDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getFolders",
      "method": "GET",
      "path": "/api/v1/folders",
      "parameterSchemas": {
        "query:skip": {
          "minimum": 0,
          "type": "number"
        },
        "query:take": {
          "minimum": 1,
          "maximum": 200,
          "type": "number"
        },
        "query:parentFolderId": {
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "type": "string"
        },
        "query:name": {
          "type": "string"
        },
        "query:statusFilter": {
          "$ref": "#/components/schemas/DeleteFilter"
        },
        "query:sort": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FolderDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "createFolder",
      "method": "POST",
      "path": "/api/v1/folders",
      "requestSchema": {
        "$ref": "#/components/schemas/CreateFolderDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "201": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 201
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/FolderDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "updateFolder",
      "method": "PATCH",
      "path": "/api/v1/folders/{folderId}",
      "requestSchema": {
        "$ref": "#/components/schemas/UpdateFolderDto"
      },
      "parameterSchemas": {
        "path:folderId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/FolderDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "deleteFolder",
      "method": "DELETE",
      "path": "/api/v1/folders/{folderId}",
      "parameterSchemas": {
        "path:folderId": {
          "type": "string",
          "pattern": "^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$"
        }
      },
      "responseSchemas": {}
    },
    {
      "operationId": "getReservationBookingFeed",
      "method": "GET",
      "path": "/api/v1/reservations/booking-feed",
      "parameterSchemas": {
        "query:skip": {
          "minimum": 0,
          "type": "number"
        },
        "query:take": {
          "minimum": 1,
          "maximum": 200,
          "type": "number"
        },
        "query:dateFrom": {
          "format": "date-time",
          "type": "string"
        },
        "query:dateTo": {
          "format": "date-time",
          "type": "string"
        },
        "query:timeZone": {
          "default": "Asia/Seoul",
          "type": "string"
        },
        "query:search": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/BookingFeedItemDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "createReservation",
      "method": "POST",
      "path": "/api/v1/reservations",
      "requestSchema": {
        "$ref": "#/components/schemas/CreateReservationDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "201": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 201
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/ReservationDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getMyReservations",
      "method": "GET",
      "path": "/api/v1/reservations/me",
      "parameterSchemas": {
        "query:skip": {
          "minimum": 0,
          "type": "number"
        },
        "query:take": {
          "minimum": 1,
          "maximum": 200,
          "type": "number"
        },
        "query:status": {
          "$ref": "#/components/schemas/ReservationStatus"
        },
        "query:from": {
          "format": "date-time",
          "type": "string"
        },
        "query:to": {
          "format": "date-time",
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ReservationDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getPasswordPolicy",
      "method": "GET",
      "path": "/api/password-policy",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/PasswordPolicyDto"
        }
      }
    },
    {
      "operationId": "requestPasswordReset",
      "method": "POST",
      "path": "/api/forgot-password",
      "requestSchema": {
        "type": "object",
        "required": [
          "email"
        ],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com"
          }
        }
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/ForgotPasswordResultDto"
        }
      }
    },
    {
      "operationId": "validateResetToken",
      "method": "GET",
      "path": "/api/reset-password/{token}",
      "parameterSchemas": {
        "path:token": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/TokenValidationDto"
        }
      }
    },
    {
      "operationId": "executePasswordReset",
      "method": "POST",
      "path": "/api/reset-password/{token}",
      "requestSchema": {
        "type": "object",
        "required": [
          "password",
          "confirmPassword"
        ],
        "properties": {
          "password": {
            "type": "string",
            "example": "NewPassword1!@"
          },
          "confirmPassword": {
            "type": "string",
            "example": "NewPassword1!@"
          }
        }
      },
      "parameterSchemas": {
        "path:token": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/ResetPasswordResultDto"
        },
        "400": {
          "$ref": "#/components/schemas/ResetPasswordErrorDto"
        }
      }
    },
    {
      "operationId": "getInteraction",
      "method": "GET",
      "path": "/api/interaction/{uid}",
      "parameterSchemas": {
        "path:uid": {
          "example": "abc123xyz",
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/InteractionDataDto"
        }
      }
    },
    {
      "operationId": "submitLogin",
      "method": "POST",
      "path": "/api/interaction/{uid}/login",
      "requestSchema": {
        "$ref": "#/components/schemas/OidcLoginPayloadDto"
      },
      "parameterSchemas": {
        "path:uid": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/LoginSuccessDto"
        },
        "401": {
          "$ref": "#/components/schemas/LoginErrorDto"
        }
      }
    },
    {
      "operationId": "confirmConsent",
      "method": "POST",
      "path": "/api/interaction/{uid}/confirm",
      "parameterSchemas": {
        "path:uid": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/ConsentResultDto"
        }
      }
    },
    {
      "operationId": "abortInteraction",
      "method": "POST",
      "path": "/api/interaction/{uid}/abort",
      "parameterSchemas": {
        "path:uid": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "$ref": "#/components/schemas/AbortResultDto"
        }
      }
    },
    {
      "operationId": "login",
      "method": "GET",
      "path": "/api/v1/auth/oidc/login",
      "parameterSchemas": {
        "query:clientId": {
          "type": "string"
        },
        "query:returnTo": {
          "type": "string"
        },
        "query:prompt": {
          "type": "string"
        }
      },
      "responseSchemas": {}
    },
    {
      "operationId": "oidcCallback",
      "method": "GET",
      "path": "/api/v1/auth/callback",
      "parameterSchemas": {
        "query:clientId": {
          "type": "string"
        },
        "query:code": {
          "type": "string"
        },
        "query:state": {
          "type": "string"
        },
        "query:error": {
          "type": "string"
        },
        "query:error_description": {
          "type": "string"
        }
      },
      "responseSchemas": {}
    },
    {
      "operationId": "refreshToken",
      "method": "POST",
      "path": "/api/v1/auth/token/refresh",
      "parameterSchemas": {
        "header:x-refresh-token": {
          "type": "string"
        }
      },
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/TokenRefreshResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getSignUpSpaces",
      "method": "GET",
      "path": "/api/v1/auth/sign-up/spaces",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SpaceDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "signUp",
      "method": "POST",
      "path": "/api/v1/auth/sign-up",
      "requestSchema": {
        "$ref": "#/components/schemas/SignUpPayloadDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "201": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 201
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/EmailVerificationRequestedDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "confirmEmailVerification",
      "method": "GET",
      "path": "/api/v1/auth/email-verifications/{token}/confirm",
      "parameterSchemas": {
        "path:token": {
          "type": "string"
        }
      },
      "responseSchemas": {}
    },
    {
      "operationId": "verifyToken",
      "method": "GET",
      "path": "/api/v1/auth/verify-token",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/VerifyTokenResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getMySpaces",
      "method": "GET",
      "path": "/api/v1/auth/my-spaces",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SpaceDto"
                  }
                },
                "meta": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "number",
                      "description": "전체 항목 수"
                    },
                    "page": {
                      "type": "number",
                      "description": "현재 페이지"
                    },
                    "limit": {
                      "type": "number",
                      "description": "페이지당 항목 수"
                    },
                    "totalPages": {
                      "type": "number",
                      "description": "전체 페이지 수"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "getCurrentSpace",
      "method": "GET",
      "path": "/api/v1/auth/current-space",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/SpaceDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "setCurrentSpace",
      "method": "POST",
      "path": "/api/v1/auth/current-space",
      "requestSchema": {
        "$ref": "#/components/schemas/SetCurrentSpaceDto"
      },
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/SpaceDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    },
    {
      "operationId": "logout",
      "method": "POST",
      "path": "/api/v1/auth/logout",
      "parameterSchemas": {},
      "responseSchemas": {
        "200": {
          "allOf": [
            {
              "properties": {
                "httpStatus": {
                  "type": "number",
                  "nullable": false,
                  "example": 200
                },
                "message": {
                  "type": "string",
                  "nullable": false
                },
                "data": {
                  "$ref": "#/components/schemas/LogoutResponseDto",
                  "nullable": true
                }
              }
            }
          ]
        }
      }
    }
  ],
  "schemas": {
    "LanguageCode": {
      "type": "string",
      "enum": [
        "ko_KR",
        "en_US",
        "zh_CN",
        "ja_JP"
      ],
      "description": "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어"
    },
    "CategoryDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "default": ""
        },
        "parent": {
          "$ref": "#/components/schemas/CategoryDto"
        },
        "children": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/CategoryDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "SpaceClassificationDto": {
      "type": "object",
      "properties": {
        "category": {
          "$ref": "#/components/schemas/CategoryDto"
        },
        "space": {
          "$ref": "#/components/schemas/SpaceDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "SpaceAssociationDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "CompanyDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "label": {
          "type": "string",
          "nullable": true
        },
        "address": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "businessNo": {
          "type": "string"
        },
        "logoImageFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "fitnessCenters": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/FitnessCenterDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "address",
        "phone",
        "email",
        "businessNo",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "FitnessCenterSpaceDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "contentLanguageCode": {
          "allOf": [
            {
              "$ref": "#/components/schemas/LanguageCode"
            }
          ]
        },
        "name": {
          "type": "string"
        },
        "label": {
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "contentLanguageCode",
        "name"
      ]
    },
    "FitnessCenterDto": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "imageFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "company": {
          "nullable": true,
          "type": "object",
          "allOf": [
            {
              "$ref": "#/components/schemas/CompanyDto"
            }
          ]
        },
        "space": {
          "nullable": true,
          "type": "object",
          "allOf": [
            {
              "$ref": "#/components/schemas/FitnessCenterSpaceDto"
            }
          ]
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "address",
        "phone",
        "email",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "SpaceDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Space의 표시 이름. 공간 선택·목록·검색의 원천입니다."
        },
        "label": {
          "type": "string",
          "description": "Space 표시 이름 아래에 함께 보여주는 보조 라벨입니다.",
          "nullable": true
        },
        "contentLanguageCode": {
          "description": "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
          "default": "ko_KR",
          "allOf": [
            {
              "$ref": "#/components/schemas/LanguageCode"
            }
          ]
        },
        "tenantId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "이 Space 접근에 사용할 Tenant ULID",
          "nullable": true
        },
        "spaceClassification": {
          "$ref": "#/components/schemas/SpaceClassificationDto"
        },
        "spaceAssociations": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SpaceAssociationDto"
          }
        },
        "fitnessCenter": {
          "$ref": "#/components/schemas/FitnessCenterDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "contentLanguageCode",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "RoleClassificationDto": {
      "type": "object",
      "properties": {
        "category": {
          "$ref": "#/components/schemas/CategoryDto"
        },
        "role": {
          "$ref": "#/components/schemas/RoleDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "RoleAssociationDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "SubjectResponseDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Subject 이름 (Prisma 모델명)",
          "example": "User"
        },
        "displayName": {
          "type": "string",
          "description": "Subject 표시명 (@displayName 주석)",
          "example": "사용자",
          "nullable": true
        },
        "fieldCount": {
          "type": "number",
          "description": "필드 수",
          "example": 10
        }
      },
      "required": [
        "name",
        "displayName",
        "fieldCount"
      ]
    },
    "ActionConfigDto": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "설정 유형 (masking, format, transform)",
          "example": "masking"
        },
        "preset": {
          "type": "string",
          "description": "마스킹 프리셋 (PRESET_EMAIL, PRESET_PHONE 등)",
          "example": "PRESET_EMAIL"
        },
        "pattern": {
          "type": "string",
          "description": "커스텀 패턴 (정규식)",
          "example": "^(.{3}).*(.{2})$"
        },
        "replacement": {
          "type": "string",
          "description": "치환 문자열",
          "example": "$1***$2"
        },
        "rule": {
          "type": "string",
          "description": "변환 규칙",
          "example": "uppercase"
        }
      },
      "required": [
        "type"
      ]
    },
    "ActionResponseDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "order": {
          "type": "number"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "displayName": {
          "type": "string",
          "description": "표시명",
          "example": "이메일 마스킹 조회",
          "nullable": true
        },
        "description": {
          "type": "string",
          "description": "설명",
          "example": "이메일을 마스킹하여 조회합니다",
          "nullable": true
        },
        "group": {
          "type": "string",
          "description": "그룹 (crud, visibility, bulk, workflow)",
          "example": "visibility",
          "nullable": true
        },
        "config": {
          "description": "Action 설정 (마스킹, 포맷팅 등)",
          "nullable": true,
          "type": "object",
          "allOf": [
            {
              "$ref": "#/components/schemas/ActionConfigDto"
            }
          ]
        }
      },
      "required": [
        "name",
        "order",
        "id",
        "createdAt",
        "updatedAt",
        "displayName",
        "description",
        "group",
        "config"
      ]
    },
    "AbilityResponseDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "inverted": {
          "type": "boolean"
        },
        "subject": {
          "$ref": "#/components/schemas/SubjectResponseDto"
        },
        "action": {
          "$ref": "#/components/schemas/ActionResponseDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "fields": {
          "description": "대상 필드 목록",
          "example": [
            "email",
            "name"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "conditions": {
          "type": "object",
          "description": "권한 조건 (JSON 형식)",
          "example": {
            "id": "${user.id}"
          },
          "nullable": true
        },
        "reason": {
          "type": "string",
          "description": "거부 사유",
          "example": "관리자만 삭제할 수 있습니다",
          "nullable": true
        },
        "description": {
          "type": "string",
          "description": "권한 설명",
          "example": "사용자 이메일을 마스킹하여 조회합니다",
          "nullable": true
        }
      },
      "required": [
        "name",
        "inverted",
        "id",
        "createdAt",
        "updatedAt",
        "fields",
        "conditions",
        "reason",
        "description"
      ]
    },
    "PolicyEntryResponseDto": {
      "type": "object",
      "properties": {
        "createdAt": {
          "format": "date-time",
          "type": "string",
          "description": "생성 일시",
          "example": "2026-01-01T00:00:00.000Z"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "description": "수정 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "description": "삭제 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "ability": {
          "description": "연결된 Ability 상세 정보",
          "allOf": [
            {
              "$ref": "#/components/schemas/AbilityResponseDto"
            }
          ]
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        }
      },
      "required": [
        "createdAt",
        "updatedAt",
        "removedAt",
        "id"
      ]
    },
    "PolicyResponseDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "정책 식별자",
          "example": "space-admin"
        },
        "displayName": {
          "type": "string",
          "description": "정책 표시명",
          "example": "워크스페이스 관리자 정책",
          "nullable": true
        },
        "description": {
          "type": "string",
          "description": "정책 설명",
          "example": "워크스페이스 관리자가 기본으로 갖는 권한 묶음입니다.",
          "nullable": true
        },
        "createdAt": {
          "format": "date-time",
          "type": "string",
          "description": "생성 일시",
          "example": "2026-01-01T00:00:00.000Z"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "description": "수정 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "description": "삭제 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "entries": {
          "description": "정책에 연결된 Ability 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/PolicyEntryResponseDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        }
      },
      "required": [
        "name",
        "displayName",
        "description",
        "createdAt",
        "updatedAt",
        "removedAt",
        "id"
      ]
    },
    "RoleAssignmentResponseDto": {
      "type": "object",
      "properties": {
        "isActive": {
          "type": "boolean",
          "description": "활성화 여부",
          "example": true
        },
        "priority": {
          "type": "number",
          "description": "우선순위 (높을수록 우선)",
          "example": 0
        },
        "createdAt": {
          "format": "date-time",
          "type": "string",
          "description": "생성 일시",
          "example": "2026-01-01T00:00:00.000Z"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "description": "수정 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "description": "삭제 일시",
          "example": "2026-01-01T00:00:00.000Z",
          "nullable": true
        },
        "policy": {
          "description": "할당된 Policy 상세 정보",
          "allOf": [
            {
              "$ref": "#/components/schemas/PolicyResponseDto"
            }
          ]
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        }
      },
      "required": [
        "isActive",
        "priority",
        "createdAt",
        "updatedAt",
        "removedAt",
        "id"
      ]
    },
    "RoleDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "name": {
          "type": "string",
          "description": "역할 식별자",
          "maxLength": 50,
          "pattern": "^[A-Z][A-Z0-9_]*$"
        },
        "displayName": {
          "type": "string",
          "nullable": true,
          "description": "표시명",
          "maxLength": 50
        },
        "description": {
          "type": "string",
          "nullable": true,
          "description": "설명",
          "maxLength": 200
        },
        "classification": {
          "nullable": true,
          "type": "object",
          "allOf": [
            {
              "$ref": "#/components/schemas/RoleClassificationDto"
            }
          ]
        },
        "associations": {
          "nullable": true,
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/RoleAssociationDto"
          }
        },
        "assignments": {
          "description": "역할에 연결된 정책 할당 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/RoleAssignmentResponseDto"
          }
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "name",
        "classification",
        "associations",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "TenantDto": {
      "type": "object",
      "properties": {
        "space": {
          "$ref": "#/components/schemas/SpaceDto"
        },
        "user": {
          "$ref": "#/components/schemas/UserDto"
        },
        "role": {
          "$ref": "#/components/schemas/RoleDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "UserAssociationDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "UserClassificationDto": {
      "type": "object",
      "properties": {
        "user": {
          "$ref": "#/components/schemas/UserDto"
        },
        "category": {
          "$ref": "#/components/schemas/CategoryDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "UserDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "name": {
          "type": "string",
          "description": "사용자 이름"
        },
        "email": {
          "type": "string",
          "description": "이메일 주소"
        },
        "phone": {
          "type": "string",
          "description": "연락처"
        },
        "passwordChangedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "비밀번호 변경일"
        },
        "profiles": {
          "description": "프로필 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProfileDto"
          }
        },
        "tenants": {
          "description": "테넌트 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/TenantDto"
          }
        },
        "associations": {
          "description": "사용자 연결 정보",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/UserAssociationDto"
          }
        },
        "classification": {
          "description": "사용자 분류 정보",
          "allOf": [
            {
              "$ref": "#/components/schemas/UserClassificationDto"
            }
          ]
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "failedLoginAttempts": {
          "type": "number",
          "description": "로그인 실패 횟수"
        },
        "lockedUntil": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "잠금 해제 시각"
        },
        "isPermanentlyLocked": {
          "type": "boolean",
          "description": "영구 잠금 여부"
        },
        "lastLoginAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "마지막 로그인 시각"
        },
        "lastLoginIp": {
          "type": "string",
          "nullable": true,
          "description": "마지막 로그인 IP"
        },
        "isActive": {
          "type": "boolean",
          "description": "활성 상태"
        }
      },
      "required": [
        "id",
        "name",
        "email",
        "phone",
        "passwordChangedAt",
        "createdAt",
        "updatedAt",
        "removedAt",
        "failedLoginAttempts",
        "lockedUntil",
        "isPermanentlyLocked",
        "lastLoginAt",
        "lastLoginIp",
        "isActive"
      ]
    },
    "ProfileDto": {
      "type": "object",
      "properties": {
        "avatarFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "name": {
          "type": "string"
        },
        "nickname": {
          "type": "string"
        },
        "address": {
          "type": "string"
        },
        "user": {
          "$ref": "#/components/schemas/UserDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "avatarFileId",
        "name",
        "nickname",
        "address",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "UserPaginationMetaDto": {
      "type": "object",
      "properties": {
        "total": {
          "type": "number",
          "description": "전체 사용자 수"
        },
        "skip": {
          "type": "number",
          "description": "건너뛴 항목 수 (offset)"
        },
        "take": {
          "type": "number",
          "description": "조회 항목 수"
        },
        "totalPages": {
          "type": "number",
          "description": "전체 페이지 수"
        }
      },
      "required": [
        "total",
        "skip",
        "take",
        "totalPages"
      ]
    },
    "UserStatsDto": {
      "type": "object",
      "properties": {
        "total": {
          "type": "number",
          "description": "전체 사용자 수"
        },
        "active": {
          "type": "number",
          "description": "활성 사용자 수 (최근 30일 내 활동)"
        },
        "inactive": {
          "type": "number",
          "description": "비활성 사용자 수 (30일 이상 미활동)"
        },
        "newThisMonth": {
          "type": "number",
          "description": "이번 달 신규 가입자 수"
        }
      },
      "required": [
        "total",
        "active",
        "inactive",
        "newThisMonth"
      ]
    },
    "DeleteFilter": {
      "type": "string",
      "enum": [
        "active",
        "deleted"
      ]
    },
    "UserDetailResponseDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "name": {
          "type": "string",
          "description": "사용자 이름"
        },
        "email": {
          "type": "string",
          "description": "이메일 주소"
        },
        "phone": {
          "type": "string",
          "description": "연락처"
        },
        "passwordChangedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "비밀번호 변경일"
        },
        "profiles": {
          "description": "프로필 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProfileDto"
          }
        },
        "tenants": {
          "description": "테넌트 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/TenantDto"
          }
        },
        "associations": {
          "description": "사용자 연결 정보",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/UserAssociationDto"
          }
        },
        "classification": {
          "description": "사용자 분류 정보",
          "allOf": [
            {
              "$ref": "#/components/schemas/UserClassificationDto"
            }
          ]
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "failedLoginAttempts": {
          "type": "number",
          "description": "로그인 실패 횟수"
        },
        "lockedUntil": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "잠금 해제 시각"
        },
        "isPermanentlyLocked": {
          "type": "boolean",
          "description": "영구 잠금 여부"
        },
        "lastLoginAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true,
          "description": "마지막 로그인 시각"
        },
        "lastLoginIp": {
          "type": "string",
          "nullable": true,
          "description": "마지막 로그인 IP"
        },
        "isActive": {
          "type": "boolean",
          "description": "활성 상태"
        }
      },
      "required": [
        "id",
        "name",
        "email",
        "phone",
        "passwordChangedAt",
        "createdAt",
        "updatedAt",
        "removedAt",
        "failedLoginAttempts",
        "lockedUntil",
        "isPermanentlyLocked",
        "lastLoginAt",
        "lastLoginIp",
        "isActive"
      ]
    },
    "UserTenantDetailResponseDto": {
      "type": "object",
      "properties": {
        "space": {
          "$ref": "#/components/schemas/SpaceDto"
        },
        "user": {
          "$ref": "#/components/schemas/UserDto"
        },
        "role": {
          "$ref": "#/components/schemas/RoleDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "CreateRoleDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "역할 식별자",
          "maxLength": 50,
          "pattern": "^[A-Z][A-Z0-9_]*$"
        },
        "displayName": {
          "type": "string",
          "nullable": true,
          "description": "표시명",
          "maxLength": 50
        },
        "description": {
          "type": "string",
          "nullable": true,
          "description": "설명",
          "maxLength": 200
        }
      },
      "required": [
        "name"
      ]
    },
    "UpdateRoleDto": {
      "type": "object",
      "properties": {
        "displayName": {
          "type": "string",
          "nullable": true,
          "description": "표시명",
          "maxLength": 50
        },
        "description": {
          "type": "string",
          "nullable": true,
          "description": "설명",
          "maxLength": 200
        }
      }
    },
    "I18nCatalogResponseDto": {
      "type": "object",
      "properties": {
        "languageCode": {
          "type": "string",
          "description": "언어 코드",
          "enum": [
            "ko_KR",
            "en_US",
            "zh_CN",
            "ja_JP"
          ],
          "example": "ko_KR"
        },
        "messages": {
          "type": "object",
          "description": "번역 catalog",
          "example": {
            "성공": "성공",
            "로그아웃": "로그아웃"
          }
        }
      },
      "required": [
        "languageCode",
        "messages"
      ]
    },
    "CommunityPostDto": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "커뮤니티 게시글 ULID"
        },
        "title": {
          "type": "string",
          "description": "게시글 제목",
          "maxLength": 80,
          "nullable": true
        },
        "text": {
          "type": "string",
          "description": "게시글 본문",
          "maxLength": 1000
        },
        "authorName": {
          "type": "string",
          "description": "작성자 표시 이름"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string",
          "description": "작성 시각"
        },
        "isMine": {
          "type": "boolean",
          "description": "현재 로그인 사용자가 작성한 글 여부"
        },
        "isPinned": {
          "type": "boolean",
          "description": "공지/고정 게시글 여부"
        }
      },
      "required": [
        "id",
        "text",
        "authorName",
        "createdAt",
        "isMine",
        "isPinned"
      ]
    },
    "CreateCommunityPostPayloadDto": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "게시글 제목",
          "maxLength": 80
        },
        "text": {
          "type": "string",
          "description": "게시글 본문",
          "maxLength": 1000
        }
      },
      "required": [
        "text"
      ]
    },
    "SyncRoleAssignmentItemDto": {
      "type": "object",
      "properties": {
        "policyId": {
          "type": "string",
          "description": "Policy 공개 ID (Role에 할당할 정책, ULID)",
          "example": "01JPOLICY0000000000000000PC"
        },
        "isActive": {
          "type": "boolean",
          "description": "활성화 여부",
          "example": true,
          "default": true
        },
        "priority": {
          "type": "number",
          "description": "우선순위 (높을수록 우선)",
          "example": 0,
          "default": 0
        }
      },
      "required": [
        "policyId"
      ]
    },
    "SyncRoleAssignmentsDto": {
      "type": "object",
      "properties": {
        "assignments": {
          "description": "Role에 연결할 Policy 목록입니다. 전체 동기화 방식으로 반영됩니다.",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SyncRoleAssignmentItemDto"
          }
        }
      },
      "required": [
        "assignments"
      ]
    },
    "FolderDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "폴더명"
        },
        "path": {
          "type": "string",
          "description": "전체 경로 (예: /images/2024)"
        },
        "sortOrder": {
          "type": "integer",
          "description": "정렬 순서"
        },
        "parent": {
          "description": "부모 폴더",
          "allOf": [
            {
              "$ref": "#/components/schemas/FolderDto"
            }
          ]
        },
        "children": {
          "description": "하위 폴더 목록",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/FolderDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "path",
        "sortOrder",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "CreateFolderDto": {
      "type": "object",
      "properties": {
        "parentFolderId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "nullable": true,
          "description": "상위 폴더 ULID (루트면 null)"
        },
        "name": {
          "type": "string",
          "description": "폴더명",
          "maxLength": 100,
          "pattern": "^[^\\\\/:*?\"<>|]+$"
        }
      },
      "required": [
        "name"
      ]
    },
    "UpdateFolderDto": {
      "type": "object",
      "properties": {
        "parentFolderId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "nullable": true,
          "description": "상위 폴더 ULID (루트면 null)"
        },
        "name": {
          "type": "string",
          "description": "폴더명",
          "maxLength": 100,
          "pattern": "^[^\\\\/:*?\"<>|]+$"
        }
      }
    },
    "ReservationAvailabilityStatus": {
      "type": "string",
      "enum": [
        "AVAILABLE",
        "FEW_LEFT",
        "WAITLIST_OPEN",
        "RESERVED",
        "WAITLISTED",
        "BOOKING_CLOSED"
      ],
      "description": "예약 가능 상태"
    },
    "ReservationStatus": {
      "type": "string",
      "enum": [
        "CONFIRMED",
        "WAITLISTED",
        "CANCELED"
      ],
      "description": "내 예약 상태"
    },
    "BookingFeedItemDto": {
      "type": "object",
      "properties": {
        "feedItemId": {
          "type": "string",
          "description": "피드 항목 ID"
        },
        "date": {
          "type": "string",
          "description": "일자(YYYY-MM-DD)"
        },
        "startsAt": {
          "format": "date-time",
          "type": "string",
          "description": "시작 시각"
        },
        "endsAt": {
          "format": "date-time",
          "type": "string",
          "description": "종료 시각"
        },
        "timelineId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "타임라인 ULID"
        },
        "sessionId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "세션 ULID"
        },
        "programId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "프로그램 ULID"
        },
        "timelineName": {
          "type": "string",
          "description": "타임라인 이름"
        },
        "sessionName": {
          "type": "string",
          "description": "세션 이름"
        },
        "programName": {
          "type": "string",
          "description": "프로그램 이름"
        },
        "coachName": {
          "type": "string",
          "description": "코치 이름",
          "nullable": true
        },
        "capacity": {
          "type": "integer",
          "description": "정원",
          "minimum": 0
        },
        "confirmedCount": {
          "type": "integer",
          "description": "확정 예약 수",
          "minimum": 0
        },
        "availableSeatCount": {
          "type": "integer",
          "description": "예약 가능 좌석 수",
          "minimum": 0
        },
        "waitlistCount": {
          "type": "integer",
          "description": "대기 예약 수",
          "minimum": 0
        },
        "availabilityStatus": {
          "description": "예약 가능 상태",
          "allOf": [
            {
              "$ref": "#/components/schemas/ReservationAvailabilityStatus"
            }
          ]
        },
        "myReservationStatus": {
          "description": "내 예약 상태",
          "nullable": true,
          "allOf": [
            {
              "$ref": "#/components/schemas/ReservationStatus"
            }
          ]
        },
        "ctaLabel": {
          "type": "string",
          "description": "CTA 라벨"
        },
        "cancelableUntilAt": {
          "format": "date-time",
          "type": "string",
          "description": "취소 가능 마감 시각",
          "nullable": true
        },
        "level": {
          "type": "string",
          "description": "난이도",
          "nullable": true
        },
        "routineLabelSnapshot": {
          "type": "string",
          "description": "루틴 라벨 스냅샷",
          "nullable": true
        },
        "previewExerciseNames": {
          "description": "운동 미리보기",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "feedItemId",
        "date",
        "startsAt",
        "endsAt",
        "timelineId",
        "sessionId",
        "programId",
        "timelineName",
        "sessionName",
        "programName",
        "capacity",
        "confirmedCount",
        "availableSeatCount",
        "waitlistCount",
        "availabilityStatus",
        "ctaLabel",
        "cancelableUntilAt"
      ]
    },
    "SessionTypes": {
      "type": "string",
      "enum": [
        "ONE_TIME",
        "ONE_TIME_RANGE",
        "RECURRING"
      ]
    },
    "RepeatCycleTypes": {
      "type": "string",
      "enum": [
        "WEEKLY",
        "MONTHLY"
      ]
    },
    "RecurringDayOfWeek": {
      "type": "string",
      "enum": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
      ]
    },
    "ExerciseDto": {
      "type": "object",
      "properties": {
        "duration": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "description": {
          "type": "string",
          "nullable": true
        },
        "imageFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "videoFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "name": {
          "type": "string"
        },
        "task": {
          "$ref": "#/components/schemas/TaskDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "duration",
        "count",
        "name",
        "task",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "TaskDto": {
      "type": "object",
      "properties": {
        "exercise": {
          "$ref": "#/components/schemas/ExerciseDto"
        },
        "activities": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ActivityDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "exercise",
        "activities",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "ActivityDto": {
      "type": "object",
      "properties": {
        "order": {
          "type": "number"
        },
        "repetitions": {
          "type": "number"
        },
        "restTime": {
          "type": "number"
        },
        "notes": {
          "type": "string",
          "nullable": true
        },
        "routine": {
          "$ref": "#/components/schemas/RoutineDto"
        },
        "task": {
          "$ref": "#/components/schemas/TaskDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "order",
        "repetitions",
        "restTime",
        "routine",
        "task",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "RoutineDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "programs": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProgramDto"
          }
        },
        "activities": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ActivityDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "label",
        "programs",
        "activities",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "ProgramActivityDto": {
      "type": "object",
      "properties": {
        "order": {
          "type": "number"
        },
        "repetitions": {
          "type": "number"
        },
        "restTime": {
          "type": "number"
        },
        "notes": {
          "type": "string",
          "nullable": true
        },
        "exerciseName": {
          "type": "string"
        },
        "exerciseDescription": {
          "type": "string",
          "nullable": true
        },
        "exerciseDuration": {
          "type": "number"
        },
        "exerciseCount": {
          "type": "number"
        },
        "imageFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "videoFileId": {
          "type": "string",
          "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          "nullable": true
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "order",
        "repetitions",
        "restTime",
        "exerciseName",
        "exerciseDuration",
        "exerciseCount",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "ProgramDto": {
      "type": "object",
      "properties": {
        "capacity": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "level": {
          "type": "string",
          "nullable": true
        },
        "routineNameSnapshot": {
          "type": "string",
          "nullable": true
        },
        "routineLabelSnapshot": {
          "type": "string",
          "nullable": true
        },
        "routine": {
          "$ref": "#/components/schemas/RoutineDto"
        },
        "session": {
          "$ref": "#/components/schemas/SessionDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "activityCount": {
          "type": "integer",
          "minimum": 0
        },
        "previewExerciseNames": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "executionPlan": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProgramActivityDto"
          }
        }
      },
      "required": [
        "capacity",
        "name",
        "routine",
        "session",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "SessionDto": {
      "type": "object",
      "properties": {
        "type": {
          "allOf": [
            {
              "$ref": "#/components/schemas/SessionTypes"
            }
          ]
        },
        "repeatCycleType": {
          "nullable": true,
          "allOf": [
            {
              "$ref": "#/components/schemas/RepeatCycleTypes"
            }
          ]
        },
        "startDateTime": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "endDateTime": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "recurringDayOfWeek": {
          "nullable": true,
          "allOf": [
            {
              "$ref": "#/components/schemas/RecurringDayOfWeek"
            }
          ]
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string",
          "nullable": true
        },
        "programs": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProgramDto"
          }
        },
        "timeline": {
          "$ref": "#/components/schemas/TimelineDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "type",
        "name",
        "programs",
        "timeline",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "TimelineDto": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string",
          "nullable": true
        },
        "sessions": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SessionDto"
          }
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "name",
        "sessions",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "ReservationDto": {
      "type": "object",
      "properties": {
        "occurrenceStartAt": {
          "format": "date-time",
          "type": "string",
          "description": "예약 발생 회차 시작 시각"
        },
        "status": {
          "description": "예약 상태",
          "allOf": [
            {
              "$ref": "#/components/schemas/ReservationStatus"
            }
          ]
        },
        "memo": {
          "type": "string",
          "description": "예약 메모",
          "nullable": true
        },
        "idempotencyKey": {
          "type": "string",
          "description": "멱등성 키"
        },
        "waitlistPosition": {
          "type": "integer",
          "description": "대기 순번",
          "nullable": true,
          "minimum": 1
        },
        "confirmedAt": {
          "format": "date-time",
          "type": "string",
          "description": "확정 시각",
          "nullable": true
        },
        "canceledAt": {
          "format": "date-time",
          "type": "string",
          "description": "취소 시각",
          "nullable": true
        },
        "cancelReason": {
          "type": "string",
          "description": "취소 사유",
          "nullable": true
        },
        "user": {
          "$ref": "#/components/schemas/UserDto"
        },
        "timeline": {
          "$ref": "#/components/schemas/TimelineDto"
        },
        "session": {
          "$ref": "#/components/schemas/SessionDto"
        },
        "program": {
          "$ref": "#/components/schemas/ProgramDto"
        },
        "id": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "공개 식별자 ULID"
        },
        "createdAt": {
          "format": "date-time",
          "type": "string"
        },
        "updatedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        },
        "removedAt": {
          "format": "date-time",
          "type": "string",
          "nullable": true
        }
      },
      "required": [
        "occurrenceStartAt",
        "status",
        "idempotencyKey",
        "confirmedAt",
        "canceledAt",
        "id",
        "createdAt",
        "updatedAt",
        "removedAt"
      ]
    },
    "CreateReservationDto": {
      "type": "object",
      "properties": {
        "timelineId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "타임라인 공개 ID (ULID)"
        },
        "sessionId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "세션 공개 ID (ULID)"
        },
        "programId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "프로그램 공개 ID (ULID)"
        },
        "occurrenceStartAt": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "예약 시작 시각 (ISO 8601)"
        },
        "idempotencyKey": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "멱등성 키",
          "minLength": 8,
          "maxLength": 120
        },
        "memo": {
          "type": "string",
          "description": "예약 메모",
          "maxLength": 1000,
          "nullable": true
        }
      },
      "required": [
        "timelineId",
        "sessionId",
        "programId",
        "occurrenceStartAt",
        "idempotencyKey"
      ]
    },
    "PasswordPolicyDto": {
      "type": "object",
      "properties": {
        "minLength": {
          "type": "number",
          "description": "최소 길이"
        },
        "maxLength": {
          "type": "number",
          "description": "최대 길이"
        },
        "requireUppercase": {
          "type": "boolean",
          "description": "영문 대문자 필수 여부"
        },
        "requireLowercase": {
          "type": "boolean",
          "description": "영문 소문자 필수 여부"
        },
        "requireNumber": {
          "type": "boolean",
          "description": "숫자 필수 여부"
        },
        "requireSpecial": {
          "type": "boolean",
          "description": "특수문자 필수 여부"
        },
        "blockCommonPasswords": {
          "type": "boolean",
          "description": "흔한 비밀번호 차단 여부"
        },
        "reuseLimit": {
          "type": "number",
          "description": "최근 비밀번호 재사용 제한 개수"
        }
      },
      "required": [
        "minLength",
        "maxLength",
        "requireUppercase",
        "requireLowercase",
        "requireNumber",
        "requireSpecial",
        "blockCommonPasswords",
        "reuseLimit"
      ]
    },
    "ForgotPasswordResultDto": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "응답 메시지"
        }
      },
      "required": [
        "message"
      ]
    },
    "TokenValidationDto": {
      "type": "object",
      "properties": {
        "valid": {
          "type": "boolean",
          "description": "토큰 유효 여부"
        },
        "email": {
          "type": "string",
          "description": "이메일 주소"
        },
        "reason": {
          "type": "string",
          "description": "유효하지 않은 이유"
        }
      },
      "required": [
        "valid"
      ]
    },
    "ResetPasswordResultDto": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "응답 메시지"
        }
      },
      "required": [
        "message"
      ]
    },
    "ResetPasswordErrorDto": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string",
          "description": "에러 코드"
        }
      },
      "required": [
        "error"
      ]
    },
    "InteractionClientDto": {
      "type": "object",
      "properties": {
        "clientId": {
          "type": "string",
          "description": "클라이언트 ID"
        },
        "name": {
          "type": "string",
          "description": "클라이언트 이름"
        },
        "logoUri": {
          "type": "string",
          "description": "로고 URI"
        },
        "loginUi": {
          "type": "object",
          "description": "로그인 화면 표시 설정",
          "additionalProperties": true,
          "nullable": true
        }
      },
      "required": [
        "clientId",
        "name"
      ]
    },
    "InteractionDataDto": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "인터랙션 유형 (login | consent)"
        },
        "uid": {
          "type": "string",
          "description": "인터랙션 UID"
        },
        "client": {
          "description": "클라이언트 정보",
          "nullable": true,
          "type": "object",
          "allOf": [
            {
              "$ref": "#/components/schemas/InteractionClientDto"
            }
          ]
        },
        "prompt": {
          "type": "object",
          "description": "프롬프트 정보",
          "additionalProperties": true
        },
        "params": {
          "type": "object",
          "description": "파라미터",
          "additionalProperties": true
        },
        "session": {
          "type": "object",
          "description": "세션 정보",
          "additionalProperties": true
        },
        "isDev": {
          "type": "boolean",
          "description": "개발 모드 여부"
        }
      },
      "required": [
        "type",
        "uid",
        "prompt",
        "params",
        "isDev"
      ]
    },
    "OidcLoginPayloadDto": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "example": "user@example.com",
          "description": "사용자 이메일 주소"
        },
        "password": {
          "type": "string",
          "example": "password123",
          "description": "사용자 비밀번호"
        },
        "remember": {
          "type": "boolean",
          "description": "로그인 상태 유지 여부",
          "default": false
        }
      },
      "required": [
        "email",
        "password"
      ]
    },
    "LoginSuccessDto": {
      "type": "object",
      "properties": {
        "redirectTo": {
          "type": "string",
          "description": "리다이렉트 URL"
        }
      },
      "required": [
        "redirectTo"
      ]
    },
    "LoginRecoveryActionDto": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "액션 코드"
        },
        "label": {
          "type": "string",
          "description": "사용자 표시 라벨"
        },
        "href": {
          "type": "string",
          "description": "이동 경로"
        }
      },
      "required": [
        "type",
        "label"
      ]
    },
    "LoginErrorDto": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string",
          "description": "에러 코드"
        },
        "displayMessage": {
          "type": "string",
          "description": "사용자 표시 메시지"
        },
        "hint": {
          "type": "string",
          "description": "추가 안내 문구"
        },
        "remainingAttempts": {
          "type": "number",
          "description": "남은 시도 횟수"
        },
        "lockedUntil": {
          "type": "string",
          "description": "잠금 해제 시간 (ISO 8601)"
        },
        "temporaryLockThreshold": {
          "type": "number",
          "description": "임시 잠금 임계값"
        },
        "temporaryLockDurationMin": {
          "type": "number",
          "description": "임시 잠금 시간 (분)"
        },
        "recoveryActions": {
          "description": "사용 가능한 복구 액션",
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/LoginRecoveryActionDto"
          }
        }
      },
      "required": [
        "error"
      ]
    },
    "ConsentResultDto": {
      "type": "object",
      "properties": {
        "redirectTo": {
          "type": "string",
          "description": "리다이렉트 URL"
        }
      },
      "required": [
        "redirectTo"
      ]
    },
    "AbortResultDto": {
      "type": "object",
      "properties": {
        "redirectTo": {
          "type": "string",
          "description": "리다이렉트 URL"
        }
      },
      "required": [
        "redirectTo"
      ]
    },
    "TokenRefreshResponseDto": {
      "type": "object",
      "properties": {
        "accessToken": {
          "type": "string",
          "description": "새로 발급된 JWT Access Token",
          "example": "eyJhbGciOiJIUzI1NiIsR5cCI6IkpXVCJ9..."
        },
        "sessionId": {
          "type": "string",
          "description": "갱신된 세션 식별자. HttpOnly sessionId 쿠키를 가진 웹 클라이언트가 스토어를 부트스트랩할 때 사용한다. 쿠키가 없으면 null",
          "example": "admin-web.0123456789abcdef0123456789abcdef",
          "nullable": true
        },
        "refreshToken": {
          "type": "string",
          "description": "새로 발급된 JWT Refresh Token",
          "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        },
        "accessTokenExpiresAt": {
          "type": "number",
          "description": "Access Token 만료 시간 (Unix timestamp, milliseconds)",
          "example": 1704067200000
        },
        "refreshTokenExpiresAt": {
          "type": "number",
          "description": "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
          "example": 1704672000000
        },
        "user": {
          "description": "인증된 사용자 정보",
          "allOf": [
            {
              "$ref": "#/components/schemas/UserDto"
            }
          ]
        }
      },
      "required": [
        "accessToken",
        "refreshToken",
        "accessTokenExpiresAt",
        "refreshTokenExpiresAt",
        "user"
      ]
    },
    "EmailVerificationRequestedDto": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "description": "인증 요청 이메일"
        },
        "expiresAt": {
          "format": "date-time",
          "type": "string",
          "description": "인증 링크 만료 시각"
        }
      },
      "required": [
        "email",
        "expiresAt"
      ]
    },
    "SignUpPayloadDto": {
      "type": "object",
      "properties": {
        "nickname": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "minLength": 2,
          "maxLength": 50,
          "example": "홍길동",
          "description": "닉네임 (2-50자)"
        },
        "spaceId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "example": "01J00000000000000000000001",
          "description": "가입할 공간 공개 ID (ULID)"
        },
        "email": {
          "type": "string",
          "example": "user@example.com",
          "description": "이메일"
        },
        "name": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "minLength": 2,
          "maxLength": 50,
          "example": "홍길동",
          "description": "이름 (2-50자)"
        },
        "phone": {
          "type": "string",
          "example": "010-1234-5678",
          "description": "전화번호"
        },
        "address": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "minLength": 2,
          "maxLength": 255,
          "example": "서울특별시 강남구 샘플로 123",
          "description": "주소 (2-255자)"
        },
        "password": {
          "type": "string",
          "example": "Password123!",
          "description": "비밀번호 (10자 이상, 72자 이하)",
          "minLength": 10,
          "maxLength": 72
        }
      },
      "required": [
        "nickname",
        "spaceId",
        "email",
        "name",
        "phone",
        "address",
        "password"
      ]
    },
    "VerifyTokenResponseDto": {
      "type": "object",
      "properties": {
        "valid": {
          "type": "boolean",
          "description": "토큰 유효 여부"
        },
        "accessTokenExpiresAt": {
          "type": "number",
          "description": "Access Token 만료 시간 (Unix timestamp, ms)"
        },
        "refreshTokenExpiresAt": {
          "type": "number",
          "description": "Refresh Token 만료 시간 (Unix timestamp, ms)"
        },
        "hasFullAccess": {
          "type": "boolean",
          "description": "현재 `x-tenant-id`로 해석된 tenant role이 `PLATFORM_ADMIN`인지 여부"
        }
      },
      "required": [
        "valid",
        "accessTokenExpiresAt",
        "refreshTokenExpiresAt",
        "hasFullAccess"
      ]
    },
    "SetCurrentSpaceDto": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "pattern": "^[0-9A-HJKMNP-TV-Z]{26}$",
          "description": "현재 선택할 Tenant 공개 ID (ULID)",
          "example": "01JTENANT00000000000000000K"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "LogoutResponseDto": {
      "type": "object",
      "properties": {
        "endSessionUrl": {
          "type": "string",
          "description": "OIDC RP-Initiated Logout(end_session) URL. post_logout_redirect_uri와 client_id가 클라이언트 등록값으로 포함되며, 브라우저가 이 URL로 최상위 내비게이션하면 OP가 자기 세션과 쿠키를 정리한 뒤 등록된 URI로 리다이렉트한다. 세션 레코드의 ID Token이 iss/aud/exp 사전 검증을 통과하면 id_token_hint도 포함되고, 없거나 무효한(만료·구발급자) 세션은 client_id만 담겨 OP 확인 화면(한 번 클릭)을 거친다. OIDC 클라이언트 조회에 실패하면 null",
          "example": "http://localhost:3007/oidc/session/end?id_token_hint=eyJhbGciOiJSUzI1NiJ9...&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fauth%2Flogin&client_id=admin-web",
          "nullable": true
        }
      }
    }
  }
};
