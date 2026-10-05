import { SpaceResourceScope } from "@cocrepo/type";
import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ApiExtension } from "@nestjs/swagger";

export const SPACE_SCOPE_KEY = "space_scope";
export const SPACE_RESOURCE_SCOPE_SWAGGER_EXTENSION = "x-space-resource-scope";

export { SpaceResourceScope };

const SpaceScopeMetadata = (scope: SpaceResourceScope) =>
	applyDecorators(
		SetMetadata(SPACE_SCOPE_KEY, scope),
		ApiExtension(SPACE_RESOURCE_SCOPE_SWAGGER_EXTENSION, scope),
	);

/** 현재 Space와 하위 Space 리소스를 사용합니다. */
export const WithDescendantSpaces = () =>
	SpaceScopeMetadata(SpaceResourceScope.WITH_DESCENDANTS);

/** 현재 Space와 상위 Space 리소스를 사용합니다. */
export const WithAncestorSpaces = () =>
	SpaceScopeMetadata(SpaceResourceScope.WITH_ANCESTORS);

/** 현재 Space와 상위/하위 Space 리소스를 모두 사용합니다. */
export const WithSpaceTree = () =>
	SpaceScopeMetadata(SpaceResourceScope.WITH_TREE);
