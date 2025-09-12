import { ROUTE_NAMES } from "@shared/vars";
export interface RouteBuilder {
	name?: string;
	relativePath?: string;
	params?: object;
	children?: RouteBuilder[];
	icon?: string;
}
export const rawRoutes: RouteBuilder[] = [
	{
		name: ROUTE_NAMES.ADMIN,
		relativePath: "admin",
		children: [
			{
				name: ROUTE_NAMES.AUTH,
				relativePath: "auth",
				children: [
					{
						name: ROUTE_NAMES.LOGIN,
						relativePath: "login",
						children: [
							{
								name: ROUTE_NAMES.TENANT_SELECT,
								relativePath: "tenant-select",
							},
						],
					},
				],
			},
			{
				name: ROUTE_NAMES.DASHBOARD,
				relativePath: "dashboard",
				icon: "LayoutDashboard",
				children: [
					{
						name: ROUTE_NAMES.USER_SERVICE,
						relativePath: "user-service",
						icon: "Users",
						children: [
							{
								name: ROUTE_NAMES.USERS,
								relativePath: "users",
							},
						],
					},
					{
						name: ROUTE_NAMES.SPACE_SERVICE,
						relativePath: "space-service",
						icon: "MapPin",
						children: [
							{
								name: ROUTE_NAMES.GROUNDS,
								relativePath: "grounds",
								icon: "Map",
								children: [
									{
										name: ROUTE_NAMES.GROUND,
										relativePath: ":groundId",
										icon: "MapPin",
										children: [
											{
												name: ROUTE_NAMES.GROUND_EDIT,
												relativePath: "edit",
												icon: "Edit",
											},
										],
									},
								],
							},
							{
								name: ROUTE_NAMES.CATEGORY,
								relativePath: "categories",
								icon: "Folder",
								children: [
									{
										name: ROUTE_NAMES.CATEGORY,
										relativePath: ":categoryId",
										icon: "FolderOpen",
										children: [
											{
												name: ROUTE_NAMES.CATEGORY,
												relativePath: "edit",
												icon: "Edit",
											},
											{
												name: ROUTE_NAMES.CATEGORY,
												relativePath: "add",
												icon: "Edit",
											},
										],
									},
								],
							},
							{
								name: ROUTE_NAMES.GROUPS,
								relativePath: "groups",
								icon: "Group",
								children: [
									{
										name: ROUTE_NAMES.GROUP,
										relativePath: ":groupId",
										icon: "Users",
										children: [
											{
												name: ROUTE_NAMES.GROUP_EDIT,
												relativePath: "edit",
												icon: "Edit",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
];
