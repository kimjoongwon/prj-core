// Orval input transformer가 codegen 시 갱신합니다.
import type { RuntimeManifest } from "./runtimeSchema";

export const runtimeManifest: RuntimeManifest = {
	operations: [
		{
			operationId: "getSpaces",
			method: "GET",
			path: "/api/v1/spaces",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:contentLanguageCode": {
					$ref: "#/components/schemas/LanguageCode",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SpaceDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createSpace",
			method: "POST",
			path: "/api/v1/spaces",
			requestSchema: {
				$ref: "#/components/schemas/CreateSpaceWithFitnessCenterDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SpaceDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSpaceFitnessCenter",
			method: "GET",
			path: "/api/v1/spaces/{spaceId}/fitness-center",
			parameterSchemas: {
				"path:spaceId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/FitnessCenterDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateSpaceFitnessCenter",
			method: "PATCH",
			path: "/api/v1/spaces/{spaceId}/fitness-center",
			requestSchema: {
				$ref: "#/components/schemas/UpdateFitnessCenterDto",
			},
			parameterSchemas: {
				"path:spaceId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SpaceDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getUsers",
			method: "GET",
			path: "/api/v1/users",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:name": {
					type: "string",
				},
				"query:email": {
					type: "string",
				},
				"query:phone": {
					type: "string",
				},
				"query:nickname": {
					type: "string",
				},
				"query:roles": {
					type: "array",
					items: {
						type: "string",
					},
				},
				"query:status": {
					$ref: "#/components/schemas/DeleteFilter",
				},
				"query:categoryId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:groupIds": {
					type: "array",
					items: {
						type: "string",
						pattern:
							"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					},
				},
				"query:createdFrom": {
					format: "date-time",
					type: "string",
				},
				"query:createdTo": {
					format: "date-time",
					type: "string",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/UserDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/UserPaginationMetaDto",
								},
								stats: {
									$ref: "#/components/schemas/UserStatsDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getUserById",
			method: "GET",
			path: "/api/v1/users/{userId}",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/UserDetailResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getUserTenantDetail",
			method: "GET",
			path: "/api/v1/users/{userId}/tenants/{tenantId}",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:tenantId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/UserTenantDetailResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getActions",
			method: "GET",
			path: "/api/v1/actions",
			parameterSchemas: {
				"query:group": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/ActionDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createAction",
			method: "POST",
			path: "/api/v1/actions",
			requestSchema: {
				$ref: "#/components/schemas/CreateActionDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ActionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getActionById",
			method: "GET",
			path: "/api/v1/actions/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ActionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateAction",
			method: "PATCH",
			path: "/api/v1/actions/{id}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateActionDto",
			},
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ActionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteAction",
			method: "DELETE",
			path: "/api/v1/actions/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ActionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getAssets",
			method: "GET",
			path: "/api/v1/assets",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:folderId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:spaceId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:kind": {
					$ref: "#/components/schemas/AssetKind",
				},
				"query:status": {
					$ref: "#/components/schemas/AssetStatus",
				},
				"query:search": {
					type: "string",
				},
				"query:statusFilter": {
					$ref: "#/components/schemas/DeleteFilter",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/AssetDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "uploadAsset",
			method: "POST",
			path: "/api/v1/assets",
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AssetDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getAssetById",
			method: "GET",
			path: "/api/v1/assets/{assetId}",
			parameterSchemas: {
				"path:assetId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AssetDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "removeAsset",
			method: "DELETE",
			path: "/api/v1/assets/{assetId}",
			parameterSchemas: {
				"path:assetId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getAssetContent",
			method: "GET",
			path: "/api/v1/assets/{assetId}/content",
			parameterSchemas: {
				"path:assetId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "moveAsset",
			method: "PATCH",
			path: "/api/v1/assets/{assetId}/move",
			requestSchema: {
				$ref: "#/components/schemas/MoveAssetDto",
			},
			parameterSchemas: {
				"path:assetId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AssetDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSubjects",
			method: "GET",
			path: "/api/v1/subjects",
			parameterSchemas: {
				"query:group": {
					type: "string",
				},
				"query:type": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SubjectDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSubjectFields",
			method: "GET",
			path: "/api/v1/subjects/{id}/fields",
			parameterSchemas: {
				"path:id": {
					format: "int64",
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SubjectFieldDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSubjectById",
			method: "GET",
			path: "/api/v1/subjects/{id}",
			parameterSchemas: {
				"path:id": {
					format: "int64",
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SubjectDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getAbilities",
			method: "GET",
			path: "/api/v1/abilities",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/AbilityResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createAbility",
			method: "POST",
			path: "/api/v1/abilities",
			requestSchema: {
				$ref: "#/components/schemas/CreateAbilityDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AbilityResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getMyAbilities",
			method: "GET",
			path: "/api/v1/abilities/my",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/AbilityResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getAbilityById",
			method: "GET",
			path: "/api/v1/abilities/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AbilityResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateAbility",
			method: "PATCH",
			path: "/api/v1/abilities/{id}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateAbilityDto",
			},
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AbilityResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteAbility",
			method: "DELETE",
			path: "/api/v1/abilities/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AbilityResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getRoles",
			method: "GET",
			path: "/api/v1/roles",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/RoleDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createRole",
			method: "POST",
			path: "/api/v1/roles",
			requestSchema: {
				$ref: "#/components/schemas/CreateRoleDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoleDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getRoleById",
			method: "GET",
			path: "/api/v1/roles/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoleDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateRole",
			method: "PATCH",
			path: "/api/v1/roles/{id}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateRoleDto",
			},
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoleDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteRole",
			method: "DELETE",
			path: "/api/v1/roles/{id}",
			parameterSchemas: {
				"path:id": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoleDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getI18nCatalog",
			method: "GET",
			path: "/api/v1/i18n/catalog/{languageCode}",
			parameterSchemas: {
				"path:languageCode": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/I18nCatalogResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getCommunityPosts",
			method: "GET",
			path: "/api/v1/community/posts",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/CommunityPostDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createCommunityPost",
			method: "POST",
			path: "/api/v1/community/posts",
			requestSchema: {
				$ref: "#/components/schemas/CreateCommunityPostPayloadDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/CommunityPostDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getPolicies",
			method: "GET",
			path: "/api/v1/policies",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/PolicyResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createPolicy",
			method: "POST",
			path: "/api/v1/policies",
			requestSchema: {
				$ref: "#/components/schemas/CreatePolicyDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/PolicyResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getPolicyById",
			method: "GET",
			path: "/api/v1/policies/{policyId}",
			parameterSchemas: {
				"path:policyId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/PolicyResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updatePolicy",
			method: "PATCH",
			path: "/api/v1/policies/{policyId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdatePolicyDto",
			},
			parameterSchemas: {
				"path:policyId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/PolicyResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deletePolicy",
			method: "DELETE",
			path: "/api/v1/policies/{policyId}",
			parameterSchemas: {
				"path:policyId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/PolicyResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "syncPolicyEntries",
			method: "PUT",
			path: "/api/v1/policies/{policyId}/entries",
			requestSchema: {
				$ref: "#/components/schemas/SyncPolicyEntriesDto",
			},
			parameterSchemas: {
				"path:policyId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/PolicyEntryResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getRoleAssignments",
			method: "GET",
			path: "/api/v1/roles/{roleId}/assignments",
			parameterSchemas: {
				"path:roleId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/RoleAssignmentResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "syncRoleAssignments",
			method: "PUT",
			path: "/api/v1/roles/{roleId}/assignments",
			requestSchema: {
				$ref: "#/components/schemas/SyncRoleAssignmentsDto",
			},
			parameterSchemas: {
				"path:roleId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/RoleAssignmentResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getFolders",
			method: "GET",
			path: "/api/v1/folders",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:parentFolderId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:spaceId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:name": {
					type: "string",
				},
				"query:statusFilter": {
					$ref: "#/components/schemas/DeleteFilter",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/FolderDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createFolder",
			method: "POST",
			path: "/api/v1/folders",
			requestSchema: {
				$ref: "#/components/schemas/CreateFolderDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/FolderDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateFolder",
			method: "PATCH",
			path: "/api/v1/folders/{folderId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateFolderDto",
			},
			parameterSchemas: {
				"path:folderId": {
					format: "int64",
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/FolderDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteFolder",
			method: "DELETE",
			path: "/api/v1/folders/{folderId}",
			parameterSchemas: {
				"path:folderId": {
					format: "int64",
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getTemplates",
			method: "GET",
			path: "/api/v1/templates",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:type": {
					$ref: "#/components/schemas/TemplateType",
				},
				"query:isActive": {
					type: "boolean",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TemplateDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createTemplate",
			method: "POST",
			path: "/api/v1/templates",
			requestSchema: {
				$ref: "#/components/schemas/CreateTemplateDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TemplateDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTemplate",
			method: "GET",
			path: "/api/v1/templates/{templateId}",
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TemplateDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateTemplate",
			method: "PATCH",
			path: "/api/v1/templates/{templateId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateTemplateDto",
			},
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TemplateDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteTemplate",
			method: "DELETE",
			path: "/api/v1/templates/{templateId}",
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "toggleTemplateStatus",
			method: "PATCH",
			path: "/api/v1/templates/{templateId}/toggle-status",
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TemplateDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "previewTemplate",
			method: "POST",
			path: "/api/v1/templates/{templateId}/preview",
			requestSchema: {
				$ref: "#/components/schemas/PreviewTemplateDto",
			},
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "sendTestTemplate",
			method: "POST",
			path: "/api/v1/templates/{templateId}/send-test",
			requestSchema: {
				$ref: "#/components/schemas/SendTestTemplateDto",
			},
			parameterSchemas: {
				"path:templateId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getServiceDocuments",
			method: "GET",
			path: "/api/v1/service-documents",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:kind": {
					$ref: "#/components/schemas/ServiceDocumentKind",
				},
				"query:platform": {
					$ref: "#/components/schemas/ServiceDocumentPlatform",
				},
				"query:status": {
					$ref: "#/components/schemas/ServiceDocumentStatus",
				},
				"query:locale": {
					type: "string",
				},
				"query:isRequired": {
					type: "boolean",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/ServiceDocumentDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createServiceDocument",
			method: "POST",
			path: "/api/v1/service-documents",
			requestSchema: {
				$ref: "#/components/schemas/CreateServiceDocumentDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ServiceDocumentDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateServiceDocument",
			method: "PATCH",
			path: "/api/v1/service-documents/{serviceDocumentId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateServiceDocumentDto",
			},
			parameterSchemas: {
				"path:serviceDocumentId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ServiceDocumentDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteServiceDocument",
			method: "DELETE",
			path: "/api/v1/service-documents/{serviceDocumentId}",
			parameterSchemas: {
				"path:serviceDocumentId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "publishServiceDocument",
			method: "PATCH",
			path: "/api/v1/service-documents/{serviceDocumentId}/publish",
			parameterSchemas: {
				"path:serviceDocumentId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ServiceDocumentDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "archiveServiceDocument",
			method: "PATCH",
			path: "/api/v1/service-documents/{serviceDocumentId}/archive",
			parameterSchemas: {
				"path:serviceDocumentId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ServiceDocumentDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTranslations",
			method: "GET",
			path: "/api/v1/translations",
			parameterSchemas: {
				"query:languageCode": {
					example: "ko_KR",
					type: "string",
					enum: ["ko_KR", "en_US", "zh_CN", "ja_JP"],
				},
				"query:category": {
					example: "공통",
					type: "string",
				},
				"query:isTranslated": {
					type: "boolean",
				},
				"query:key": {
					example: "성공",
					type: "string",
				},
				"query:page": {
					minimum: 1,
					default: 1,
					type: "number",
				},
				"query:limit": {
					minimum: 1,
					maximum: 100,
					default: 20,
					type: "number",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TranslationResponseDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createTranslation",
			method: "POST",
			path: "/api/v1/translations",
			requestSchema: {
				$ref: "#/components/schemas/CreateTranslationDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TranslationResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateTranslation",
			method: "PATCH",
			path: "/api/v1/translations/{translationId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateTranslationDto",
			},
			parameterSchemas: {
				"path:translationId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TranslationResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteTranslation",
			method: "DELETE",
			path: "/api/v1/translations/{translationId}",
			parameterSchemas: {
				"path:translationId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "invalidateAllTranslationCache",
			method: "DELETE",
			path: "/api/v1/translations/cache",
			parameterSchemas: {},
			responseSchemas: {},
		},
		{
			operationId: "invalidateTranslationCache",
			method: "DELETE",
			path: "/api/v1/translations/cache/{languageCode}",
			parameterSchemas: {
				"path:languageCode": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getTimelines",
			method: "GET",
			path: "/api/v1/timelines",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:timelineId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					nullable: true,
					default: null,
					type: "string",
				},
				"query:search": {
					nullable: true,
					default: null,
					type: "string",
				},
				"query:contentLanguageCode": {
					$ref: "#/components/schemas/LanguageCode",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TimelineDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createTimeline",
			method: "POST",
			path: "/api/v1/timelines",
			requestSchema: {
				$ref: "#/components/schemas/CreateTimelineDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TimelineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTimelineById",
			method: "GET",
			path: "/api/v1/timelines/{timelineId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TimelineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateTimeline",
			method: "PATCH",
			path: "/api/v1/timelines/{timelineId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateTimelineDto",
			},
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TimelineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteTimeline",
			method: "DELETE",
			path: "/api/v1/timelines/{timelineId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getSessions",
			method: "GET",
			path: "/api/v1/timelines/{timelineId}/sessions",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SessionDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createSession",
			method: "POST",
			path: "/api/v1/timelines/{timelineId}/sessions",
			requestSchema: {
				$ref: "#/components/schemas/CreateSessionDto",
			},
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SessionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSessionById",
			method: "GET",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SessionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateSession",
			method: "PATCH",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateSessionDto",
			},
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SessionDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteSession",
			method: "DELETE",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getPrograms",
			method: "GET",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}/programs",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/ProgramDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createProgram",
			method: "POST",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}/programs",
			requestSchema: {
				$ref: "#/components/schemas/CreateProgramDto",
			},
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ProgramDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getProgramById",
			method: "GET",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}/programs/{programId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:programId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ProgramDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateProgram",
			method: "PATCH",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}/programs/{programId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateProgramDto",
			},
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:programId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ProgramDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteProgram",
			method: "DELETE",
			path: "/api/v1/timelines/{timelineId}/sessions/{sessionId}/programs/{programId}",
			parameterSchemas: {
				"path:timelineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:sessionId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
				"path:programId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getTasks",
			method: "GET",
			path: "/api/v1/tasks",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:spaceScope": {
					$ref: "#/components/schemas/SpaceScope",
				},
				"query:contentLanguageCode": {
					$ref: "#/components/schemas/LanguageCode",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TaskDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createTask",
			method: "POST",
			path: "/api/v1/tasks",
			requestSchema: {
				$ref: "#/components/schemas/CreateExerciseDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TaskDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTaskExercise",
			method: "GET",
			path: "/api/v1/tasks/{taskId}/exercise",
			parameterSchemas: {
				"path:taskId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ExerciseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateTaskExercise",
			method: "PATCH",
			path: "/api/v1/tasks/{taskId}/exercise",
			requestSchema: {
				$ref: "#/components/schemas/UpdateExerciseDto",
			},
			parameterSchemas: {
				"path:taskId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TaskDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTaskRoutines",
			method: "GET",
			path: "/api/v1/tasks/{taskId}/routines",
			parameterSchemas: {
				"path:taskId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/RoutineDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteTask",
			method: "DELETE",
			path: "/api/v1/tasks/{taskId}",
			parameterSchemas: {
				"path:taskId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getRoutines",
			method: "GET",
			path: "/api/v1/routines",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:spaceScope": {
					$ref: "#/components/schemas/SpaceScope",
				},
				"query:contentLanguageCode": {
					$ref: "#/components/schemas/LanguageCode",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/RoutineDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createRoutine",
			method: "POST",
			path: "/api/v1/routines",
			requestSchema: {
				$ref: "#/components/schemas/CreateRoutineDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoutineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getRoutine",
			method: "GET",
			path: "/api/v1/routines/{routineId}",
			parameterSchemas: {
				"path:routineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoutineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateRoutine",
			method: "PATCH",
			path: "/api/v1/routines/{routineId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateRoutineDto",
			},
			parameterSchemas: {
				"path:routineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/RoutineDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteRoutine",
			method: "DELETE",
			path: "/api/v1/routines/{routineId}",
			parameterSchemas: {
				"path:routineId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getInquiries",
			method: "GET",
			path: "/api/v1/inquiries",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:category": {
					$ref: "#/components/schemas/InquiryCategory",
				},
				"query:channel": {
					$ref: "#/components/schemas/InquiryChannel",
				},
				"query:priority": {
					$ref: "#/components/schemas/InquiryPriority",
				},
				"query:inquiryStatus": {
					$ref: "#/components/schemas/InquiryStatus",
				},
				"query:status": {
					$ref: "#/components/schemas/DeleteFilter",
				},
				"query:assigneeId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:customerId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:startDate": {
					format: "date-time",
					type: "string",
				},
				"query:endDate": {
					format: "date-time",
					type: "string",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/InquiryDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/InquiryPaginationMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createInquiry",
			method: "POST",
			path: "/api/v1/inquiries",
			requestSchema: {
				$ref: "#/components/schemas/CreateInquiryDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getInquiryStats",
			method: "GET",
			path: "/api/v1/inquiries/stats",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryStatsDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getCreateInquiryForm",
			method: "GET",
			path: "/api/v1/inquiries/form/create",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryCreateUpdateFormBootstrapDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getUpdateInquiryForm",
			method: "GET",
			path: "/api/v1/inquiries/{inquiryId}/form/update",
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryCreateUpdateFormBootstrapDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getInquiryById",
			method: "GET",
			path: "/api/v1/inquiries/{inquiryId}",
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDetailDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateInquiry",
			method: "PATCH",
			path: "/api/v1/inquiries/{inquiryId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateInquiryDto",
			},
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteInquiry",
			method: "DELETE",
			path: "/api/v1/inquiries/{inquiryId}",
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "assignInquiry",
			method: "PATCH",
			path: "/api/v1/inquiries/{inquiryId}/assign",
			requestSchema: {
				type: "object",
				properties: {
					assigneeId: {
						type: "string",
						description: "담당자 ID (canonical decimal BIGINT string)",
					},
				},
				required: ["assigneeId"],
			},
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateInquiryStatus",
			method: "PATCH",
			path: "/api/v1/inquiries/{inquiryId}/status",
			requestSchema: {
				type: "object",
				properties: {
					status: {
						type: "string",
						enum: [
							"NEW",
							"OPEN",
							"IN_PROGRESS",
							"WAITING_CUSTOMER",
							"RESOLVED",
							"CLOSED",
							"ESCALATED",
						],
						description: "변경할 상태",
					},
				},
				required: ["status"],
			},
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateInquiryPriority",
			method: "PATCH",
			path: "/api/v1/inquiries/{inquiryId}/priority",
			requestSchema: {
				type: "object",
				properties: {
					priority: {
						type: "string",
						enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
						description: "변경할 우선순위",
					},
				},
				required: ["priority"],
			},
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/InquiryDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getInquiryMessages",
			method: "GET",
			path: "/api/v1/inquiries/{inquiryId}/messages",
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/InquiryMessageDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/InquiryMessagePaginationMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getInquiryParticipants",
			method: "GET",
			path: "/api/v1/inquiries/{inquiryId}/participants",
			parameterSchemas: {
				"path:inquiryId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/InquiryParticipant",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTenantAccessRequests",
			method: "GET",
			path: "/api/v1/tenant-access-requests",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:status": {
					$ref: "#/components/schemas/TenantAccessRequestStatus",
				},
				"query:spaceId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:requesterId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:createdFrom": {
					format: "date-time",
					type: "string",
				},
				"query:createdTo": {
					format: "date-time",
					type: "string",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TenantAccessRequestDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/TenantAccessRequestPaginationMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getTenantAccessRequest",
			method: "GET",
			path: "/api/v1/tenant-access-requests/{tenantAccessRequestId}",
			parameterSchemas: {
				"path:tenantAccessRequestId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TenantAccessRequestDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "approveTenantAccessRequest",
			method: "POST",
			path: "/api/v1/tenant-access-requests/{tenantAccessRequestId}/approve",
			requestSchema: {
				$ref: "#/components/schemas/ReviewTenantAccessRequestDto",
			},
			parameterSchemas: {
				"path:tenantAccessRequestId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TenantAccessRequestDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "rejectTenantAccessRequest",
			method: "POST",
			path: "/api/v1/tenant-access-requests/{tenantAccessRequestId}/reject",
			requestSchema: {
				$ref: "#/components/schemas/ReviewTenantAccessRequestDto",
			},
			parameterSchemas: {
				"path:tenantAccessRequestId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TenantAccessRequestDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getReservationBookingFeed",
			method: "GET",
			path: "/api/v1/reservations/booking-feed",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:dateFrom": {
					format: "date-time",
					type: "string",
				},
				"query:dateTo": {
					format: "date-time",
					type: "string",
				},
				"query:timeZone": {
					default: "Asia/Seoul",
					type: "string",
				},
				"query:timelineId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:programId": {
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					type: "string",
				},
				"query:search": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/BookingFeedItemDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createReservation",
			method: "POST",
			path: "/api/v1/reservations",
			requestSchema: {
				$ref: "#/components/schemas/CreateReservationDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/ReservationDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getMyReservations",
			method: "GET",
			path: "/api/v1/reservations/me",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:from": {
					format: "date-time",
					type: "string",
				},
				"query:to": {
					format: "date-time",
					type: "string",
				},
				"query:status": {
					$ref: "#/components/schemas/ReservationStatus",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/ReservationDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "login",
			method: "GET",
			path: "/api/v1/auth/oidc/login",
			parameterSchemas: {
				"query:clientId": {
					type: "string",
				},
				"query:returnTo": {
					type: "string",
				},
				"query:prompt": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "oidcCallback",
			method: "GET",
			path: "/api/v1/auth/callback",
			parameterSchemas: {
				"query:clientId": {
					type: "string",
				},
				"query:code": {
					type: "string",
				},
				"query:state": {
					type: "string",
				},
				"query:error": {
					type: "string",
				},
				"query:error_description": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "nativeLogin",
			method: "POST",
			path: "/api/v1/auth/login",
			requestSchema: {
				$ref: "#/components/schemas/NativeLoginPayloadDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/NativeAuthResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "nativeRefreshToken",
			method: "POST",
			path: "/api/v1/auth/native/token/refresh",
			requestSchema: {
				$ref: "#/components/schemas/NativeTokenRefreshPayloadDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/NativeAuthResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "nativeLogout",
			method: "POST",
			path: "/api/v1/auth/native/logout",
			requestSchema: {
				$ref: "#/components/schemas/NativeLogoutPayloadDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "boolean",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "refreshToken",
			method: "POST",
			path: "/api/v1/auth/token/refresh",
			parameterSchemas: {
				"header:x-refresh-token": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/TokenRefreshResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getSignUpSpaces",
			method: "GET",
			path: "/api/v1/auth/sign-up/spaces",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SpaceDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "signUp",
			method: "POST",
			path: "/api/v1/auth/sign-up",
			requestSchema: {
				$ref: "#/components/schemas/SignUpPayloadDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/EmailVerificationRequestedDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "confirmEmailVerification",
			method: "GET",
			path: "/api/v1/auth/email-verifications/{token}/confirm",
			parameterSchemas: {
				"path:token": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "verifyToken",
			method: "GET",
			path: "/api/v1/auth/verify-token",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/VerifyTokenResponseDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getMySpaces",
			method: "GET",
			path: "/api/v1/auth/my-spaces",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/SpaceDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getCurrentSpace",
			method: "GET",
			path: "/api/v1/auth/current-space",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SpaceDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "setCurrentSpace",
			method: "POST",
			path: "/api/v1/auth/current-space",
			requestSchema: {
				$ref: "#/components/schemas/SetCurrentSpaceDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SpaceDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "logout",
			method: "POST",
			path: "/api/v1/auth/logout",
			parameterSchemas: {},
			responseSchemas: {},
		},
		{
			operationId: "getAuthAuditLogs",
			method: "GET",
			path: "/api/v1/auth/audit-logs",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:email": {
					type: "string",
				},
				"query:result": {
					$ref: "#/components/schemas/AuthAuditResult",
				},
				"query:ipAddress": {
					type: "string",
				},
				"query:clientId": {
					type: "string",
				},
				"query:startDate": {
					format: "date-time",
					type: "string",
				},
				"query:endDate": {
					format: "date-time",
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/AuthAuditLogDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/PageMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getAuthAuditLogStats",
			method: "GET",
			path: "/api/v1/auth/audit-logs/stats",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/AuditLogStatsDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "unlockAccount",
			method: "POST",
			path: "/api/v1/auth/users/{userId}/unlock",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "boolean",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "forceResetPassword",
			method: "POST",
			path: "/api/v1/auth/users/{userId}/force-reset-password",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "boolean",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "invalidateUserSessions",
			method: "POST",
			path: "/api/v1/auth/users/{userId}/invalidate-sessions",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "boolean",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getOidcClients",
			method: "GET",
			path: "/api/v1/oidc-clients",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:isActive": {
					type: "boolean",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/OidcClientDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/PageMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "createOidcClient",
			method: "POST",
			path: "/api/v1/oidc-clients",
			requestSchema: {
				$ref: "#/components/schemas/CreateOidcClientDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"201": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 201,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/OidcClientDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getOidcClient",
			method: "GET",
			path: "/api/v1/oidc-clients/{oidcClientId}",
			parameterSchemas: {
				"path:oidcClientId": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/OidcClientDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateOidcClient",
			method: "PATCH",
			path: "/api/v1/oidc-clients/{oidcClientId}",
			requestSchema: {
				$ref: "#/components/schemas/UpdateOidcClientDto",
			},
			parameterSchemas: {
				"path:oidcClientId": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/OidcClientDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "deleteOidcClient",
			method: "DELETE",
			path: "/api/v1/oidc-clients/{oidcClientId}",
			parameterSchemas: {
				"path:oidcClientId": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "toggleActiveOidcClient",
			method: "PATCH",
			path: "/api/v1/oidc-clients/{oidcClientId}/toggle-active",
			parameterSchemas: {
				"path:oidcClientId": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/OidcClientDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getInteraction",
			method: "GET",
			path: "/api/interaction/{uid}",
			parameterSchemas: {
				"path:uid": {
					example: "abc123xyz",
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/InteractionDataDto",
				},
			},
		},
		{
			operationId: "submitLogin",
			method: "POST",
			path: "/api/interaction/{uid}/login",
			requestSchema: {
				$ref: "#/components/schemas/OidcLoginPayloadDto",
			},
			parameterSchemas: {
				"path:uid": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/LoginSuccessDto",
				},
				"401": {
					$ref: "#/components/schemas/LoginErrorDto",
				},
			},
		},
		{
			operationId: "confirmConsent",
			method: "POST",
			path: "/api/interaction/{uid}/confirm",
			parameterSchemas: {
				"path:uid": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/ConsentResultDto",
				},
			},
		},
		{
			operationId: "abortInteraction",
			method: "POST",
			path: "/api/interaction/{uid}/abort",
			parameterSchemas: {
				"path:uid": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/AbortResultDto",
				},
			},
		},
		{
			operationId: "getPasswordPolicy",
			method: "GET",
			path: "/api/password-policy",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/PasswordPolicyDto",
				},
			},
		},
		{
			operationId: "requestPasswordReset",
			method: "POST",
			path: "/api/forgot-password",
			requestSchema: {
				type: "object",
				required: ["email"],
				properties: {
					email: {
						type: "string",
						format: "email",
						example: "user@example.com",
					},
				},
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/ForgotPasswordResultDto",
				},
			},
		},
		{
			operationId: "validateResetToken",
			method: "GET",
			path: "/api/reset-password/{token}",
			parameterSchemas: {
				"path:token": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/TokenValidationDto",
				},
			},
		},
		{
			operationId: "executePasswordReset",
			method: "POST",
			path: "/api/reset-password/{token}",
			requestSchema: {
				type: "object",
				required: ["password", "confirmPassword"],
				properties: {
					password: {
						type: "string",
						example: "NewPassword1!@",
					},
					confirmPassword: {
						type: "string",
						example: "NewPassword1!@",
					},
				},
			},
			parameterSchemas: {
				"path:token": {
					type: "string",
				},
			},
			responseSchemas: {
				"200": {
					$ref: "#/components/schemas/ResetPasswordResultDto",
				},
				"400": {
					$ref: "#/components/schemas/ResetPasswordErrorDto",
				},
			},
		},
		{
			operationId: "getOidcSessions",
			method: "GET",
			path: "/api/v1/oidc-sessions",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:modelType": {
					type: "string",
				},
				"query:accountId": {
					type: "string",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/OidcSessionDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/PageMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getOidcSessionStats",
			method: "GET",
			path: "/api/v1/oidc-sessions/stats",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/OidcSessionStatsDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "revokeOidcSession",
			method: "POST",
			path: "/api/v1/oidc-sessions/{key}/revoke",
			parameterSchemas: {
				"path:key": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "revokeAllOidcSessions",
			method: "POST",
			path: "/api/v1/oidc-sessions/revoke-all",
			parameterSchemas: {},
			responseSchemas: {},
		},
		{
			operationId: "revokeOidcSessionsByGrant",
			method: "POST",
			path: "/api/v1/oidc-sessions/revoke-by-grant/{grantId}",
			parameterSchemas: {
				"path:grantId": {
					type: "string",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getSecurityPolicy",
			method: "GET",
			path: "/api/v1/idp/security-policy",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SecurityPolicyDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "updateSecurityPolicy",
			method: "PATCH",
			path: "/api/v1/idp/security-policy",
			requestSchema: {
				$ref: "#/components/schemas/UpdateSecurityPolicyDto",
			},
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/SecurityPolicyDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getIdpAccounts",
			method: "GET",
			path: "/api/v1/idp/accounts",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:search": {
					type: "string",
				},
				"query:isActive": {
					type: "boolean",
				},
				"query:isLocked": {
					type: "boolean",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/IdpAccountDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/PageMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getIdpAccount",
			method: "GET",
			path: "/api/v1/idp/accounts/{userId}",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/IdpAccountDetailDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getIdpAccountAccessGrantForm",
			method: "GET",
			path: "/api/v1/idp/accounts/{userId}/access-grant-form",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/IdpAccountAccessGrantFormBootstrapDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "grantIdpAccountAccess",
			method: "POST",
			path: "/api/v1/idp/accounts/{userId}/access-grants",
			requestSchema: {
				$ref: "#/components/schemas/GrantIdpAccountAccessDto",
			},
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/IdpAccountDetailDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "toggleIdpAccountActive",
			method: "PATCH",
			path: "/api/v1/idp/accounts/{userId}/toggle-active",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/IdpAccountDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "resetIdpAccountFailedAttempts",
			method: "POST",
			path: "/api/v1/idp/accounts/{userId}/reset-failed-attempts",
			parameterSchemas: {
				"path:userId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {},
		},
		{
			operationId: "getIdpDashboardStats",
			method: "GET",
			path: "/api/v1/idp/dashboard/stats",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/DashboardStatsDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getIdpLoginTrend",
			method: "GET",
			path: "/api/v1/idp/dashboard/login-trend",
			parameterSchemas: {},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/LoginTrendItemDto",
									},
								},
								meta: {
									type: "object",
									properties: {
										total: {
											type: "number",
											description: "전체 항목 수",
										},
										page: {
											type: "number",
											description: "현재 페이지",
										},
										limit: {
											type: "number",
											description: "페이지당 항목 수",
										},
										totalPages: {
											type: "number",
											description: "전체 페이지 수",
										},
									},
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "getEmailVerifications",
			method: "GET",
			path: "/api/v1/idp/email-verifications",
			parameterSchemas: {
				"query:skip": {
					minimum: 0,
					type: "number",
				},
				"query:take": {
					minimum: 1,
					maximum: 200,
					type: "number",
				},
				"query:email": {
					type: "string",
				},
				"query:status": {
					$ref: "#/components/schemas/EmailVerificationStatus",
				},
				"query:startDate": {
					format: "date-time",
					type: "string",
				},
				"query:endDate": {
					format: "date-time",
					type: "string",
				},
				"query:sort": {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									type: "array",
									items: {
										$ref: "#/components/schemas/EmailVerificationDto",
									},
								},
								meta: {
									$ref: "#/components/schemas/PageMetaDto",
								},
							},
						},
					],
				},
			},
		},
		{
			operationId: "resendEmailVerification",
			method: "POST",
			path: "/api/v1/idp/email-verifications/{emailVerificationId}/resend",
			parameterSchemas: {
				"path:emailVerificationId": {
					type: "string",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
				},
			},
			responseSchemas: {
				"200": {
					allOf: [
						{
							properties: {
								httpStatus: {
									type: "number",
									nullable: false,
									example: 200,
								},
								message: {
									type: "string",
									nullable: false,
								},
								data: {
									$ref: "#/components/schemas/EmailVerificationDto",
									nullable: true,
								},
							},
						},
					],
				},
			},
		},
	],
	schemas: {
		LanguageCode: {
			type: "string",
			enum: ["ko_KR", "en_US", "zh_CN", "ja_JP"],
			description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		},
		CategoryDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					format: "int64",
				},
				name: {
					type: "string",
					default: "",
				},
				parentId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					default: null,
					format: "int64",
				},
				parent: {
					$ref: "#/components/schemas/CategoryDto",
				},
				children: {
					each: true,
					allOf: [
						{
							$ref: "#/components/schemas/CategoryDto",
						},
					],
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"name",
				"parentId",
			],
		},
		SpaceAssociationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				groupId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"groupId",
			],
		},
		CompanyDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
				},
				label: {
					type: "string",
					nullable: true,
				},
				address: {
					type: "string",
				},
				phone: {
					type: "string",
				},
				email: {
					type: "string",
				},
				businessNo: {
					type: "string",
				},
				logoImageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				fitnessCenters: {
					each: true,
					type: "array",
					items: {
						$ref: "#/components/schemas/FitnessCenterDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"name",
				"address",
				"phone",
				"email",
				"businessNo",
			],
		},
		FitnessCenterSpaceDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				contentLanguageCode: {
					allOf: [
						{
							$ref: "#/components/schemas/LanguageCode",
						},
					],
				},
			},
			required: ["id", "contentLanguageCode"],
		},
		FitnessCenterDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
				},
				label: {
					type: "string",
					nullable: true,
				},
				address: {
					type: "string",
				},
				phone: {
					type: "string",
				},
				email: {
					type: "string",
				},
				companyId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				company: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/CompanyDto",
						},
					],
				},
				space: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/FitnessCenterSpaceDto",
						},
					],
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"name",
				"address",
				"phone",
				"email",
				"companyId",
				"spaceId",
			],
		},
		SpaceDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				tenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "이 Space 접근에 사용할 Tenant ID",
					nullable: true,
					format: "int64",
				},
				contentLanguageCode: {
					description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
					default: "ko_KR",
					allOf: [
						{
							$ref: "#/components/schemas/LanguageCode",
						},
					],
				},
				spaceClassification: {
					$ref: "#/components/schemas/SpaceClassificationDto",
				},
				spaceAssociations: {
					each: true,
					type: "array",
					items: {
						$ref: "#/components/schemas/SpaceAssociationDto",
					},
				},
				fitnessCenter: {
					$ref: "#/components/schemas/FitnessCenterDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"contentLanguageCode",
			],
		},
		SpaceClassificationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				categoryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				category: {
					$ref: "#/components/schemas/CategoryDto",
				},
				space: {
					$ref: "#/components/schemas/SpaceDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"categoryId",
			],
		},
		CreateSpaceWithFitnessCenterDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				label: {
					type: "string",
					nullable: true,
				},
				address: {
					type: "string",
				},
				phone: {
					type: "string",
				},
				email: {
					type: "string",
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				space: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/FitnessCenterSpaceDto",
						},
					],
				},
				contentLanguageCode: {
					description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
					default: "ko_KR",
					allOf: [
						{
							$ref: "#/components/schemas/LanguageCode",
						},
					],
				},
				businessNo: {
					type: "string",
				},
				logoImageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
			},
			required: [
				"name",
				"address",
				"phone",
				"email",
				"contentLanguageCode",
				"businessNo",
			],
		},
		UpdateFitnessCenterDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				label: {
					type: "string",
					nullable: true,
				},
				address: {
					type: "string",
				},
				phone: {
					type: "string",
				},
				email: {
					type: "string",
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				contentLanguageCode: {
					allOf: [
						{
							$ref: "#/components/schemas/LanguageCode",
						},
					],
				},
			},
		},
		RoleClassificationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				categoryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				category: {
					$ref: "#/components/schemas/CategoryDto",
				},
				role: {
					$ref: "#/components/schemas/RoleDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"roleId",
				"categoryId",
			],
		},
		RoleAssociationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				groupId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"roleId",
				"groupId",
			],
		},
		ActionConfigDto: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "설정 유형 (masking, format, transform)",
					example: "masking",
				},
				preset: {
					type: "string",
					description: "마스킹 프리셋 (PRESET_EMAIL, PRESET_PHONE 등)",
					example: "PRESET_EMAIL",
				},
				pattern: {
					type: "string",
					description: "커스텀 패턴 (정규식)",
					example: "^(.{3}).*(.{2})$",
				},
				replacement: {
					type: "string",
					description: "치환 문자열",
					example: "$1***$2",
				},
				rule: {
					type: "string",
					description: "변환 규칙",
					example: "uppercase",
				},
			},
			required: ["type"],
		},
		ActionResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Action ID",
					format: "int64",
				},
				name: {
					type: "string",
					description: "Action 이름 (create, read, read:masked:email 등)",
					example: "read:masked:email",
				},
				displayName: {
					type: "string",
					description: "표시명",
					example: "이메일 마스킹 조회",
					nullable: true,
				},
				description: {
					type: "string",
					description: "설명",
					example: "이메일을 마스킹하여 조회합니다",
					nullable: true,
				},
				group: {
					type: "string",
					description: "그룹 (crud, visibility, bulk, workflow)",
					example: "visibility",
					nullable: true,
				},
				order: {
					type: "number",
					description: "정렬 순서",
					example: 10,
				},
				config: {
					description: "Action 설정 (마스킹, 포맷팅 등)",
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/ActionConfigDto",
						},
					],
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성 일시",
					example: "2025-01-01T00:00:00.000Z",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정 일시",
					example: "2025-01-01T00:00:00.000Z",
					nullable: true,
				},
			},
			required: [
				"id",
				"name",
				"displayName",
				"description",
				"group",
				"order",
				"config",
				"createdAt",
				"updatedAt",
			],
		},
		SubjectResponseDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Subject 이름 (Prisma 모델명)",
					example: "User",
				},
				displayName: {
					type: "string",
					description: "Subject 표시명 (@displayName 주석)",
					example: "사용자",
					nullable: true,
				},
				fieldCount: {
					type: "number",
					description: "필드 수",
					example: 10,
				},
			},
			required: ["name", "displayName", "fieldCount"],
		},
		AbilityResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Ability ID",
					format: "int64",
				},
				actionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Action ID",
					format: "int64",
				},
				action: {
					description: "Action 상세 정보",
					allOf: [
						{
							$ref: "#/components/schemas/ActionResponseDto",
						},
					],
				},
				subjectId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Subject ID",
					format: "int64",
				},
				subject: {
					description: "Subject 상세 정보",
					allOf: [
						{
							$ref: "#/components/schemas/SubjectResponseDto",
						},
					],
				},
				fields: {
					description: "대상 필드 목록",
					example: ["email", "name"],
					type: "array",
					items: {
						type: "string",
					},
				},
				conditions: {
					type: "object",
					description: "권한 조건 (JSON 형식)",
					example: {
						id: "${user.id}",
					},
					nullable: true,
				},
				inverted: {
					type: "boolean",
					description: "거부 권한 여부 (true: cannot, false: can)",
					example: false,
				},
				reason: {
					type: "string",
					description: "거부 사유",
					example: "관리자만 삭제할 수 있습니다",
					nullable: true,
				},
				name: {
					type: "string",
					description: "권한 이름 (고유 식별자)",
					example: "Read User Email Masked",
				},
				description: {
					type: "string",
					description: "권한 설명",
					example: "사용자 이메일을 마스킹하여 조회합니다",
					nullable: true,
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성 일시",
					example: "2025-01-01T00:00:00.000Z",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정 일시",
					example: "2025-01-01T00:00:00.000Z",
					nullable: true,
				},
			},
			required: [
				"id",
				"actionId",
				"subjectId",
				"fields",
				"conditions",
				"inverted",
				"reason",
				"name",
				"description",
				"createdAt",
				"updatedAt",
			],
		},
		PolicyEntryResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "PolicyEntry ID",
					format: "int64",
				},
				policyId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Policy ID",
					format: "int64",
				},
				abilityId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Ability ID",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성 일시",
					example: "2026-01-01T00:00:00.000Z",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					description: "삭제 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				ability: {
					description: "연결된 Ability 상세 정보",
					allOf: [
						{
							$ref: "#/components/schemas/AbilityResponseDto",
						},
					],
				},
			},
			required: [
				"id",
				"policyId",
				"abilityId",
				"createdAt",
				"updatedAt",
				"removedAt",
			],
		},
		PolicyResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Policy ID",
					format: "int64",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Space ID",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				name: {
					type: "string",
					description: "정책 식별자",
					example: "space-admin",
				},
				displayName: {
					type: "string",
					description: "정책 표시명",
					example: "워크스페이스 관리자 정책",
					nullable: true,
				},
				description: {
					type: "string",
					description: "정책 설명",
					example: "워크스페이스 관리자가 기본으로 갖는 권한 묶음입니다.",
					nullable: true,
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성 일시",
					example: "2026-01-01T00:00:00.000Z",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					description: "삭제 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				entries: {
					description: "정책에 연결된 Ability 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/PolicyEntryResponseDto",
					},
				},
			},
			required: [
				"id",
				"spaceId",
				"createdById",
				"name",
				"displayName",
				"description",
				"createdAt",
				"updatedAt",
				"removedAt",
			],
		},
		RoleAssignmentResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Role assignment ID",
					format: "int64",
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Role ID",
					format: "int64",
				},
				policyId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Policy ID",
					format: "int64",
				},
				isActive: {
					type: "boolean",
					description: "활성화 여부",
					example: true,
				},
				priority: {
					type: "number",
					description: "우선순위 (높을수록 우선)",
					example: 0,
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성 일시",
					example: "2026-01-01T00:00:00.000Z",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					description: "삭제 일시",
					example: "2026-01-01T00:00:00.000Z",
					nullable: true,
				},
				policy: {
					description: "할당된 Policy 상세 정보",
					allOf: [
						{
							$ref: "#/components/schemas/PolicyResponseDto",
						},
					],
				},
			},
			required: [
				"id",
				"roleId",
				"policyId",
				"isActive",
				"priority",
				"createdAt",
				"updatedAt",
				"removedAt",
			],
		},
		RoleDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
					description: "역할 식별자",
					maxLength: 50,
					pattern: "^[A-Z][A-Z0-9_]*$",
					message:
						"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
				},
				displayName: {
					type: "string",
					nullable: true,
					description: "표시명",
					maxLength: 50,
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
					maxLength: 200,
				},
				classification: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RoleClassificationDto",
						},
					],
				},
				associations: {
					nullable: true,
					type: "array",
					items: {
						$ref: "#/components/schemas/RoleAssociationDto",
					},
				},
				assignments: {
					description: "역할에 연결된 정책 할당 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/RoleAssignmentResponseDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"name",
				"classification",
				"associations",
			],
		},
		TenantDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				user: {
					$ref: "#/components/schemas/UserDto",
				},
				space: {
					$ref: "#/components/schemas/SpaceDto",
				},
				role: {
					$ref: "#/components/schemas/RoleDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"roleId",
				"userId",
				"spaceId",
			],
		},
		UserAssociationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				groupId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"userId",
				"groupId",
			],
		},
		UserClassificationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				categoryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				user: {
					$ref: "#/components/schemas/UserDto",
				},
				category: {
					$ref: "#/components/schemas/CategoryDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"categoryId",
				"userId",
			],
		},
		UserDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 공간 ID",
					format: "int64",
				},
				email: {
					type: "string",
					toLowerCase: true,
					description: "이메일 주소",
				},
				name: {
					type: "string",
					description: "사용자 이름",
				},
				phone: {
					type: "string",
					description: "연락처",
				},
				failedLoginAttempts: {
					type: "number",
					description: "로그인 실패 횟수",
				},
				lockedUntil: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "잠금 해제 시각",
				},
				isPermanentlyLocked: {
					type: "boolean",
					description: "영구 잠금 여부",
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요",
				},
				passwordChangedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "비밀번호 변경일",
				},
				lastLoginAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 로그인 시각",
				},
				lastLoginIp: {
					type: "string",
					nullable: true,
					description: "마지막 로그인 IP",
				},
				isActive: {
					type: "boolean",
					description: "활성 상태",
				},
				currentTenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "현재 선택된 Tenant membership ID",
					format: "int64",
				},
				profiles: {
					description: "프로필 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/ProfileDto",
					},
				},
				tenants: {
					description: "테넌트 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/TenantDto",
					},
				},
				associations: {
					description: "사용자 연결 정보",
					type: "array",
					items: {
						$ref: "#/components/schemas/UserAssociationDto",
					},
				},
				classification: {
					description: "사용자 분류 정보",
					allOf: [
						{
							$ref: "#/components/schemas/UserClassificationDto",
						},
					],
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"email",
				"name",
				"phone",
				"failedLoginAttempts",
				"lockedUntil",
				"isPermanentlyLocked",
				"mustChangePassword",
				"passwordChangedAt",
				"lastLoginAt",
				"lastLoginIp",
				"isActive",
				"currentTenantId",
			],
		},
		ProfileDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				avatarFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				name: {
					type: "string",
				},
				nickname: {
					type: "string",
				},
				address: {
					type: "string",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				user: {
					$ref: "#/components/schemas/UserDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"avatarFileId",
				"name",
				"nickname",
				"address",
				"userId",
			],
		},
		UserPaginationMetaDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 사용자 수",
				},
				skip: {
					type: "number",
					description: "건너뛴 항목 수 (offset)",
				},
				take: {
					type: "number",
					description: "조회 항목 수",
				},
				totalPages: {
					type: "number",
					description: "전체 페이지 수",
				},
			},
			required: ["total", "skip", "take", "totalPages"],
		},
		UserStatsDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 사용자 수",
				},
				active: {
					type: "number",
					description: "활성 사용자 수 (최근 30일 내 활동)",
				},
				inactive: {
					type: "number",
					description: "비활성 사용자 수 (30일 이상 미활동)",
				},
				newThisMonth: {
					type: "number",
					description: "이번 달 신규 가입자 수",
				},
			},
			required: ["total", "active", "inactive", "newThisMonth"],
		},
		DeleteFilter: {
			type: "string",
			enum: ["active", "deleted"],
		},
		UserDetailResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 공간 ID",
					format: "int64",
				},
				email: {
					type: "string",
					toLowerCase: true,
					description: "이메일 주소",
				},
				name: {
					type: "string",
					description: "사용자 이름",
				},
				phone: {
					type: "string",
					description: "연락처",
				},
				failedLoginAttempts: {
					type: "number",
					description: "로그인 실패 횟수",
				},
				lockedUntil: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "잠금 해제 시각",
				},
				isPermanentlyLocked: {
					type: "boolean",
					description: "영구 잠금 여부",
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요",
				},
				passwordChangedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "비밀번호 변경일",
				},
				lastLoginAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 로그인 시각",
				},
				lastLoginIp: {
					type: "string",
					nullable: true,
					description: "마지막 로그인 IP",
				},
				isActive: {
					type: "boolean",
					description: "활성 상태",
				},
				currentTenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "현재 선택된 Tenant membership ID",
					format: "int64",
				},
				profiles: {
					description: "프로필 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/ProfileDto",
					},
				},
				tenants: {
					description: "테넌트 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/TenantDto",
					},
				},
				associations: {
					description: "사용자 연결 정보",
					type: "array",
					items: {
						$ref: "#/components/schemas/UserAssociationDto",
					},
				},
				classification: {
					description: "사용자 분류 정보",
					allOf: [
						{
							$ref: "#/components/schemas/UserClassificationDto",
						},
					],
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"email",
				"name",
				"phone",
				"failedLoginAttempts",
				"lockedUntil",
				"isPermanentlyLocked",
				"mustChangePassword",
				"passwordChangedAt",
				"lastLoginAt",
				"lastLoginIp",
				"isActive",
				"currentTenantId",
			],
		},
		UserTenantDetailResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				user: {
					$ref: "#/components/schemas/UserDto",
				},
				space: {
					$ref: "#/components/schemas/SpaceDto",
				},
				role: {
					$ref: "#/components/schemas/RoleDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"roleId",
				"userId",
				"spaceId",
			],
		},
		ActionDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
					nullable: true,
				},
				description: {
					type: "string",
					nullable: true,
				},
				group: {
					type: "string",
					nullable: true,
				},
				order: {
					type: "number",
				},
			},
			required: ["id", "createdAt", "updatedAt", "removedAt", "name", "order"],
		},
		CreateActionDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
					nullable: true,
				},
				description: {
					type: "string",
					nullable: true,
				},
				group: {
					type: "string",
					nullable: true,
				},
				order: {
					type: "number",
				},
			},
			required: ["name", "order"],
		},
		UpdateActionDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
					nullable: true,
				},
				description: {
					type: "string",
					nullable: true,
				},
				group: {
					type: "string",
					nullable: true,
				},
				order: {
					type: "number",
				},
			},
		},
		AssetKind: {
			type: "string",
			enum: ["IMAGE", "VIDEO", "DOCUMENT"],
			description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
		},
		AssetStatus: {
			type: "string",
			enum: ["UPLOADING", "READY", "FAILED"],
			description: "에셋 상태 (UPLOADING, READY, FAILED)",
		},
		FolderDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 Space ID",
					format: "int64",
				},
				parentFolderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "부모 폴더 ID (루트면 null)",
					format: "int64",
				},
				name: {
					type: "string",
					description: "폴더명",
				},
				path: {
					type: "string",
					description: "전체 경로 (예: /images/2024)",
				},
				sortOrder: {
					type: "number",
					description: "정렬 순서",
					int: true,
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				parent: {
					description: "부모 폴더",
					allOf: [
						{
							$ref: "#/components/schemas/FolderDto",
						},
					],
				},
				children: {
					description: "하위 폴더 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/FolderDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"name",
				"path",
				"sortOrder",
			],
		},
		DerivativeKind: {
			type: "string",
			enum: ["THUMBNAIL", "PREVIEW", "TRANSCODE", "TEXT"],
			description: "파생 리소스 종류 (THUMBNAIL, PREVIEW, TRANSCODE, TEXT)",
		},
		DerivativeDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 Space ID",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				assetId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "원본 에셋 ID",
					format: "int64",
				},
				kind: {
					description: "파생 리소스 종류 (THUMBNAIL, PREVIEW, TRANSCODE, TEXT)",
					allOf: [
						{
							$ref: "#/components/schemas/DerivativeKind",
						},
					],
				},
				profile: {
					type: "string",
					description: "프로필명 (예: thumbnail-256, preview-1080p)",
				},
				storageKey: {
					type: "string",
					description: "스토리지 저장 키",
				},
				mimeType: {
					type: "string",
					description: "MIME 타입",
				},
				sizeBytes: {
					type: "number",
					description: "파일 크기 (바이트)",
					int: true,
				},
				width: {
					type: "number",
					nullable: true,
					description: "너비 (이미지/비디오)",
					int: true,
				},
				height: {
					type: "number",
					nullable: true,
					description: "높이 (이미지/비디오)",
					int: true,
				},
				durationMs: {
					type: "number",
					nullable: true,
					description: "재생 시간 (밀리초, 비디오)",
					int: true,
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"assetId",
				"kind",
				"profile",
				"storageKey",
				"mimeType",
				"sizeBytes",
			],
		},
		AssetDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 Space ID",
					format: "int64",
				},
				folderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 폴더 ID",
					format: "int64",
				},
				kind: {
					description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
					allOf: [
						{
							$ref: "#/components/schemas/AssetKind",
						},
					],
				},
				status: {
					description: "에셋 상태 (UPLOADING, READY, FAILED)",
					allOf: [
						{
							$ref: "#/components/schemas/AssetStatus",
						},
					],
				},
				originalName: {
					type: "string",
					description: "원본 파일명",
				},
				storageKey: {
					type: "string",
					description: "스토리지 저장 키",
				},
				mimeType: {
					type: "string",
					description: "MIME 타입",
				},
				sizeBytes: {
					type: "number",
					description: "파일 크기 (바이트)",
					int: true,
				},
				extension: {
					type: "string",
					nullable: true,
					description: "파일 확장자",
				},
				checksum: {
					type: "string",
					nullable: true,
					description: "체크섬 (무결성 검증용)",
				},
				metadata: {
					type: "object",
					nullable: true,
					description: "메타데이터 (Exif, 동영상 길이 등)",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				publicUrl: {
					type: "string",
					nullable: true,
					description: "공개 접근 가능한 에셋 URL",
				},
				folder: {
					description: "소속 폴더",
					allOf: [
						{
							$ref: "#/components/schemas/FolderDto",
						},
					],
				},
				derivatives: {
					description: "파생 리소스 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/DerivativeDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"folderId",
				"kind",
				"status",
				"originalName",
				"storageKey",
				"mimeType",
				"sizeBytes",
			],
		},
		MoveAssetDto: {
			type: "object",
			properties: {
				targetFolderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "이동할 대상 폴더 ID",
					format: "int64",
				},
			},
			required: ["targetFolderId"],
		},
		SubjectDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
					nullable: true,
				},
				icon: {
					type: "string",
					nullable: true,
				},
				group: {
					type: "string",
					nullable: true,
				},
				order: {
					type: "number",
				},
			},
			required: ["id", "createdAt", "updatedAt", "removedAt", "name", "order"],
		},
		SubjectFieldDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
				},
				type: {
					type: "string",
				},
				isRequired: {
					type: "boolean",
				},
				isRelation: {
					type: "boolean",
				},
			},
			required: ["name", "type", "isRequired", "isRelation"],
		},
		CreateAbilityDto: {
			type: "object",
			properties: {
				actionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Action ID",
					example: "1",
					format: "int64",
				},
				subjectId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Subject ID",
					example: "1",
					format: "int64",
				},
				fields: {
					description: "대상 필드 목록 (빈 배열이면 전체 필드)",
					example: ["email", "name"],
					default: [],
					type: "array",
					items: {
						type: "string",
					},
				},
				conditions: {
					type: "object",
					description: "권한 조건 (JSON 형식)",
					example: {
						id: "${user.id}",
					},
				},
				inverted: {
					type: "boolean",
					description: "거부 권한 여부 (true: cannot, false: can)",
					example: false,
					default: false,
				},
				reason: {
					type: "string",
					description: "거부 사유 (inverted=true일 때 사용)",
					example: "관리자만 삭제할 수 있습니다",
				},
				name: {
					type: "string",
					description: "권한 이름",
					example: "본인 정보 조회",
				},
				description: {
					type: "string",
					description: "권한 설명",
					example: "자신의 프로필 정보만 조회할 수 있습니다",
				},
			},
			required: ["actionId", "subjectId", "name"],
		},
		UpdateAbilityDto: {
			type: "object",
			properties: {
				actionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Action ID",
					example: "1",
					format: "int64",
				},
				subjectId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Subject ID",
					example: "1",
					format: "int64",
				},
				fields: {
					description: "대상 필드 목록 (빈 배열이면 전체 필드)",
					example: ["email", "name"],
					default: [],
					type: "array",
					items: {
						type: "string",
					},
				},
				conditions: {
					type: "object",
					description: "권한 조건 (JSON 형식)",
					example: {
						id: "${user.id}",
					},
				},
				inverted: {
					type: "boolean",
					description: "거부 권한 여부 (true: cannot, false: can)",
					example: false,
					default: false,
				},
				reason: {
					type: "string",
					description: "거부 사유 (inverted=true일 때 사용)",
					example: "관리자만 삭제할 수 있습니다",
				},
				name: {
					type: "string",
					description: "권한 이름",
					example: "본인 정보 조회",
				},
				description: {
					type: "string",
					description: "권한 설명",
					example: "자신의 프로필 정보만 조회할 수 있습니다",
				},
			},
		},
		CreateRoleDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "역할 식별자",
					maxLength: 50,
					pattern: "^[A-Z][A-Z0-9_]*$",
					message:
						"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
				},
				displayName: {
					type: "string",
					nullable: true,
					description: "표시명",
					maxLength: 50,
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
					maxLength: 200,
				},
				assignments: {
					description: "역할에 연결된 정책 할당 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/RoleAssignmentResponseDto",
					},
				},
			},
			required: ["name"],
		},
		UpdateRoleDto: {
			type: "object",
			properties: {
				displayName: {
					type: "string",
					nullable: true,
					description: "표시명",
					maxLength: 50,
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
					maxLength: 200,
				},
				assignments: {
					description: "역할에 연결된 정책 할당 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/RoleAssignmentResponseDto",
					},
				},
			},
		},
		I18nCatalogResponseDto: {
			type: "object",
			properties: {
				languageCode: {
					type: "string",
					description: "언어 코드",
					enum: ["ko_KR", "en_US", "zh_CN", "ja_JP"],
					example: "ko_KR",
				},
				messages: {
					type: "object",
					description: "번역 catalog",
					example: {
						성공: "성공",
						로그아웃: "로그아웃",
					},
				},
			},
			required: ["languageCode", "messages"],
		},
		CommunityPostDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "커뮤니티 게시글 ID",
					format: "int64",
				},
				title: {
					type: "string",
					description: "게시글 제목",
					maxLength: 80,
					nullable: true,
				},
				text: {
					type: "string",
					description: "게시글 본문",
					maxLength: 1000,
				},
				authorName: {
					type: "string",
					description: "작성자 표시 이름",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "작성 시각",
				},
				isMine: {
					type: "boolean",
					description: "현재 로그인 사용자가 작성한 글 여부",
				},
				isPinned: {
					type: "boolean",
					description: "공지/고정 게시글 여부",
				},
			},
			required: ["id", "text", "authorName", "createdAt", "isMine", "isPinned"],
		},
		CreateCommunityPostPayloadDto: {
			type: "object",
			properties: {
				title: {
					type: "string",
					description: "게시글 제목",
					maxLength: 80,
				},
				text: {
					type: "string",
					description: "게시글 본문",
					maxLength: 1000,
				},
			},
			required: ["text"],
		},
		CreatePolicyDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
				},
				description: {
					type: "string",
				},
			},
			required: ["name"],
		},
		UpdatePolicyDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				displayName: {
					type: "string",
				},
				description: {
					type: "string",
				},
			},
		},
		SyncPolicyEntryItemDto: {
			type: "object",
			properties: {
				abilityId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Policy에 포함할 Ability ID",
					example: "1",
					format: "int64",
				},
			},
			required: ["abilityId"],
		},
		SyncPolicyEntriesDto: {
			type: "object",
			properties: {
				entries: {
					description: "Policy에 포함할 Ability 항목 목록입니다.",
					type: "array",
					items: {
						$ref: "#/components/schemas/SyncPolicyEntryItemDto",
					},
				},
			},
			required: ["entries"],
		},
		SyncRoleAssignmentItemDto: {
			type: "object",
			properties: {
				policyId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Policy ID (Role에 할당할 정책)",
					example: "1",
					format: "int64",
				},
				isActive: {
					type: "boolean",
					description: "활성화 여부",
					example: true,
					default: true,
				},
				priority: {
					type: "number",
					description: "우선순위 (높을수록 우선)",
					example: 0,
					default: 0,
				},
			},
			required: ["policyId"],
		},
		SyncRoleAssignmentsDto: {
			type: "object",
			properties: {
				assignments: {
					description:
						"Role에 연결할 Policy 목록입니다. 전체 동기화 방식으로 반영됩니다.",
					type: "array",
					items: {
						$ref: "#/components/schemas/SyncRoleAssignmentItemDto",
					},
				},
			},
			required: ["assignments"],
		},
		CreateFolderDto: {
			type: "object",
			properties: {
				parentFolderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "부모 폴더 ID (루트면 null)",
					format: "int64",
				},
				name: {
					type: "string",
					description: "폴더명",
					maxLength: 100,
					pattern: '^[^\\\\/:*?"<>|]+$',
					message: "폴더명에 특수문자를 사용할 수 없습니다",
				},
			},
			required: ["name"],
		},
		UpdateFolderDto: {
			type: "object",
			properties: {
				parentFolderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "부모 폴더 ID (루트면 null)",
					format: "int64",
				},
				name: {
					type: "string",
					description: "폴더명",
					maxLength: 100,
					pattern: '^[^\\\\/:*?"<>|]+$',
					message: "폴더명에 특수문자를 사용할 수 없습니다",
				},
			},
		},
		TemplateType: {
			type: "string",
			enum: ["EMAIL", "SMS", "PUSH"],
			description: "템플릿 유형",
		},
		TemplateDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				code: {
					type: "string",
					description: "고유 코드",
				},
				name: {
					type: "string",
					description: "템플릿 이름",
				},
				type: {
					description: "템플릿 유형",
					allOf: [
						{
							$ref: "#/components/schemas/TemplateType",
						},
					],
				},
				subject: {
					type: "string",
					nullable: true,
					description: "제목",
				},
				content: {
					type: "string",
					description: "본문",
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
				},
				isActive: {
					type: "boolean",
					description: "활성 상태",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"code",
				"name",
				"type",
				"content",
				"isActive",
			],
		},
		CreateTemplateVariableItemDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "변수명",
				},
				description: {
					type: "string",
					description: "변수 설명",
				},
				defaultValue: {
					type: "string",
					description: "기본값",
				},
				isRequired: {
					type: "boolean",
					description: "필수 여부",
				},
			},
			required: ["name"],
		},
		CreateTemplateDto: {
			type: "object",
			properties: {
				code: {
					type: "string",
					description: "고유 코드",
				},
				name: {
					type: "string",
					description: "템플릿 이름",
				},
				type: {
					description: "템플릿 유형",
					allOf: [
						{
							$ref: "#/components/schemas/TemplateType",
						},
					],
				},
				subject: {
					type: "string",
					nullable: true,
					description: "제목",
				},
				content: {
					type: "string",
					description: "본문",
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
				},
				variables: {
					each: true,
					description: "템플릿 변수 목록",
					allOf: [
						{
							$ref: "#/components/schemas/CreateTemplateVariableItemDto",
						},
					],
				},
			},
			required: ["code", "name", "type", "content"],
		},
		UpdateTemplateDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "템플릿 이름",
				},
				subject: {
					type: "string",
					nullable: true,
					description: "제목",
				},
				content: {
					type: "string",
					description: "본문",
				},
				description: {
					type: "string",
					nullable: true,
					description: "설명",
				},
				variables: {
					each: true,
					description: "템플릿 변수 목록",
					allOf: [
						{
							$ref: "#/components/schemas/CreateTemplateVariableItemDto",
						},
					],
				},
			},
		},
		PreviewTemplateDto: {
			type: "object",
			properties: {
				variables: {
					type: "object",
					description: "변수 키-값 맵",
					additionalProperties: {
						type: "string",
					},
					example: {
						userName: "홍길동",
						companyName: "코코레포",
					},
				},
			},
			required: ["variables"],
		},
		SendTestTemplateDto: {
			type: "object",
			properties: {
				recipient: {
					type: "string",
					description: "수신자 (이메일 주소 / 전화번호 / 디바이스 토큰)",
				},
				variables: {
					type: "object",
					description: "변수 키-값 맵",
					additionalProperties: {
						type: "string",
					},
					example: {
						userName: "홍길동",
						companyName: "코코레포",
					},
				},
			},
			required: ["recipient", "variables"],
		},
		ServiceDocumentKind: {
			type: "string",
			enum: [
				"TERMS_OF_SERVICE",
				"PRIVACY_POLICY",
				"MARKETING_CONSENT",
				"LOCATION_CONSENT",
				"THIRD_PARTY_SHARING",
			],
			description: "문서 종류",
		},
		ServiceDocumentPlatform: {
			type: "string",
			enum: ["ALL", "WEB", "MOBILE"],
			description: "노출 플랫폼",
		},
		ServiceDocumentFormat: {
			type: "string",
			enum: ["MARKDOWN", "HTML", "PLAIN_TEXT"],
			description: "본문 형식",
		},
		ServiceDocumentStatus: {
			type: "string",
			enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
			description: "상태",
		},
		ServiceDocumentDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				kind: {
					description: "문서 종류",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentKind",
						},
					],
				},
				platform: {
					description: "노출 플랫폼",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentPlatform",
						},
					],
				},
				locale: {
					type: "string",
					description: "로케일",
				},
				title: {
					type: "string",
					description: "제목",
				},
				summary: {
					type: "string",
					nullable: true,
					description: "요약",
				},
				content: {
					type: "string",
					description: "본문",
				},
				format: {
					description: "본문 형식",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentFormat",
						},
					],
				},
				version: {
					type: "string",
					description: "버전",
				},
				status: {
					description: "상태",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentStatus",
						},
					],
				},
				isRequired: {
					type: "boolean",
					description: "필수 동의 여부",
				},
				displayOrder: {
					type: "number",
					int: true,
					description: "정렬 순서",
				},
				effectiveAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "효력 시작 시각",
				},
				publishedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "게시 시각",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"kind",
				"platform",
				"locale",
				"title",
				"content",
				"format",
				"version",
				"status",
				"isRequired",
				"displayOrder",
			],
		},
		CreateServiceDocumentDto: {
			type: "object",
			properties: {
				kind: {
					description: "문서 종류",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentKind",
						},
					],
				},
				platform: {
					description: "노출 플랫폼",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentPlatform",
						},
					],
				},
				locale: {
					type: "string",
					description: "로케일",
				},
				title: {
					type: "string",
					description: "제목",
				},
				summary: {
					type: "string",
					description: "요약",
				},
				content: {
					type: "string",
					description: "본문",
				},
				format: {
					description: "본문 형식",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentFormat",
						},
					],
				},
				version: {
					type: "string",
					description: "버전",
				},
				isRequired: {
					type: "boolean",
					description: "필수 동의 여부",
				},
				displayOrder: {
					type: "number",
					int: true,
					description: "정렬 순서",
				},
				effectiveAt: {
					format: "date-time",
					type: "string",
					description: "효력 시작 시각",
				},
			},
			required: ["kind", "title", "content", "version"],
		},
		UpdateServiceDocumentDto: {
			type: "object",
			properties: {
				title: {
					type: "string",
					description: "제목",
				},
				summary: {
					type: "string",
					description: "요약",
				},
				content: {
					type: "string",
					description: "본문",
				},
				format: {
					description: "본문 형식",
					allOf: [
						{
							$ref: "#/components/schemas/ServiceDocumentFormat",
						},
					],
				},
				isRequired: {
					type: "boolean",
					description: "필수 동의 여부",
				},
				displayOrder: {
					type: "number",
					int: true,
					description: "정렬 순서",
				},
				effectiveAt: {
					format: "date-time",
					type: "string",
					description: "효력 시작 시각",
				},
			},
		},
		TranslationResponseDto: {
			type: "object",
			properties: {
				id: {
					type: "string",
					description: "번역 ID",
					example: "clxxx12345",
				},
				languageCode: {
					type: "string",
					description: "언어 코드",
					enum: ["ko_KR", "en_US", "zh_CN", "ja_JP"],
					example: "ko_KR",
				},
				key: {
					type: "string",
					description: "번역 키",
					example: "성공",
				},
				text: {
					type: "string",
					description: "번역된 텍스트",
					example: "성공",
				},
				category: {
					type: "string",
					description: "카테고리",
					example: "공통",
				},
				isTranslated: {
					type: "boolean",
					description: "번역 완료 여부",
					example: true,
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성일시",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					description: "수정일시",
					nullable: true,
				},
			},
			required: [
				"id",
				"languageCode",
				"key",
				"text",
				"category",
				"isTranslated",
				"createdAt",
				"updatedAt",
			],
		},
		CreateTranslationDto: {
			type: "object",
			properties: {
				languageCode: {
					type: "string",
					description: "언어 코드",
					enum: ["ko_KR", "en_US", "zh_CN", "ja_JP"],
					example: "ko_KR",
				},
				key: {
					type: "string",
					description: "번역 키 (예: 성공, 번역 목록 조회 성공)",
					example: "성공",
				},
				text: {
					type: "string",
					description: "번역된 텍스트",
					example: "성공",
				},
				category: {
					type: "string",
					description: "카테고리 (common, error, validation, menu, role)",
					example: "common",
				},
				isTranslated: {
					type: "boolean",
					description: "번역 완료 여부",
					default: false,
				},
			},
			required: ["languageCode", "key", "text", "category", "isTranslated"],
		},
		UpdateTranslationDto: {
			type: "object",
			properties: {
				text: {
					type: "string",
					description: "번역된 텍스트",
					example: "성공",
				},
				category: {
					type: "string",
					description: "카테고리",
					example: "common",
				},
				isTranslated: {
					type: "boolean",
					description: "번역 완료 여부",
				},
			},
		},
		SessionTypes: {
			type: "string",
			enum: ["ONE_TIME", "ONE_TIME_RANGE", "RECURRING"],
		},
		RepeatCycleTypes: {
			type: "string",
			enum: ["WEEKLY", "MONTHLY"],
		},
		RecurringDayOfWeek: {
			type: "string",
			enum: [
				"MONDAY",
				"TUESDAY",
				"WEDNESDAY",
				"THURSDAY",
				"FRIDAY",
				"SATURDAY",
				"SUNDAY",
			],
		},
		ExerciseDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				duration: {
					type: "number",
				},
				count: {
					type: "number",
				},
				taskId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				description: {
					type: "string",
					nullable: true,
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				videoFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				name: {
					type: "string",
				},
				task: {
					$ref: "#/components/schemas/TaskDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"duration",
				"count",
				"taskId",
				"name",
				"task",
			],
		},
		TaskDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					format: "int64",
				},
				exercise: {
					$ref: "#/components/schemas/ExerciseDto",
				},
				activities: {
					type: "array",
					items: {
						$ref: "#/components/schemas/ActivityDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"exercise",
				"activities",
			],
		},
		ActivityDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				routineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				taskId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				order: {
					type: "number",
				},
				repetitions: {
					type: "number",
				},
				restTime: {
					type: "number",
				},
				notes: {
					type: "string",
					nullable: true,
				},
				routine: {
					$ref: "#/components/schemas/RoutineDto",
				},
				task: {
					$ref: "#/components/schemas/TaskDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"routineId",
				"taskId",
				"order",
				"repetitions",
				"restTime",
				"routine",
				"task",
			],
		},
		RoutineDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				name: {
					type: "string",
				},
				label: {
					type: "string",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					format: "int64",
				},
				programs: {
					type: "array",
					items: {
						$ref: "#/components/schemas/ProgramDto",
					},
				},
				activities: {
					type: "array",
					items: {
						$ref: "#/components/schemas/ActivityDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"name",
				"label",
				"spaceId",
				"programs",
				"activities",
			],
		},
		ProgramActivityDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				programId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				taskId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				order: {
					type: "number",
				},
				repetitions: {
					type: "number",
				},
				restTime: {
					type: "number",
				},
				notes: {
					type: "string",
					nullable: true,
				},
				exerciseName: {
					type: "string",
				},
				exerciseDescription: {
					type: "string",
					nullable: true,
				},
				exerciseDuration: {
					type: "number",
				},
				exerciseCount: {
					type: "number",
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				videoFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"programId",
				"taskId",
				"order",
				"repetitions",
				"restTime",
				"exerciseName",
				"exerciseDuration",
				"exerciseCount",
			],
		},
		ProgramDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				routineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				sessionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				instructorId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				capacity: {
					type: "number",
				},
				name: {
					type: "string",
				},
				level: {
					type: "string",
					nullable: true,
				},
				routineNameSnapshot: {
					type: "string",
					nullable: true,
				},
				routineLabelSnapshot: {
					type: "string",
					nullable: true,
				},
				activityCount: {
					type: "number",
					int: true,
					min: 0,
					minimum: 0,
				},
				previewExerciseNames: {
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				routine: {
					$ref: "#/components/schemas/RoutineDto",
				},
				session: {
					$ref: "#/components/schemas/SessionDto",
				},
				executionPlan: {
					each: true,
					type: "array",
					items: {
						$ref: "#/components/schemas/ProgramActivityDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"routineId",
				"sessionId",
				"instructorId",
				"capacity",
				"name",
				"routine",
				"session",
			],
		},
		TimelineDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					format: "int64",
				},
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
				sessions: {
					type: "array",
					items: {
						$ref: "#/components/schemas/SessionDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"name",
				"sessions",
			],
		},
		SessionDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				type: {
					allOf: [
						{
							$ref: "#/components/schemas/SessionTypes",
						},
					],
				},
				repeatCycleType: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RepeatCycleTypes",
						},
					],
				},
				startDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				endDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				recurringDayOfWeek: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RecurringDayOfWeek",
						},
					],
				},
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
				programs: {
					type: "array",
					items: {
						$ref: "#/components/schemas/ProgramDto",
					},
				},
				timeline: {
					$ref: "#/components/schemas/TimelineDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"type",
				"timelineId",
				"name",
				"programs",
				"timeline",
			],
		},
		CreateTimelineDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
			},
			required: ["name"],
		},
		UpdateTimelineDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
			},
		},
		CreateSessionDto: {
			type: "object",
			properties: {
				type: {
					allOf: [
						{
							$ref: "#/components/schemas/SessionTypes",
						},
					],
				},
				repeatCycleType: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RepeatCycleTypes",
						},
					],
				},
				startDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				endDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				recurringDayOfWeek: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RecurringDayOfWeek",
						},
					],
				},
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
			},
			required: ["type", "timelineId", "name"],
		},
		UpdateSessionDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				type: {
					allOf: [
						{
							$ref: "#/components/schemas/SessionTypes",
						},
					],
				},
				repeatCycleType: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RepeatCycleTypes",
						},
					],
				},
				startDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				endDateTime: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				recurringDayOfWeek: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RecurringDayOfWeek",
						},
					],
				},
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				name: {
					type: "string",
				},
				description: {
					type: "string",
					nullable: true,
				},
				programs: {
					type: "array",
					items: {
						$ref: "#/components/schemas/ProgramDto",
					},
				},
				timeline: {
					$ref: "#/components/schemas/TimelineDto",
				},
			},
		},
		CreateProgramDto: {
			type: "object",
			properties: {
				routineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				instructorId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				capacity: {
					type: "number",
				},
				name: {
					type: "string",
				},
				level: {
					type: "string",
					nullable: true,
				},
			},
			required: ["routineId", "instructorId", "capacity", "name"],
		},
		UpdateProgramDto: {
			type: "object",
			properties: {
				routineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				instructorId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				capacity: {
					type: "number",
				},
				name: {
					type: "string",
				},
				level: {
					type: "string",
					nullable: true,
				},
			},
		},
		SpaceScope: {
			type: "string",
			enum: ["CURRENT", "INCLUDE_ANCESTORS"],
		},
		CreateExerciseDto: {
			type: "object",
			properties: {
				duration: {
					type: "number",
				},
				count: {
					type: "number",
				},
				description: {
					type: "string",
					nullable: true,
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				videoFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				name: {
					type: "string",
				},
			},
			required: ["duration", "count", "name"],
		},
		UpdateExerciseDto: {
			type: "object",
			properties: {
				duration: {
					type: "number",
				},
				count: {
					type: "number",
				},
				description: {
					type: "string",
					nullable: true,
				},
				imageFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				videoFileId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
				},
				name: {
					type: "string",
				},
			},
		},
		CreateRoutineActivityItemDto: {
			type: "object",
			properties: {
				taskId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				order: {
					type: "number",
				},
				repetitions: {
					type: "number",
				},
				restTime: {
					type: "number",
				},
				notes: {
					type: "string",
				},
			},
			required: ["taskId"],
		},
		CreateRoutineDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				label: {
					type: "string",
				},
				activities: {
					each: true,
					allOf: [
						{
							$ref: "#/components/schemas/CreateRoutineActivityItemDto",
						},
					],
				},
			},
			required: ["name", "label"],
		},
		UpdateRoutineDto: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				label: {
					type: "string",
				},
				activities: {
					each: true,
					allOf: [
						{
							$ref: "#/components/schemas/CreateRoutineActivityItemDto",
						},
					],
				},
			},
		},
		InquiryFormOptionItemDto: {
			type: "object",
			properties: {
				value: {
					description: "옵션 값",
					example: "GENERAL",
					oneOf: [
						{
							type: "string",
						},
						{
							type: "number",
						},
						{
							type: "boolean",
						},
						{
							type: "null",
						},
					],
				},
				label: {
					type: "string",
					description: "옵션 라벨",
					example: "일반 문의",
				},
			},
			required: ["value", "label"],
		},
		InquiryFormUiPathsDto: {
			type: "object",
			properties: {
				readOnlyPaths: {
					description: "읽기 전용 경로 목록",
					example: ["inquiryNumber"],
					type: "array",
					items: {
						type: "string",
					},
				},
				hiddenPaths: {
					description: "숨김 경로 목록",
					example: ["content"],
					type: "array",
					items: {
						type: "string",
					},
				},
				disabledPaths: {
					description: "비활성 경로 목록",
					example: ["customerId"],
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			required: ["readOnlyPaths", "hiddenPaths", "disabledPaths"],
		},
		InquiryFormFieldMetaDto: {
			type: "object",
			properties: {
				label: {
					type: "string",
					description: "필드 라벨",
					example: "문의 제목",
				},
			},
		},
		InquiryCategory: {
			type: "string",
			enum: [
				"GENERAL",
				"DELIVERY",
				"REFUND",
				"PRODUCT",
				"ACCOUNT",
				"TECHNICAL",
				"COMPLAINT",
				"OTHER",
			],
			description: "문의 카테고리",
		},
		InquiryChannel: {
			type: "string",
			enum: ["WEB", "EMAIL", "CHAT", "SMS", "PHONE", "WALK_IN"],
			description: "문의 채널",
		},
		InquirySource: {
			type: "string",
			enum: ["ONLINE", "OFFLINE"],
			description: "문의 접수 유형",
		},
		InquiryStatus: {
			type: "string",
			enum: [
				"NEW",
				"OPEN",
				"IN_PROGRESS",
				"WAITING_CUSTOMER",
				"RESOLVED",
				"CLOSED",
				"ESCALATED",
			],
			description: "문의 상태",
		},
		InquiryPriority: {
			type: "string",
			enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
			description: "문의 우선순위",
		},
		SentimentType: {
			type: "string",
			enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
			description: "감정 유형",
		},
		InquiryDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 Space ID",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				inquiryNumber: {
					type: "string",
					description: "문의 번호",
				},
				title: {
					type: "string",
					description: "문의 제목",
				},
				category: {
					description: "문의 카테고리",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryCategory",
						},
					],
				},
				channel: {
					description: "문의 채널",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryChannel",
						},
					],
				},
				source: {
					description: "문의 접수 유형",
					allOf: [
						{
							$ref: "#/components/schemas/InquirySource",
						},
					],
				},
				status: {
					description: "문의 상태",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryStatus",
						},
					],
				},
				priority: {
					description: "문의 우선순위",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryPriority",
						},
					],
				},
				customerId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "고객 ID",
					format: "int64",
				},
				assigneeId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "담당자 ID",
					format: "int64",
				},
				isRealtimeChat: {
					type: "boolean",
					description: "실시간 채팅 활성화 여부",
				},
				isSlaResponseBreached: {
					type: "boolean",
					description: "SLA 응답 위반 여부",
				},
				isSlaResolveBreached: {
					type: "boolean",
					description: "SLA 해결 위반 여부",
				},
				sentiment: {
					nullable: true,
					description: "감정 유형",
					allOf: [
						{
							$ref: "#/components/schemas/SentimentType",
						},
					],
				},
				lastMessageAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 메시지 일시",
				},
				unreadCount: {
					type: "number",
					description: "읽지 않은 메시지 수",
				},
				firstResponseAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "첫 응답 일시",
				},
				resolvedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "해결 일시",
				},
				closedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "종료 일시",
				},
				slaResponseDue: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "SLA 응답 기한",
				},
				slaResolveDue: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "SLA 해결 기한",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"inquiryNumber",
				"title",
				"category",
				"channel",
				"source",
				"status",
				"priority",
				"isRealtimeChat",
				"isSlaResponseBreached",
				"isSlaResolveBreached",
				"sentiment",
				"lastMessageAt",
				"unreadCount",
				"firstResponseAt",
				"resolvedAt",
				"closedAt",
				"slaResponseDue",
				"slaResolveDue",
			],
		},
		InquiryPaginationMetaDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 개수",
				},
				skip: {
					type: "number",
					description: "건너뛴 항목 수 (offset)",
				},
				take: {
					type: "number",
					description: "조회 항목 수",
				},
				totalPages: {
					type: "number",
					description: "전체 페이지 수",
				},
			},
			required: ["total", "skip", "take", "totalPages"],
		},
		InquiryStatsDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 문의 수",
				},
				new: {
					type: "number",
					description: "신규 문의 수",
				},
				inProgress: {
					type: "number",
					description: "진행 중 문의 수",
				},
				waiting: {
					type: "number",
					description: "대기 중 문의 수",
				},
				resolved: {
					type: "number",
					description: "해결된 문의 수",
				},
				closed: {
					type: "number",
					description: "종료된 문의 수",
				},
				escalated: {
					type: "number",
					description: "에스컬레이션 문의 수",
				},
				slaBreached: {
					type: "number",
					description: "SLA 위반 문의 수",
				},
				avgResponseTime: {
					type: "number",
					description: "평균 응답 시간 (분)",
				},
				avgResolutionTime: {
					type: "number",
					description: "평균 해결 시간 (분)",
				},
			},
			required: [
				"total",
				"new",
				"inProgress",
				"waiting",
				"resolved",
				"closed",
				"escalated",
				"slaBreached",
				"avgResponseTime",
				"avgResolutionTime",
			],
		},
		InquiryCreateUpdateFormBootstrapDto: {
			type: "object",
			properties: {
				mode: {
					type: "string",
					description: "폼 모드",
					enum: ["CREATE", "UPDATE"],
					example: "CREATE",
				},
				defaultObject: {
					type: "object",
					description: "초기 폼 객체",
					additionalProperties: true,
				},
				options: {
					type: "object",
					description: "경로별 선택 옵션",
					additionalProperties: {
						type: "array",
						items: {
							$ref: "#/components/schemas/InquiryFormOptionItemDto",
						},
					},
				},
				ui: {
					description: "UI 제어 경로",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryFormUiPathsDto",
						},
					],
				},
				fieldMeta: {
					type: "object",
					description: "경로별 필드 메타",
					additionalProperties: {
						$ref: "#/components/schemas/InquiryFormFieldMetaDto",
					},
				},
			},
			required: ["mode", "defaultObject", "options", "ui", "fieldMeta"],
		},
		SentimentResultDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				inquiryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 문의 ID",
					format: "int64",
				},
				messageId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "분석 대상 메시지 ID",
					format: "int64",
				},
				sentiment: {
					description: "감정 유형",
					allOf: [
						{
							$ref: "#/components/schemas/SentimentType",
						},
					],
				},
				score: {
					type: "number",
					description: "감정 점수 (-1.0 ~ 1.0)",
				},
				confidence: {
					type: "number",
					description: "분석 신뢰도 (0.0 ~ 1.0)",
				},
				urgency: {
					type: "number",
					nullable: true,
					description: "긴급도 점수 (0.0 ~ 1.0)",
				},
				analyzedAt: {
					format: "date-time",
					type: "string",
					description: "분석 일시",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"inquiryId",
				"sentiment",
				"score",
				"confidence",
				"urgency",
				"analyzedAt",
			],
		},
		ThreadStatus: {
			type: "string",
			enum: ["ACTIVE", "RESOLVED", "CLOSED"],
			description: "스레드 상태",
		},
		InquiryThreadDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				inquiryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 문의 ID",
					format: "int64",
				},
				title: {
					type: "string",
					nullable: true,
					description: "스레드 제목",
				},
				status: {
					description: "스레드 상태",
					allOf: [
						{
							$ref: "#/components/schemas/ThreadStatus",
						},
					],
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "생성자 ID",
					format: "int64",
				},
				lastMessageAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 메시지 일시",
				},
				lastMessagePreview: {
					type: "string",
					nullable: true,
					description: "마지막 메시지 미리보기",
				},
				messageCount: {
					type: "number",
					description: "메시지 수",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"inquiryId",
				"title",
				"status",
				"createdById",
				"lastMessageAt",
				"lastMessagePreview",
				"messageCount",
			],
		},
		InquiryParticipantRole: {
			type: "string",
			enum: ["CUSTOMER", "AGENT", "SUPERVISOR", "VIEWER"],
			description: "참여자 역할",
		},
		InquiryParticipantDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				inquiryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 문의 ID",
					format: "int64",
				},
				threadId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "소속 스레드 ID",
					format: "int64",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "참여자 ID",
					format: "int64",
				},
				userName: {
					type: "string",
					description: "참여자 이름",
				},
				userAvatar: {
					type: "string",
					nullable: true,
					description: "참여자 아바타",
				},
				role: {
					description: "참여자 역할",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryParticipantRole",
						},
					],
				},
				isOnline: {
					type: "boolean",
					description: "온라인 여부",
				},
				isTyping: {
					type: "boolean",
					description: "타이핑 중 여부",
				},
				lastSeenAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 접속 시간",
				},
				lastReadAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 읽은 시간",
				},
				unreadCount: {
					type: "number",
					description: "읽지 않은 메시지 수",
				},
				joinedAt: {
					format: "date-time",
					type: "string",
					description: "참여 일시",
				},
				leftAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "나간 일시",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"inquiryId",
				"userId",
				"userName",
				"userAvatar",
				"role",
				"isOnline",
				"isTyping",
				"lastSeenAt",
				"lastReadAt",
				"unreadCount",
				"joinedAt",
				"leftAt",
			],
		},
		InquiryDetailDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 Space ID",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				inquiryNumber: {
					type: "string",
					description: "문의 번호",
				},
				title: {
					type: "string",
					description: "문의 제목",
				},
				category: {
					description: "문의 카테리",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryCategory",
						},
					],
				},
				channel: {
					description: "문의 채널",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryChannel",
						},
					],
				},
				source: {
					description: "문의 접수 유형",
					allOf: [
						{
							$ref: "#/components/schemas/InquirySource",
						},
					],
				},
				status: {
					description: "문의 상태",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryStatus",
						},
					],
				},
				priority: {
					description: "문의 우선순위",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryPriority",
						},
					],
				},
				customerId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "고객 ID",
					format: "int64",
				},
				assigneeId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "담당자 ID",
					format: "int64",
				},
				isRealtimeChat: {
					type: "boolean",
					description: "실시간 채팅 활성화 여부",
				},
				isSlaResponseBreached: {
					type: "boolean",
					description: "SLA 응답 위반 여부",
				},
				isSlaResolveBreached: {
					type: "boolean",
					description: "SLA 해결 위반 여부",
				},
				lastMessageAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 메시지 일시",
				},
				unreadCount: {
					type: "number",
					description: "읽지 않은 메시지 수",
				},
				firstResponseAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "첫 응답 일시",
				},
				resolvedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "해결 일시",
				},
				closedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "종료 일시",
				},
				slaResponseDue: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "SLA 응답 기한",
				},
				slaResolveDue: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "SLA 해결 기한",
				},
				sentiment: {
					nullable: true,
					description: "감정 분석 결과",
					allOf: [
						{
							$ref: "#/components/schemas/SentimentResultDto",
						},
					],
				},
				threads: {
					description: "스레드 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/InquiryThreadDto",
					},
				},
				participants: {
					description: "참여자 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/InquiryParticipantDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"inquiryNumber",
				"title",
				"category",
				"channel",
				"source",
				"status",
				"priority",
				"isRealtimeChat",
				"isSlaResponseBreached",
				"isSlaResolveBreached",
				"lastMessageAt",
				"unreadCount",
				"firstResponseAt",
				"resolvedAt",
				"closedAt",
				"slaResponseDue",
				"slaResolveDue",
				"sentiment",
				"threads",
				"participants",
			],
		},
		CreateInquiryDto: {
			type: "object",
			properties: {
				title: {
					type: "string",
					minLength: 2,
					maxLength: 200,
					description: "문의 제목",
				},
				category: {
					description: "문의 카테고리",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryCategory",
						},
					],
				},
				channel: {
					description: "문의 채널",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryChannel",
						},
					],
				},
				source: {
					description: "문의 접수 유형 (기본값: ONLINE)",
					allOf: [
						{
							$ref: "#/components/schemas/InquirySource",
						},
					],
				},
				priority: {
					description: "문의 우선순위 (기본값: NORMAL)",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryPriority",
						},
					],
				},
				customerId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "고객 ID",
					format: "int64",
				},
				assigneeId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "담당자 ID",
					format: "int64",
				},
				content: {
					type: "string",
					description: "문의 내용 (첫 메시지)",
				},
			},
			required: ["title", "category", "channel"],
		},
		UpdateInquiryDto: {
			type: "object",
			properties: {
				title: {
					type: "string",
					minLength: 2,
					maxLength: 200,
					description: "문의 제목",
				},
				category: {
					description: "문의 카테고리",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryCategory",
						},
					],
				},
				status: {
					description: "문의 상태",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryStatus",
						},
					],
				},
				priority: {
					description: "문의 우선순위",
					allOf: [
						{
							$ref: "#/components/schemas/InquiryPriority",
						},
					],
				},
				assigneeId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "담당자 ID",
					format: "int64",
				},
				isRealtimeChat: {
					type: "boolean",
					description: "실시간 채팅 활성화 여부",
				},
			},
		},
		SenderType: {
			type: "string",
			enum: ["USER", "AI", "SYSTEM"],
			description: "발신자 유형",
		},
		MessageContentType: {
			type: "string",
			enum: ["TEXT", "HTML", "MARKDOWN", "IMAGE", "FILE", "SYSTEM"],
			description: "콘텐츠 유형",
		},
		InquiryAttachmentDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				messageId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 메시지 ID",
					format: "int64",
				},
				fileName: {
					type: "string",
					description: "원본 파일명",
				},
				fileSize: {
					type: "number",
					description: "파일 크기 (bytes)",
				},
				mimeType: {
					type: "string",
					description: "MIME 타입",
				},
				url: {
					type: "string",
					description: "파일 URL",
				},
				thumbnailUrl: {
					type: "string",
					nullable: true,
					description: "썸네일 URL",
				},
				width: {
					type: "number",
					nullable: true,
					description: "이미지 너비",
				},
				height: {
					type: "number",
					nullable: true,
					description: "이미지 높이",
				},
				duration: {
					type: "number",
					nullable: true,
					description: "재생 시간 (초)",
				},
				isDeleted: {
					type: "boolean",
					description: "삭제 여부",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"messageId",
				"fileName",
				"fileSize",
				"mimeType",
				"url",
				"thumbnailUrl",
				"width",
				"height",
				"duration",
				"isDeleted",
			],
		},
		InquiryMessageDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				threadId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 스레드 ID",
					format: "int64",
				},
				inquiryId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "소속 문의 ID",
					format: "int64",
				},
				senderId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "발신자 ID",
					format: "int64",
				},
				senderName: {
					type: "string",
					description: "발신자 이름",
				},
				senderAvatar: {
					type: "string",
					nullable: true,
					description: "발신자 아바타",
				},
				senderType: {
					description: "발신자 유형",
					allOf: [
						{
							$ref: "#/components/schemas/SenderType",
						},
					],
				},
				content: {
					type: "string",
					description: "메시지 내용",
				},
				contentType: {
					description: "콘텐츠 유형",
					allOf: [
						{
							$ref: "#/components/schemas/MessageContentType",
						},
					],
				},
				clientMessageId: {
					type: "string",
					pattern:
						"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
					nullable: true,
					description: "클라이언트 메시지 ID",
				},
				isEdited: {
					type: "boolean",
					description: "수정 여부",
				},
				isDeleted: {
					type: "boolean",
					description: "삭제 여부",
				},
				editedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "수정 일시",
				},
				deliveredAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "전달 완료 시간",
				},
				readAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "읽음 확인 시간",
				},
				attachments: {
					description: "첨부파일 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/InquiryAttachmentDto",
					},
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"threadId",
				"inquiryId",
				"senderName",
				"senderAvatar",
				"senderType",
				"content",
				"contentType",
				"isEdited",
				"isDeleted",
				"editedAt",
				"deliveredAt",
				"readAt",
			],
		},
		InquiryMessagePaginationMetaDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 개수",
				},
				skip: {
					type: "number",
					description: "건너뛴 항목 수 (offset)",
				},
				take: {
					type: "number",
					description: "조회 항목 수",
				},
				totalPages: {
					type: "number",
					description: "전체 페이지 수",
				},
			},
			required: ["total", "skip", "take", "totalPages"],
		},
		InquiryParticipant: {
			type: "object",
			properties: {},
		},
		TenantAccessRequestStatus: {
			type: "string",
			enum: ["PENDING", "APPROVED", "REJECTED", "CANCELED"],
			description: "신청 상태",
		},
		TenantAccessRequestDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				requesterId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "신청자 ID",
					format: "int64",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "신청 대상 Space ID",
					format: "int64",
				},
				requestedRoleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "희망 Role ID",
					format: "int64",
				},
				previousRoleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "신청 시점 기존 Role ID",
					nullable: true,
					format: "int64",
				},
				reason: {
					type: "string",
					description: "신청 사유",
					nullable: true,
				},
				status: {
					description: "신청 상태",
					allOf: [
						{
							$ref: "#/components/schemas/TenantAccessRequestStatus",
						},
					],
				},
				reviewerId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "검토자 ID",
					nullable: true,
					format: "int64",
				},
				reviewComment: {
					type: "string",
					description: "검토 코멘트",
					nullable: true,
				},
				reviewedAt: {
					format: "date-time",
					type: "string",
					description: "검토 시각",
					nullable: true,
				},
				appliedTenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "승인 적용 Tenant ID",
					nullable: true,
					format: "int64",
				},
				requester: {
					$ref: "#/components/schemas/UserDto",
				},
				reviewer: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/UserDto",
						},
					],
				},
				space: {
					$ref: "#/components/schemas/SpaceDto",
				},
				requestedRole: {
					$ref: "#/components/schemas/RoleDto",
				},
				previousRole: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/RoleDto",
						},
					],
				},
				appliedTenant: {
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/TenantDto",
						},
					],
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"requesterId",
				"spaceId",
				"requestedRoleId",
				"status",
				"reviewedAt",
			],
		},
		TenantAccessRequestPaginationMetaDto: {
			type: "object",
			properties: {
				total: {
					type: "number",
					description: "전체 신청 수",
				},
				skip: {
					type: "number",
					description: "건너뛴 항목 수 (offset)",
				},
				take: {
					type: "number",
					description: "조회 항목 수",
				},
				totalPages: {
					type: "number",
					description: "전체 페이지 수",
				},
			},
			required: ["total", "skip", "take", "totalPages"],
		},
		ReviewTenantAccessRequestDto: {
			type: "object",
			properties: {
				reviewComment: {
					type: "string",
					description: "승인/반려 코멘트",
					maxLength: 1000,
					nullable: true,
				},
			},
		},
		ReservationAvailabilityStatus: {
			type: "string",
			enum: [
				"AVAILABLE",
				"FEW_LEFT",
				"WAITLIST_OPEN",
				"RESERVED",
				"WAITLISTED",
				"BOOKING_CLOSED",
			],
			description: "예약 가능 상태",
		},
		ReservationStatus: {
			type: "string",
			enum: ["CONFIRMED", "WAITLISTED", "CANCELED"],
			description: "내 예약 상태",
		},
		BookingFeedItemDto: {
			type: "object",
			properties: {
				feedItemId: {
					type: "string",
					description: "피드 항목 ID",
				},
				date: {
					type: "string",
					description: "일자(YYYY-MM-DD)",
				},
				startsAt: {
					format: "date-time",
					type: "string",
					description: "시작 시각",
				},
				endsAt: {
					format: "date-time",
					type: "string",
					description: "종료 시각",
				},
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "타임라인 ID",
					format: "int64",
				},
				sessionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "세션 ID",
					format: "int64",
				},
				programId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "프로그램 ID",
					format: "int64",
				},
				timelineName: {
					type: "string",
					description: "타임라인 이름",
				},
				sessionName: {
					type: "string",
					description: "세션 이름",
				},
				programName: {
					type: "string",
					description: "프로그램 이름",
				},
				coachName: {
					type: "string",
					description: "코치 이름",
					nullable: true,
				},
				capacity: {
					type: "number",
					description: "정원",
					int: true,
					minimum: 0,
				},
				confirmedCount: {
					type: "number",
					description: "확정 예약 수",
					int: true,
					minimum: 0,
				},
				availableSeatCount: {
					type: "number",
					description: "예약 가능 좌석 수",
					int: true,
					minimum: 0,
				},
				waitlistCount: {
					type: "number",
					description: "대기 예약 수",
					int: true,
					minimum: 0,
				},
				availabilityStatus: {
					description: "예약 가능 상태",
					allOf: [
						{
							$ref: "#/components/schemas/ReservationAvailabilityStatus",
						},
					],
				},
				myReservationStatus: {
					description: "내 예약 상태",
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/ReservationStatus",
						},
					],
				},
				ctaLabel: {
					type: "string",
					description: "CTA 라벨",
				},
				cancelableUntilAt: {
					format: "date-time",
					type: "string",
					description: "취소 가능 마감 시각",
					nullable: true,
				},
				level: {
					type: "string",
					description: "난이도",
					nullable: true,
				},
				routineLabelSnapshot: {
					type: "string",
					description: "루틴 라벨 스냅샷",
					nullable: true,
				},
				previewExerciseNames: {
					description: "운동 미리보기",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			required: [
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
				"cancelableUntilAt",
			],
		},
		ReservationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "Space ID",
					format: "int64",
				},
				createdById: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "생성자 ID",
					format: "int64",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "예약 사용자 ID",
					format: "int64",
				},
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "타임라인 ID",
					format: "int64",
				},
				sessionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "세션 ID",
					format: "int64",
				},
				programId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "프로그램 ID",
					format: "int64",
				},
				occurrenceStartAt: {
					format: "date-time",
					type: "string",
					description: "예약 발생 회차 시작 시각",
				},
				status: {
					description: "예약 상태",
					allOf: [
						{
							$ref: "#/components/schemas/ReservationStatus",
						},
					],
				},
				memo: {
					type: "string",
					description: "예약 메모",
					nullable: true,
				},
				idempotencyKey: {
					type: "string",
					description: "멱등성 키",
				},
				waitlistPosition: {
					type: "number",
					description: "대기 순번",
					nullable: true,
					int: true,
					minimum: 1,
				},
				confirmedAt: {
					format: "date-time",
					type: "string",
					description: "확정 시각",
					nullable: true,
				},
				canceledAt: {
					format: "date-time",
					type: "string",
					description: "취소 시각",
					nullable: true,
				},
				cancelReason: {
					type: "string",
					description: "취소 사유",
					nullable: true,
				},
				user: {
					$ref: "#/components/schemas/UserDto",
				},
				timeline: {
					$ref: "#/components/schemas/TimelineDto",
				},
				session: {
					$ref: "#/components/schemas/SessionDto",
				},
				program: {
					$ref: "#/components/schemas/ProgramDto",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"spaceId",
				"userId",
				"timelineId",
				"sessionId",
				"programId",
				"occurrenceStartAt",
				"status",
				"idempotencyKey",
				"confirmedAt",
				"canceledAt",
			],
		},
		CreateReservationDto: {
			type: "object",
			properties: {
				timelineId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "타임라인 ID",
					format: "int64",
				},
				sessionId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "세션 ID",
					format: "int64",
				},
				programId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "프로그램 ID",
					format: "int64",
				},
				occurrenceStartAt: {
					format: "date-time",
					type: "string",
					description: "예약 발생 회차 시작 시각",
				},
				idempotencyKey: {
					type: "string",
					description: "멱등성 키",
					minLength: 8,
					maxLength: 120,
				},
				memo: {
					type: "string",
					description: "예약 메모",
					maxLength: 1000,
					nullable: true,
				},
			},
			required: [
				"timelineId",
				"sessionId",
				"programId",
				"occurrenceStartAt",
				"idempotencyKey",
			],
		},
		NativeAuthResponseDto: {
			type: "object",
			properties: {
				accessToken: {
					type: "string",
					description: "first-party native JWT Access Token",
					example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
				refreshToken: {
					type: "string",
					description: "first-party native Refresh Token",
					example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
				},
				sessionId: {
					type: "string",
					description: "first-party native 세션 ID",
					example: "user-mobile.0123456789abcdef0123456789abcdef",
				},
				accessTokenExpiresAt: {
					type: "number",
					description: "Access Token 만료 시간 (Unix timestamp, milliseconds)",
					example: 1704067200000,
				},
				refreshTokenExpiresAt: {
					type: "number",
					description: "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
					example: 1704672000000,
				},
				user: {
					description: "인증된 사용자 정보",
					allOf: [
						{
							$ref: "#/components/schemas/UserDto",
						},
					],
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요 여부",
					example: false,
				},
			},
			required: [
				"accessToken",
				"refreshToken",
				"sessionId",
				"accessTokenExpiresAt",
				"refreshTokenExpiresAt",
				"user",
			],
		},
		NativeLoginPayloadDto: {
			type: "object",
			properties: {
				email: {
					type: "string",
					example: "ceo@f45training.co.kr",
					description: "사용자 이메일",
				},
				password: {
					type: "string",
					example: "SuperAdmin123!@#",
					description: "사용자 비밀번호 (8자 이상)",
				},
			},
			required: ["email", "password"],
		},
		NativeTokenRefreshPayloadDto: {
			type: "object",
			properties: {
				sessionId: {
					type: "string",
					description: "first-party native 세션 ID",
					example: "user-mobile.0123456789abcdef0123456789abcdef",
				},
				refreshToken: {
					type: "string",
					description: "first-party native refresh token",
					example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
				},
			},
			required: ["sessionId", "refreshToken"],
		},
		NativeLogoutPayloadDto: {
			type: "object",
			properties: {
				sessionId: {
					type: "string",
					description: "first-party native 세션 ID",
					example: "user-mobile.0123456789abcdef0123456789abcdef",
				},
				refreshToken: {
					type: "string",
					description: "first-party native refresh token",
					example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
				},
			},
			required: ["sessionId"],
		},
		TokenRefreshResponseDto: {
			type: "object",
			properties: {
				accessToken: {
					type: "string",
					description: "새로 발급된 JWT Access Token",
					example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
				refreshToken: {
					type: "string",
					description: "새로 발급된 JWT Refresh Token",
					example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
				accessTokenExpiresAt: {
					type: "number",
					description: "Access Token 만료 시간 (Unix timestamp, milliseconds)",
					example: 1704067200000,
				},
				refreshTokenExpiresAt: {
					type: "number",
					description: "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
					example: 1704672000000,
				},
				user: {
					description: "인증된 사용자 정보",
					allOf: [
						{
							$ref: "#/components/schemas/UserDto",
						},
					],
				},
			},
			required: [
				"accessToken",
				"refreshToken",
				"accessTokenExpiresAt",
				"refreshTokenExpiresAt",
				"user",
			],
		},
		EmailVerificationRequestedDto: {
			type: "object",
			properties: {
				email: {
					type: "string",
					description: "인증 요청 이메일",
				},
				expiresAt: {
					format: "date-time",
					type: "string",
					description: "인증 링크 만료 시각",
				},
			},
			required: ["email", "expiresAt"],
		},
		SignUpPayloadDto: {
			type: "object",
			properties: {
				nickname: {
					type: "string",
					minLength: 2,
					maxLength: 50,
					example: "홍길동",
					description: "닉네임 (2-50자)",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					example: "1",
					description: "스페이스 ID",
					format: "int64",
				},
				email: {
					type: "string",
					toLowerCase: true,
					example: "user@example.com",
					description: "이메일",
				},
				name: {
					type: "string",
					minLength: 2,
					maxLength: 50,
					example: "홍길동",
					description: "이름 (2-50자)",
				},
				phone: {
					type: "string",
					example: "010-1234-5678",
					description: "전화번호",
				},
				address: {
					type: "string",
					minLength: 2,
					maxLength: 255,
					example: "서울특별시 강남구 테헤란로 123",
					description: "주소 (2-255자)",
				},
				password: {
					type: "string",
					example: "Password123!",
					description: "비밀번호 (10자 이상, 72자 이하)",
					minLength: 10,
					maxLength: 72,
				},
			},
			required: [
				"nickname",
				"spaceId",
				"email",
				"name",
				"phone",
				"address",
				"password",
			],
		},
		VerifyTokenResponseDto: {
			type: "object",
			properties: {
				valid: {
					type: "boolean",
					description: "토큰 유효 여부",
				},
				accessTokenExpiresAt: {
					type: "number",
					description: "Access Token 만료 시간 (Unix timestamp, ms)",
				},
				refreshTokenExpiresAt: {
					type: "number",
					description: "Refresh Token 만료 시간 (Unix timestamp, ms)",
				},
				hasFullAccess: {
					type: "boolean",
					description:
						"현재 `x-tenant-id`로 해석된 tenant role이 `PLATFORM_ADMIN`인지 여부",
				},
			},
			required: [
				"valid",
				"accessTokenExpiresAt",
				"refreshTokenExpiresAt",
				"hasFullAccess",
			],
		},
		SetCurrentSpaceDto: {
			type: "object",
			properties: {
				tenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "현재 선택할 Tenant ID",
					example: "1",
					format: "int64",
				},
			},
			required: ["tenantId"],
		},
		AuthAuditResult: {
			type: "string",
			enum: ["SUCCESS", "FAILURE", "LOCKED"],
			description: "결과",
		},
		AuthAuditLogDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "ID",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성일",
				},
				email: {
					type: "string",
					description: "이메일",
				},
				userId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "사용자 ID",
					format: "int64",
				},
				result: {
					description: "결과",
					allOf: [
						{
							$ref: "#/components/schemas/AuthAuditResult",
						},
					],
				},
				failureReason: {
					type: "string",
					nullable: true,
					description: "실패 사유",
				},
				ipAddress: {
					type: "string",
					description: "IP 주소",
				},
				userAgent: {
					type: "string",
					nullable: true,
					description: "User Agent",
				},
				clientId: {
					type: "string",
					nullable: true,
					description: "클라이언트 ID",
				},
			},
			required: ["id", "createdAt", "email", "result", "ipAddress"],
		},
		PageMetaDto: {
			type: "object",
			properties: {
				skip: {
					type: "number",
				},
				take: {
					type: "number",
				},
				totalCount: {
					type: "number",
				},
				pageCount: {
					type: "number",
				},
				hasPreviousPage: {
					type: "boolean",
				},
				hasNextPage: {
					type: "boolean",
				},
			},
			required: [
				"skip",
				"take",
				"totalCount",
				"pageCount",
				"hasPreviousPage",
				"hasNextPage",
			],
		},
		AuditLogStatsDto: {
			type: "object",
			properties: {
				todaySuccessCount: {
					type: "number",
					description: "오늘 성공 건수",
				},
				todayFailureCount: {
					type: "number",
					description: "오늘 실패 건수",
				},
				todayLockedCount: {
					type: "number",
					description: "오늘 잠금 건수",
				},
				totalCount: {
					type: "number",
					description: "전체 건수",
				},
			},
			required: [
				"todaySuccessCount",
				"todayFailureCount",
				"todayLockedCount",
				"totalCount",
			],
		},
		OidcClientDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				removedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				clientId: {
					type: "string",
					description: "클라이언트 식별자",
					maxLength: 64,
					pattern: "^[a-z0-9-]+$",
					message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
				},
				clientSecret: {
					type: "string",
					nullable: true,
					description: "클라이언트 시크릿",
				},
				name: {
					type: "string",
					description: "클라이언트 이름",
					maxLength: 128,
				},
				redirectUris: {
					description: "리다이렉트 URI 목록",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				loginUrl: {
					type: "string",
					nullable: true,
					description: "로그인 화면 URL",
				},
				defaultReturnTo: {
					type: "string",
					nullable: true,
					description: "인증 성공 후 기본 복귀 URL",
				},
				grantTypes: {
					description: "허용된 Grant 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				responseTypes: {
					description: "응답 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				tokenEndpointAuthMethod: {
					type: "string",
					description: "토큰 엔드포인트 인증 방식",
					maxLength: 50,
				},
				scope: {
					type: "string",
					description: "허용된 스코프",
				},
				isActive: {
					type: "boolean",
					description: "활성화 여부",
				},
				isFirstParty: {
					type: "boolean",
					description: "First-party 클라이언트 여부",
				},
				skipConsent: {
					type: "boolean",
					description: "권한 동의 화면 생략 여부",
				},
				loginUi: {
					type: "object",
					description: "로그인 화면 표시 설정",
					additionalProperties: true,
					nullable: true,
				},
				logoUri: {
					type: "string",
					nullable: true,
					description: "로고 URI",
				},
				policyUri: {
					type: "string",
					nullable: true,
					description: "정책 URI",
				},
				tosUri: {
					type: "string",
					nullable: true,
					description: "서비스 약관 URI",
				},
			},
			required: [
				"id",
				"createdAt",
				"updatedAt",
				"removedAt",
				"clientId",
				"name",
				"redirectUris",
				"grantTypes",
				"responseTypes",
				"tokenEndpointAuthMethod",
				"scope",
				"isActive",
				"isFirstParty",
				"skipConsent",
			],
		},
		CreateOidcClientDto: {
			type: "object",
			properties: {
				clientId: {
					type: "string",
					description: "클라이언트 식별자",
					maxLength: 64,
					pattern: "^[a-z0-9-]+$",
					message: "Client ID는 영소문자, 숫자, 하이픈만 사용 가능합니다",
				},
				clientSecret: {
					type: "string",
					nullable: true,
					description: "클라이언트 시크릿",
				},
				name: {
					type: "string",
					description: "클라이언트 이름",
					maxLength: 128,
				},
				redirectUris: {
					description: "리다이렉트 URI 목록",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				loginUrl: {
					type: "string",
					nullable: true,
					description: "로그인 화면 URL",
				},
				defaultReturnTo: {
					type: "string",
					nullable: true,
					description: "인증 성공 후 기본 복귀 URL",
				},
				grantTypes: {
					description: "허용된 Grant 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				responseTypes: {
					description: "응답 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				tokenEndpointAuthMethod: {
					type: "string",
					description: "토큰 엔드포인트 인증 방식",
					maxLength: 50,
				},
				scope: {
					type: "string",
					description: "허용된 스코프",
				},
				isFirstParty: {
					type: "boolean",
					description: "First-party 클라이언트 여부",
				},
				loginUi: {
					type: "object",
					description: "로그인 화면 표시 설정",
					additionalProperties: true,
					nullable: true,
				},
				logoUri: {
					type: "string",
					nullable: true,
					description: "로고 URI",
				},
				policyUri: {
					type: "string",
					nullable: true,
					description: "정책 URI",
				},
				tosUri: {
					type: "string",
					nullable: true,
					description: "서비스 약관 URI",
				},
				skipConsent: {
					type: "boolean",
					description: "권한 동의 화면 생략 여부",
				},
			},
			required: [
				"clientId",
				"name",
				"redirectUris",
				"grantTypes",
				"responseTypes",
				"tokenEndpointAuthMethod",
				"scope",
				"isFirstParty",
			],
		},
		UpdateOidcClientDto: {
			type: "object",
			properties: {
				clientSecret: {
					type: "string",
					nullable: true,
					description: "클라이언트 시크릿",
				},
				name: {
					type: "string",
					description: "클라이언트 이름",
					maxLength: 128,
				},
				redirectUris: {
					description: "리다이렉트 URI 목록",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				loginUrl: {
					type: "string",
					nullable: true,
					description: "로그인 화면 URL",
				},
				defaultReturnTo: {
					type: "string",
					nullable: true,
					description: "인증 성공 후 기본 복귀 URL",
				},
				grantTypes: {
					description: "허용된 Grant 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				responseTypes: {
					description: "응답 타입",
					each: true,
					type: "array",
					items: {
						type: "string",
					},
				},
				tokenEndpointAuthMethod: {
					type: "string",
					description: "토큰 엔드포인트 인증 방식",
					maxLength: 50,
				},
				scope: {
					type: "string",
					description: "허용된 스코프",
				},
				isFirstParty: {
					type: "boolean",
					description: "First-party 클라이언트 여부",
				},
				loginUi: {
					type: "object",
					description: "로그인 화면 표시 설정",
					additionalProperties: true,
					nullable: true,
				},
				logoUri: {
					type: "string",
					nullable: true,
					description: "로고 URI",
				},
				policyUri: {
					type: "string",
					nullable: true,
					description: "정책 URI",
				},
				tosUri: {
					type: "string",
					nullable: true,
					description: "서비스 약관 URI",
				},
				skipConsent: {
					type: "boolean",
					description: "권한 동의 화면 생략 여부",
				},
			},
		},
		InteractionClientDto: {
			type: "object",
			properties: {
				clientId: {
					type: "string",
					description: "클라이언트 ID",
				},
				name: {
					type: "string",
					description: "클라이언트 이름",
				},
				logoUri: {
					type: "string",
					description: "로고 URI",
				},
				loginUi: {
					type: "object",
					description: "로그인 화면 표시 설정",
					additionalProperties: true,
					nullable: true,
				},
			},
			required: ["clientId", "name"],
		},
		InteractionDataDto: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "인터랙션 유형 (login | consent)",
				},
				uid: {
					type: "string",
					description: "인터랙션 UID",
				},
				client: {
					description: "클라이언트 정보",
					nullable: true,
					allOf: [
						{
							$ref: "#/components/schemas/InteractionClientDto",
						},
					],
				},
				prompt: {
					type: "object",
					description: "프롬프트 정보",
					additionalProperties: true,
				},
				params: {
					type: "object",
					description: "파라미터",
					additionalProperties: true,
				},
				session: {
					type: "object",
					description: "세션 정보",
					additionalProperties: true,
				},
				isDev: {
					type: "boolean",
					description: "개발 모드 여부",
				},
			},
			required: ["type", "uid", "prompt", "params", "isDev"],
		},
		OidcLoginPayloadDto: {
			type: "object",
			properties: {
				email: {
					type: "string",
					example: "user@example.com",
					description: "사용자 이메일 주소",
				},
				password: {
					type: "string",
					example: "password123",
					description: "사용자 비밀번호",
				},
				remember: {
					type: "boolean",
					description: "로그인 상태 유지 여부",
					default: false,
				},
			},
			required: ["email", "password"],
		},
		LoginSuccessDto: {
			type: "object",
			properties: {
				redirectTo: {
					type: "string",
					description: "리다이렉트 URL",
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요 여부",
				},
			},
			required: ["redirectTo"],
		},
		LoginRecoveryActionDto: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "액션 코드",
				},
				label: {
					type: "string",
					description: "사용자 표시 라벨",
				},
				href: {
					type: "string",
					description: "이동 경로",
				},
			},
			required: ["type", "label"],
		},
		LoginErrorDto: {
			type: "object",
			properties: {
				error: {
					type: "string",
					description: "에러 코드",
				},
				displayMessage: {
					type: "string",
					description: "사용자 표시 메시지",
				},
				hint: {
					type: "string",
					description: "추가 안내 문구",
				},
				remainingAttempts: {
					type: "number",
					description: "남은 시도 횟수",
				},
				lockedUntil: {
					type: "string",
					description: "잠금 해제 시간 (ISO 8601)",
				},
				temporaryLockThreshold: {
					type: "number",
					description: "임시 잠금 임계값",
				},
				temporaryLockDurationMin: {
					type: "number",
					description: "임시 잠금 시간 (분)",
				},
				recoveryActions: {
					description: "사용 가능한 복구 액션",
					type: "array",
					items: {
						$ref: "#/components/schemas/LoginRecoveryActionDto",
					},
				},
			},
			required: ["error"],
		},
		ConsentResultDto: {
			type: "object",
			properties: {
				redirectTo: {
					type: "string",
					description: "리다이렉트 URL",
				},
			},
			required: ["redirectTo"],
		},
		AbortResultDto: {
			type: "object",
			properties: {
				redirectTo: {
					type: "string",
					description: "리다이렉트 URL",
				},
			},
			required: ["redirectTo"],
		},
		PasswordPolicyDto: {
			type: "object",
			properties: {
				minLength: {
					type: "number",
					description: "최소 길이",
				},
				maxLength: {
					type: "number",
					description: "최대 길이",
				},
				requireUppercase: {
					type: "boolean",
					description: "영문 대문자 필수 여부",
				},
				requireLowercase: {
					type: "boolean",
					description: "영문 소문자 필수 여부",
				},
				requireNumber: {
					type: "boolean",
					description: "숫자 필수 여부",
				},
				requireSpecial: {
					type: "boolean",
					description: "특수문자 필수 여부",
				},
				blockCommonPasswords: {
					type: "boolean",
					description: "흔한 비밀번호 차단 여부",
				},
				reuseLimit: {
					type: "number",
					description: "최근 비밀번호 재사용 제한 개수",
				},
			},
			required: [
				"minLength",
				"maxLength",
				"requireUppercase",
				"requireLowercase",
				"requireNumber",
				"requireSpecial",
				"blockCommonPasswords",
				"reuseLimit",
			],
		},
		ForgotPasswordResultDto: {
			type: "object",
			properties: {
				message: {
					type: "string",
					description: "응답 메시지",
				},
			},
			required: ["message"],
		},
		TokenValidationDto: {
			type: "object",
			properties: {
				valid: {
					type: "boolean",
					description: "토큰 유효 여부",
				},
				email: {
					type: "string",
					description: "이메일 주소",
				},
				reason: {
					type: "string",
					description: "유효하지 않은 이유",
				},
			},
			required: ["valid"],
		},
		ResetPasswordResultDto: {
			type: "object",
			properties: {
				message: {
					type: "string",
					description: "응답 메시지",
				},
			},
			required: ["message"],
		},
		ResetPasswordErrorDto: {
			type: "object",
			properties: {
				error: {
					type: "string",
					description: "에러 코드",
				},
			},
			required: ["error"],
		},
		OidcSessionDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					format: "int64",
				},
				key: {
					type: "string",
					description: "모델 키 (jti 또는 uid)",
				},
				modelType: {
					type: "string",
					description: "모델 타입 (AccessToken, RefreshToken, Session 등)",
				},
				grantId: {
					type: "string",
					description: "Grant ID (토큰 폐기용)",
				},
				uid: {
					type: "string",
					description: "세션 UID",
				},
				accountId: {
					type: "string",
					description: "계정 ID",
				},
				expiresAt: {
					format: "date-time",
					type: "string",
					nullable: true,
				},
				createdAt: {
					format: "date-time",
					type: "string",
				},
			},
			required: ["id", "key", "modelType", "expiresAt", "createdAt"],
		},
		OidcSessionStatsDto: {
			type: "object",
			properties: {
				totalCount: {
					type: "number",
					description: "전체 세션/토큰 수",
				},
				byModelType: {
					type: "object",
					description: "모델 타입별 건수",
					additionalProperties: {
						type: "number",
					},
					example: {
						Session: 5,
						AccessToken: 10,
						RefreshToken: 8,
					},
				},
			},
			required: ["totalCount", "byModelType"],
		},
		SecurityPolicyDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "ID",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성일",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "수정일",
				},
				key: {
					type: "string",
					description: "정책 키",
				},
				passwordMinLength: {
					type: "number",
					description: "최소 비밀번호 길이",
					min: 4,
					max: 128,
					minimum: 4,
					maximum: 128,
				},
				passwordRequireUppercase: {
					type: "boolean",
					description: "대문자 필수",
				},
				passwordRequireLowercase: {
					type: "boolean",
					description: "소문자 필수",
				},
				passwordRequireNumber: {
					type: "boolean",
					description: "숫자 필수",
				},
				passwordRequireSpecial: {
					type: "boolean",
					description: "특수문자 필수",
				},
				passwordExpirationDays: {
					type: "number",
					description: "비밀번호 만료 일수 (0=무제한)",
					min: 0,
					minimum: 0,
				},
				passwordReuseLimit: {
					type: "number",
					description: "비밀번호 재사용 제한 횟수",
					min: 0,
					minimum: 0,
				},
				temporaryLockThreshold: {
					type: "number",
					description: "일시 잠금 임계값",
					min: 1,
					minimum: 1,
				},
				temporaryLockDurationMin: {
					type: "number",
					description: "일시 잠금 시간 (분)",
					min: 1,
					minimum: 1,
				},
				permanentLockThreshold: {
					type: "number",
					description: "영구 잠금 임계값",
					min: 1,
					minimum: 1,
				},
				accessTokenTtlSec: {
					type: "number",
					description: "Access Token TTL (초)",
					min: 60,
					minimum: 60,
				},
				refreshTokenTtlSec: {
					type: "number",
					description: "Refresh Token TTL (초)",
					min: 60,
					minimum: 60,
				},
				sessionTtlSec: {
					type: "number",
					description: "세션 TTL (초)",
					min: 60,
					minimum: 60,
				},
				ipWhitelistEnabled: {
					type: "boolean",
					description: "IP 화이트리스트 활성화",
				},
				emailDomainWhitelistEnabled: {
					type: "boolean",
					description: "이메일 도메인 화이트리스트 활성화",
				},
				corsOriginWhitelistEnabled: {
					type: "boolean",
					description: "CORS Origin 화이트리스트 활성화",
				},
			},
			required: [
				"id",
				"createdAt",
				"key",
				"passwordMinLength",
				"passwordRequireUppercase",
				"passwordRequireLowercase",
				"passwordRequireNumber",
				"passwordRequireSpecial",
				"passwordExpirationDays",
				"passwordReuseLimit",
				"temporaryLockThreshold",
				"temporaryLockDurationMin",
				"permanentLockThreshold",
				"accessTokenTtlSec",
				"refreshTokenTtlSec",
				"sessionTtlSec",
				"ipWhitelistEnabled",
				"emailDomainWhitelistEnabled",
				"corsOriginWhitelistEnabled",
			],
		},
		UpdateSecurityPolicyDto: {
			type: "object",
			properties: {
				passwordMinLength: {
					type: "number",
					description: "최소 비밀번호 길이",
					min: 4,
					max: 128,
					minimum: 4,
					maximum: 128,
				},
				passwordRequireUppercase: {
					type: "boolean",
					description: "대문자 필수",
				},
				passwordRequireLowercase: {
					type: "boolean",
					description: "소문자 필수",
				},
				passwordRequireNumber: {
					type: "boolean",
					description: "숫자 필수",
				},
				passwordRequireSpecial: {
					type: "boolean",
					description: "특수문자 필수",
				},
				passwordExpirationDays: {
					type: "number",
					description: "비밀번호 만료 일수 (0=무제한)",
					min: 0,
					minimum: 0,
				},
				passwordReuseLimit: {
					type: "number",
					description: "비밀번호 재사용 제한 횟수",
					min: 0,
					minimum: 0,
				},
				temporaryLockThreshold: {
					type: "number",
					description: "일시 잠금 임계값",
					min: 1,
					minimum: 1,
				},
				temporaryLockDurationMin: {
					type: "number",
					description: "일시 잠금 시간 (분)",
					min: 1,
					minimum: 1,
				},
				permanentLockThreshold: {
					type: "number",
					description: "영구 잠금 임계값",
					min: 1,
					minimum: 1,
				},
				accessTokenTtlSec: {
					type: "number",
					description: "Access Token TTL (초)",
					min: 60,
					minimum: 60,
				},
				refreshTokenTtlSec: {
					type: "number",
					description: "Refresh Token TTL (초)",
					min: 60,
					minimum: 60,
				},
				sessionTtlSec: {
					type: "number",
					description: "세션 TTL (초)",
					min: 60,
					minimum: 60,
				},
				ipWhitelistEnabled: {
					type: "boolean",
					description: "IP 화이트리스트 활성화",
				},
				emailDomainWhitelistEnabled: {
					type: "boolean",
					description: "이메일 도메인 화이트리스트 활성화",
				},
				corsOriginWhitelistEnabled: {
					type: "boolean",
					description: "CORS Origin 화이트리스트 활성화",
				},
			},
		},
		IdpAccountAccessGrantFormOptionItemDto: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "옵션 값",
					example: "01J00000000000000000000000",
				},
				label: {
					type: "string",
					description: "옵션 라벨",
					example: "본사",
				},
				description: {
					type: "string",
					description: "보조 설명",
					example: "서울 강남구",
				},
			},
			required: ["value", "label"],
		},
		IdpAccountAccessGrantFormUiPathsDto: {
			type: "object",
			properties: {
				readOnlyPaths: {
					description: "읽기 전용 경로 목록",
					type: "array",
					items: {
						type: "string",
					},
				},
				hiddenPaths: {
					description: "숨김 경로 목록",
					type: "array",
					items: {
						type: "string",
					},
				},
				disabledPaths: {
					description: "비활성 경로 목록",
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			required: ["readOnlyPaths", "hiddenPaths", "disabledPaths"],
		},
		IdpAccountAccessGrantFormFieldMetaDto: {
			type: "object",
			properties: {
				label: {
					type: "string",
					description: "필드 라벨",
					example: "Space",
				},
			},
		},
		IdpAccountDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "사용자 ID",
					format: "int64",
				},
				name: {
					type: "string",
					description: "이름",
				},
				email: {
					type: "string",
					description: "이메일",
				},
				isActive: {
					type: "boolean",
					description: "활성 상태",
				},
				failedLoginAttempts: {
					type: "number",
					description: "로그인 실패 횟수",
				},
				isPermanentlyLocked: {
					type: "boolean",
					description: "영구 잠금 여부",
				},
				lockedUntil: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "일시 잠금 해제 시간",
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요 여부",
				},
				lastLoginAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 로그인 시간",
				},
				lastLoginIp: {
					type: "string",
					nullable: true,
					description: "마지막 로그인 IP",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "가입일",
				},
			},
			required: [
				"id",
				"name",
				"email",
				"isActive",
				"failedLoginAttempts",
				"isPermanentlyLocked",
				"mustChangePassword",
				"createdAt",
			],
		},
		IdpAccountAccessGrantDto: {
			type: "object",
			properties: {
				tenantId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "테넌트 ID",
					format: "int64",
				},
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "접근 대상 Space ID",
					format: "int64",
				},
				spaceName: {
					type: "string",
					description: "접근 대상 Space 이름",
				},
				spaceLabel: {
					type: "string",
					nullable: true,
					description: "접근 대상 Space 라벨",
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "부여된 Role ID",
					format: "int64",
				},
				roleName: {
					type: "string",
					description: "부여된 Role 식별자",
				},
				roleDisplayName: {
					type: "string",
					nullable: true,
					description: "부여된 Role 표시명",
				},
				grantedAt: {
					format: "date-time",
					type: "string",
					description: "권한 부여일",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "권한 변경일",
				},
			},
			required: [
				"tenantId",
				"spaceId",
				"spaceName",
				"roleId",
				"roleName",
				"grantedAt",
			],
		},
		IdpAccountDetailDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "사용자 ID",
					format: "int64",
				},
				name: {
					type: "string",
					description: "이름",
				},
				email: {
					type: "string",
					description: "이메일",
				},
				isActive: {
					type: "boolean",
					description: "활성 상태",
				},
				failedLoginAttempts: {
					type: "number",
					description: "로그인 실패 횟수",
				},
				isPermanentlyLocked: {
					type: "boolean",
					description: "영구 잠금 여부",
				},
				lockedUntil: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "일시 잠금 해제 시간",
				},
				mustChangePassword: {
					type: "boolean",
					description: "비밀번호 변경 필요 여부",
				},
				lastLoginAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 로그인 시간",
				},
				lastLoginIp: {
					type: "string",
					nullable: true,
					description: "마지막 로그인 IP",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "가입일",
				},
				accessGrants: {
					each: true,
					description: "계정에 부여된 Space/Role 접근 권한 목록",
					type: "array",
					items: {
						$ref: "#/components/schemas/IdpAccountAccessGrantDto",
					},
				},
			},
			required: [
				"id",
				"name",
				"email",
				"isActive",
				"failedLoginAttempts",
				"isPermanentlyLocked",
				"mustChangePassword",
				"createdAt",
				"accessGrants",
			],
		},
		IdpAccountAccessGrantFormBootstrapDto: {
			type: "object",
			properties: {
				mode: {
					type: "string",
					description: "폼 모드",
					enum: ["CREATE"],
					example: "CREATE",
				},
				defaultObject: {
					type: "object",
					description: "초기 폼 객체",
					additionalProperties: true,
				},
				options: {
					type: "object",
					description: "경로별 선택 옵션",
					additionalProperties: {
						type: "array",
						items: {
							$ref: "#/components/schemas/IdpAccountAccessGrantFormOptionItemDto",
						},
					},
				},
				ui: {
					description: "UI 제어 경로",
					allOf: [
						{
							$ref: "#/components/schemas/IdpAccountAccessGrantFormUiPathsDto",
						},
					],
				},
				fieldMeta: {
					type: "object",
					description: "경로별 필드 메타",
					additionalProperties: {
						$ref: "#/components/schemas/IdpAccountAccessGrantFormFieldMetaDto",
					},
				},
			},
			required: ["mode", "defaultObject", "options", "ui", "fieldMeta"],
		},
		GrantIdpAccountAccessDto: {
			type: "object",
			properties: {
				spaceId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "권한을 부여할 Space ID",
					format: "int64",
				},
				roleId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "부여할 Role ID",
					format: "int64",
				},
			},
			required: ["spaceId", "roleId"],
		},
		DashboardStatsDto: {
			type: "object",
			properties: {
				activeSessionCount: {
					type: "number",
					description: "활성 세션 수",
				},
				todaySuccessCount: {
					type: "number",
					description: "오늘 성공 건수",
				},
				todayFailureCount: {
					type: "number",
					description: "오늘 실패 건수",
				},
				todayLockedCount: {
					type: "number",
					description: "오늘 잠금 건수",
				},
				lockedAccountCount: {
					type: "number",
					description: "잠금 계정 수",
				},
				activeClientCount: {
					type: "number",
					description: "활성 클라이언트 수",
				},
			},
			required: [
				"activeSessionCount",
				"todaySuccessCount",
				"todayFailureCount",
				"todayLockedCount",
				"lockedAccountCount",
				"activeClientCount",
			],
		},
		LoginTrendItemDto: {
			type: "object",
			properties: {
				date: {
					type: "string",
					description: "날짜 (YYYY-MM-DD)",
				},
				successCount: {
					type: "number",
					description: "성공 건수",
				},
				failureCount: {
					type: "number",
					description: "실패 건수",
				},
			},
			required: ["date", "successCount", "failureCount"],
		},
		EmailVerificationStatus: {
			type: "string",
			enum: ["PENDING", "VERIFIED", "EXPIRED"],
			description: "상태",
		},
		EmailVerificationDto: {
			type: "object",
			properties: {
				id: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					description: "ID",
					format: "int64",
				},
				createdAt: {
					format: "date-time",
					type: "string",
					description: "생성일",
				},
				updatedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "수정일",
				},
				email: {
					type: "string",
					description: "이메일",
				},
				name: {
					type: "string",
					description: "이름",
				},
				status: {
					description: "상태",
					allOf: [
						{
							$ref: "#/components/schemas/EmailVerificationStatus",
						},
					],
				},
				expiresAt: {
					format: "date-time",
					type: "string",
					description: "만료 시각",
				},
				verifiedAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "인증 시각",
				},
				lastSentAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "마지막 발송 시각",
				},
				sendCount: {
					type: "number",
					description: "발송 횟수",
					min: 0,
					minimum: 0,
				},
				lastSendStatus: {
					type: "string",
					nullable: true,
					description: "마지막 발송 상태",
				},
				verifiedUserId: {
					type: "integer",
					pattern:
						"^(?:[1-9][0-9]{0,17}|(?:[1-8][0-9]{18}|9(?:[0-1][0-9]{17}|2(?:[0-1][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[0-1][0-9]{12}|2(?:0(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|8(?:0[0-7])))))))))))))))))))$",
					"x-runtime-type": "bigint",
					nullable: true,
					description: "인증 완료 사용자 ID",
					format: "int64",
				},
				canResend: {
					type: "boolean",
					description: "재발송 가능 여부",
				},
				resendAvailableAt: {
					format: "date-time",
					type: "string",
					nullable: true,
					description: "재발송 가능 시각",
				},
			},
			required: [
				"id",
				"createdAt",
				"email",
				"name",
				"status",
				"expiresAt",
				"sendCount",
				"canResend",
			],
		},
	},
};
