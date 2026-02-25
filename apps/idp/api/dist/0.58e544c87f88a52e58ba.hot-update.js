"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 168:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const enum_1 = __webpack_require__(179);
const abstract_entity_1 = __webpack_require__(55);
class User extends abstract_entity_1.AbstractEntity {
    name;
    email;
    phone;
    password;
    failedLoginAttempts;
    isPermanentlyLocked;
    mustChangePassword;
    isActive;
    lockedUntil;
    passwordChangedAt;
    lastLoginAt;
    lastLoginIp;
    profiles;
    tenants;
    associations;
    passwordHistory;
    authAuditLogs;
    abilities;
    hasTenantAccess(tenantId) {
        if (!this.tenants)
            return false;
        return this.tenants.some((tenant) => tenant.id === tenantId);
    }
    isNotRemoved() {
        return this.removedAt === null;
    }
    isLocked() {
        if (this.isPermanentlyLocked)
            return true;
        if (this.lockedUntil && this.lockedUntil > new Date())
            return true;
        return false;
    }
    needsPasswordChange() {
        return this.mustChangePassword;
    }
    static fromDto(dto) {
        const user = new User();
        Object.assign(user, dto);
        return user;
    }
    isSuperManager() {
        return this.tenants?.some((tenant) => {
            const categoryName = tenant.space?.spaceClassification?.category?.name;
            return categoryName === enum_1.SpaceCategoryName.ROOT.name;
        }) ?? false;
    }
    get accessibleSpaceIds() {
        if (this.isSuperManager())
            return undefined;
        return this.tenants?.map((t) => t.spaceId).filter(Boolean) ?? [];
    }
    canAccessSpace(spaceId) {
        if (this.isSuperManager())
            return true;
        return this.tenants?.some((t) => t.spaceId === spaceId) ?? false;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("7f7cbd2cb6f3814398a7")
/******/ })();
/******/ 
/******/ }
;