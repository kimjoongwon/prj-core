import superjson from "superjson";

type SerializedQueryCacheData = ReturnType<typeof superjson.serialize>;

export function serializeQueryCacheData(queryCacheData: unknown) {
	return superjson.serialize(queryCacheData);
}

export function deserializeQueryCacheData(
	serializedQueryCacheData: unknown,
): unknown {
	return superjson.deserialize(
		serializedQueryCacheData as SerializedQueryCacheData,
	);
}
