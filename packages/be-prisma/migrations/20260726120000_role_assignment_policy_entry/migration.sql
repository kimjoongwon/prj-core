-- Role이 소유하는 Policy 할당 관계의 이름을 RoleAssignment로 통일합니다.
ALTER TABLE "role_policies" RENAME TO "role_assignments";
ALTER TABLE "role_assignments" RENAME CONSTRAINT "role_policies_pkey" TO "role_assignments_pkey";
ALTER TABLE "role_assignments" RENAME CONSTRAINT "role_policies_role_id_fkey" TO "role_assignments_role_id_fkey";
ALTER TABLE "role_assignments" RENAME CONSTRAINT "role_policies_policy_id_fkey" TO "role_assignments_policy_id_fkey";
ALTER INDEX "role_policies_role_id_policy_id_key" RENAME TO "role_assignments_role_id_policy_id_key";
ALTER INDEX "role_policies_role_id_idx" RENAME TO "role_assignments_role_id_idx";
ALTER INDEX "role_policies_policy_id_idx" RENAME TO "role_assignments_policy_id_idx";
ALTER INDEX "role_policies_is_active_idx" RENAME TO "role_assignments_is_active_idx";

-- Policy가 소유하는 Ability 항목의 이름을 PolicyEntry로 통일합니다.
ALTER TABLE "policy_abilities" RENAME TO "policy_entries";
ALTER TABLE "policy_entries" RENAME CONSTRAINT "policy_abilities_pkey" TO "policy_entries_pkey";
ALTER TABLE "policy_entries" RENAME CONSTRAINT "policy_abilities_policy_id_fkey" TO "policy_entries_policy_id_fkey";
ALTER TABLE "policy_entries" RENAME CONSTRAINT "policy_abilities_ability_id_fkey" TO "policy_entries_ability_id_fkey";
ALTER INDEX "policy_abilities_policy_id_ability_id_key" RENAME TO "policy_entries_policy_id_ability_id_key";
ALTER INDEX "policy_abilities_policy_id_idx" RENAME TO "policy_entries_policy_id_idx";
ALTER INDEX "policy_abilities_ability_id_idx" RENAME TO "policy_entries_ability_id_idx";
