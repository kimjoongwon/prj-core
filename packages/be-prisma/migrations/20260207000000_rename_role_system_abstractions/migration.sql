-- Role name 변경
UPDATE "roles" SET "name" = 'FULL_ACCESS', "display_name" = '전체 접근', "description" = '시스템의 모든 권한을 가진 전체 접근 역할' WHERE "name" = 'SUPER_ADMIN';
UPDATE "roles" SET "name" = 'MANAGE', "display_name" = '관리', "description" = '관리 업무를 수행하는 역할' WHERE "name" = 'ADMIN';
UPDATE "roles" SET "name" = 'VIEW', "display_name" = '조회', "description" = '기본 조회 역할' WHERE "name" = 'USER';

-- Category name 변경 (type = 'Role')
UPDATE "categories" SET "name" = '플랫폼' WHERE "name" = '루트' AND "type" = 'Role';
UPDATE "categories" SET "name" = '공유' WHERE "name" = '공통' AND "type" = 'Role';
UPDATE "categories" SET "name" = '워크스페이스' WHERE "name" = '관리자' AND "type" = 'Role';
UPDATE "categories" SET "name" = '공개' WHERE "name" = '사용자' AND "type" = 'Role';
UPDATE "categories" SET "name" = '프로젝트' WHERE "name" = '매니저' AND "type" = 'Role';

-- Group name 변경 (type = 'Role')
UPDATE "groups" SET "name" = '신뢰' WHERE "name" = '루트' AND "type" = 'Role';
UPDATE "groups" SET "name" = '일반' WHERE "name" = '일반' AND "type" = 'Role';
UPDATE "groups" SET "name" = '프리미엄' WHERE "name" = 'VIP' AND "type" = 'Role';
