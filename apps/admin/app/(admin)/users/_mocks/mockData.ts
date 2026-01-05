/**
 * 회원 목록 페이지 목 데이터
 *
 * API가 배포되기 전까지 임시로 사용하는 데이터입니다.
 * API 배포 후 삭제하고 실제 API 훅으로 교체해야 합니다.
 *
 * TODO: API 배포 후 이 파일 삭제
 */

import type { Member, MemberStats } from "../_stores";

// 목 회원 데이터
export const MOCK_MEMBERS: Member[] = [
	{
		id: "1",
		seq: 1,
		name: "홍길동",
		email: "hong@example.com",
		phone: "010-1234-5678",
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z",
		removedAt: null,
		profiles: [
			{
				id: "p1",
				nickname: "gildong",
				avatarFileId: null,
			},
		],
		tenants: [
			{
				id: "t1",
				role: {
					id: "r1",
					name: "ADMIN",
				},
				space: {
					id: "s1",
					name: "메인 스페이스",
				},
			},
		],
	},
	{
		id: "2",
		seq: 2,
		name: "김철수",
		email: "kim@example.com",
		phone: "010-2345-6789",
		createdAt: "2025-01-02T00:00:00.000Z",
		updatedAt: "2025-01-02T00:00:00.000Z",
		removedAt: null,
		profiles: [
			{
				id: "p2",
				nickname: "chulsoo",
				avatarFileId: null,
			},
		],
		tenants: [
			{
				id: "t2",
				role: {
					id: "r2",
					name: "USER",
				},
				space: {
					id: "s1",
					name: "메인 스페이스",
				},
			},
		],
	},
	{
		id: "3",
		seq: 3,
		name: "이영희",
		email: "lee@example.com",
		phone: "010-3456-7890",
		createdAt: "2025-01-03T00:00:00.000Z",
		updatedAt: "2025-01-03T00:00:00.000Z",
		removedAt: null,
		profiles: [
			{
				id: "p3",
				nickname: "younghee",
				avatarFileId: null,
			},
		],
		tenants: [
			{
				id: "t3",
				role: {
					id: "r2",
					name: "USER",
				},
				space: {
					id: "s1",
					name: "메인 스페이스",
				},
			},
		],
	},
	{
		id: "4",
		seq: 4,
		name: "박민수",
		email: "park@example.com",
		phone: "010-4567-8901",
		createdAt: "2024-12-15T00:00:00.000Z",
		updatedAt: "2024-12-15T00:00:00.000Z",
		removedAt: null,
		profiles: [
			{
				id: "p4",
				nickname: "minsu",
				avatarFileId: null,
			},
		],
		tenants: [
			{
				id: "t4",
				role: {
					id: "r3",
					name: "SUPER_ADMIN",
				},
				space: {
					id: "s1",
					name: "메인 스페이스",
				},
			},
		],
	},
	{
		id: "5",
		seq: 5,
		name: "최지은",
		email: "choi@example.com",
		phone: "010-5678-9012",
		createdAt: "2024-11-20T00:00:00.000Z",
		updatedAt: "2024-11-20T00:00:00.000Z",
		removedAt: null,
		profiles: [
			{
				id: "p5",
				nickname: "jieun",
				avatarFileId: null,
			},
		],
		tenants: [
			{
				id: "t5",
				role: {
					id: "r2",
					name: "USER",
				},
				space: {
					id: "s1",
					name: "메인 스페이스",
				},
			},
		],
	},
];

// 목 통계 데이터
export const MOCK_STATS: MemberStats = {
	total: 5,
	active: 4,
	inactive: 1,
	newThisMonth: 3,
};

// 목 페이지네이션 메타
export const MOCK_META = {
	total: 5,
	page: 1,
	limit: 20,
	totalPages: 1,
};
