"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = Array(53).concat([
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(58), exports);
__exportStar(__webpack_require__(59), exports);
__exportStar(__webpack_require__(60), exports);
__exportStar(__webpack_require__(61), exports);
__exportStar(__webpack_require__(62), exports);
__exportStar(__webpack_require__(63), exports);
__exportStar(__webpack_require__(64), exports);
__exportStar(__webpack_require__(65), exports);
__exportStar(__webpack_require__(66), exports);
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(68), exports);
__exportStar(__webpack_require__(69), exports);
__exportStar(__webpack_require__(70), exports);
__exportStar(__webpack_require__(71), exports);
__exportStar(__webpack_require__(72), exports);
__exportStar(__webpack_require__(73), exports);
__exportStar(__webpack_require__(74), exports);
__exportStar(__webpack_require__(75), exports);
__exportStar(__webpack_require__(76), exports);
__exportStar(__webpack_require__(77), exports);
__exportStar(__webpack_require__(78), exports);
__exportStar(__webpack_require__(79), exports);
__exportStar(__webpack_require__(80), exports);
__exportStar(__webpack_require__(81), exports);
__exportStar(__webpack_require__(152), exports);
__exportStar(__webpack_require__(153), exports);
__exportStar(__webpack_require__(154), exports);
__exportStar(__webpack_require__(155), exports);
__exportStar(__webpack_require__(156), exports);
__exportStar(__webpack_require__(157), exports);
__exportStar(__webpack_require__(158), exports);
__exportStar(__webpack_require__(159), exports);
__exportStar(__webpack_require__(160), exports);
__exportStar(__webpack_require__(161), exports);
__exportStar(__webpack_require__(162), exports);
__exportStar(__webpack_require__(163), exports);
__exportStar(__webpack_require__(164), exports);
__exportStar(__webpack_require__(165), exports);
__exportStar(__webpack_require__(166), exports);
__exportStar(__webpack_require__(167), exports);
__exportStar(__webpack_require__(168), exports);
__exportStar(__webpack_require__(169), exports);
__exportStar(__webpack_require__(170), exports);
__exportStar(__webpack_require__(171), exports);
__exportStar(__webpack_require__(172), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ability = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Ability extends abstract_entity_1.AbstractEntity {
    name;
    description;
    fields;
    conditions;
    inverted;
    reason;
    subjectId;
    actionId;
    priority;
    subject;
    action;
    grants;
    isAllowed() {
        return !this.inverted;
    }
    isDenied() {
        return this.inverted;
    }
    getActionName() {
        return this.action?.name ?? null;
    }
    isMaskingAbility() {
        return this.action?.isMaskingAction() ?? false;
    }
    getMaskingPreset() {
        return this.action?.getMaskingPreset() ?? null;
    }
}
exports.Ability = Ability;
//# sourceMappingURL=ability.entity.js.map

/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractEntity = void 0;
const class_transformer_1 = __webpack_require__(56);
class AbstractEntity {
    id;
    createdAt;
    updatedAt;
    removedAt;
    dtoClass;
    toDto(options) {
        console.warn("[DEPRECATED] toDto()는 deprecated되었습니다. DtoTransformInterceptor가 자동으로 변환을 처리합니다.");
        if (!this.dtoClass) {
            throw new Error("dtoClass가 설정되지 않았습니다. @UseDto 데코레이터를 사용하세요.");
        }
        return (0, class_transformer_1.plainToInstance)(this.dtoClass, this, options);
    }
}
exports.AbstractEntity = AbstractEntity;
//# sourceMappingURL=abstract.entity.js.map

/***/ }),
/* 56 */,
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Action = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Action extends abstract_entity_1.AbstractEntity {
    name;
    displayName;
    description;
    group;
    order;
    isSystem;
    config;
    abilities;
    getMaskingPreset() {
        if (!this.config || typeof this.config !== "object")
            return null;
        const cfg = this.config;
        if (cfg.type === "masking" && cfg.preset) {
            return cfg.preset;
        }
        return null;
    }
    getConfigType() {
        if (!this.config || typeof this.config !== "object")
            return null;
        const cfg = this.config;
        return cfg.type ?? null;
    }
    isMaskingAction() {
        return this.getConfigType() === "masking";
    }
    isCrudAction() {
        return this.group === "crud";
    }
    isVisibilityAction() {
        return this.group === "visibility";
    }
    getTypedConfig() {
        if (!this.config || typeof this.config !== "object")
            return null;
        return this.config;
    }
}
exports.Action = Action;
//# sourceMappingURL=action.entity.js.map

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Activity = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Activity extends abstract_entity_1.AbstractEntity {
    routineId;
    taskId;
    order;
    repetitions;
    restTime;
    notes;
    routine;
    task;
}
exports.Activity = Activity;
//# sourceMappingURL=activity.entity.js.map

/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Album = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Album extends abstract_entity_1.AbstractEntity {
    spaceId;
    name;
    sortOrder;
    description;
    coverAssetId;
    creatorId;
    space;
    coverAsset;
    creator;
    entries;
    getAssetCount() {
        return this.entries?.length ?? 0;
    }
    hasCover() {
        return this.coverAssetId !== null;
    }
}
exports.Album = Album;
//# sourceMappingURL=album.entity.js.map

/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlbumEntry = void 0;
const abstract_entity_1 = __webpack_require__(55);
class AlbumEntry extends abstract_entity_1.AbstractEntity {
    spaceId;
    albumId;
    assetId;
    position;
    caption;
    space;
    album;
    asset;
    hasCaption() {
        return this.caption !== null && this.caption.length > 0;
    }
}
exports.AlbumEntry = AlbumEntry;
//# sourceMappingURL=album-entry.entity.js.map

/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Asset = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Asset extends abstract_entity_1.AbstractEntity {
    spaceId;
    folderId;
    kind;
    status;
    originalName;
    storageKey;
    mimeType;
    sizeBytes;
    extension;
    checksum;
    metadata;
    creatorId;
    space;
    folder;
    creator;
    image;
    video;
    document;
    derivatives;
    albumEntries;
    coverOfAlbums;
    isReady() {
        return this.status === "READY";
    }
    isImage() {
        return this.kind === "IMAGE";
    }
    isVideo() {
        return this.kind === "VIDEO";
    }
    isDocument() {
        return this.kind === "DOCUMENT";
    }
    getExtension() {
        if (this.extension) {
            return this.extension.replace(/^\./, "");
        }
        const parts = this.originalName.split(".");
        return parts.length > 1 ? parts.pop() || "" : "";
    }
    getHumanReadableSize() {
        const bytes = Number(this.sizeBytes);
        if (bytes === 0)
            return "0 B";
        const units = ["B", "KB", "MB", "GB", "TB"];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = bytes / k ** i;
        return i === 0
            ? `${bytes} ${units[i]}`
            : `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
    }
}
exports.Asset = Asset;
//# sourceMappingURL=asset.entity.js.map

/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Assignment = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Assignment extends abstract_entity_1.AbstractEntity {
    roleId;
    tenantId;
    role;
    tenant;
}
exports.Assignment = Assignment;
//# sourceMappingURL=assignment.entity.js.map

/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthAuditLog = void 0;
class AuthAuditLog {
    id;
    createdAt;
    email;
    result;
    ipAddress;
    userId;
    failureReason;
    userAgent;
    clientId;
    isSuccess() {
        return this.result === "SUCCESS";
    }
    isLockedOut() {
        return this.result === "LOCKED";
    }
}
exports.AuthAuditLog = AuthAuditLog;
//# sourceMappingURL=auth-audit-log.entity.js.map

/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Category = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Category extends abstract_entity_1.AbstractEntity {
    name;
    type;
    tenantId;
    parentId;
    spaceId;
    creatorId;
    parent;
    children;
    space;
    creator;
    getAllParentNames() {
        const categoryNames = [];
        let currentCategory = this;
        while (currentCategory) {
            if (currentCategory.name) {
                categoryNames.push(currentCategory.name);
            }
            currentCategory = currentCategory.parent;
        }
        return categoryNames;
    }
    getAllChildrenNames() {
        const childrenNames = [];
        const collectChildrenNames = (category) => {
            if (category.children && category.children.length > 0) {
                for (const child of category.children) {
                    if (child.name) {
                        childrenNames.push(child.name);
                    }
                    collectChildrenNames(child);
                }
            }
        };
        collectChildrenNames(this);
        return childrenNames;
    }
    toOption() {
        return {
            key: this.id,
            value: this.id,
            text: this.name,
        };
    }
}
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map

/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Derivative = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Derivative extends abstract_entity_1.AbstractEntity {
    spaceId;
    assetId;
    kind;
    profile;
    storageKey;
    mimeType;
    sizeBytes;
    width;
    height;
    durationMs;
    space;
    asset;
    isThumbnail() {
        return this.kind === "THUMBNAIL";
    }
    isPreview() {
        return this.kind === "PREVIEW";
    }
    isTranscode() {
        return this.kind === "TRANSCODE";
    }
    isText() {
        return this.kind === "TEXT";
    }
    getHumanReadableSize() {
        const bytes = Number(this.sizeBytes);
        if (bytes === 0)
            return "0 B";
        const units = ["B", "KB", "MB", "GB", "TB"];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = bytes / k ** i;
        return i === 0
            ? `${bytes} ${units[i]}`
            : `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
    }
    getResolution() {
        if (this.width !== null && this.height !== null) {
            return `${this.width}x${this.height}`;
        }
        return null;
    }
}
exports.Derivative = Derivative;
//# sourceMappingURL=derivative.entity.js.map

/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Document = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Document extends abstract_entity_1.AbstractEntity {
    assetId;
    pageCount;
    wordCount;
    author;
    title;
    subject;
    keywords;
    asset;
    getContentCount() {
        if (this.pageCount !== null)
            return this.pageCount;
        if (this.wordCount !== null)
            return this.wordCount;
        return null;
    }
    getDocumentType() {
        if (this.pageCount !== null) {
            return "PDF";
        }
        if (this.wordCount !== null) {
            return "문서";
        }
        return "알 수 없음";
    }
    hasExtractedText() {
        return this.wordCount !== null && this.wordCount > 0;
    }
}
exports.Document = Document;
//# sourceMappingURL=document.entity.js.map

/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exercise = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Exercise extends abstract_entity_1.AbstractEntity {
    duration;
    count;
    taskId;
    description;
    imageFileId;
    videoFileId;
    name;
    task;
}
exports.Exercise = Exercise;
//# sourceMappingURL=exercise.entity.js.map

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.File = void 0;
const abstract_entity_1 = __webpack_require__(55);
class File extends abstract_entity_1.AbstractEntity {
    tenantId;
    parentId;
    spaceId;
    creatorId;
    size;
    mimeType;
    url;
    name;
    space;
    creator;
}
exports.File = File;
//# sourceMappingURL=file.entity.js.map

/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileAssociation = void 0;
const abstract_entity_1 = __webpack_require__(55);
class FileAssociation extends abstract_entity_1.AbstractEntity {
    groupId;
    fileId;
    file;
    group;
}
exports.FileAssociation = FileAssociation;
//# sourceMappingURL=file-association.entity.js.map

/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileClassification = void 0;
const abstract_entity_1 = __webpack_require__(55);
class FileClassification extends abstract_entity_1.AbstractEntity {
    categoryId;
    fileId;
    category;
    file;
}
exports.FileClassification = FileClassification;
//# sourceMappingURL=file-classification.entity.js.map

/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Folder = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Folder extends abstract_entity_1.AbstractEntity {
    spaceId;
    parentFolderId;
    name;
    path;
    sortOrder;
    creatorId;
    space;
    parent;
    children;
    creator;
    assets;
    isRoot() {
        return this.parentFolderId === null;
    }
    getDepth() {
        if (this.path === "/")
            return 0;
        return this.path.split("/").filter(Boolean).length;
    }
    isDescendantOf(folderId) {
        if (!this.parentFolderId)
            return false;
        if (this.parentFolderId === folderId)
            return true;
        if (this.parent) {
            return this.parent.isDescendantOf(folderId);
        }
        return false;
    }
}
exports.Folder = Folder;
//# sourceMappingURL=folder.entity.js.map

/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Grant = void 0;
const class_transformer_1 = __webpack_require__(56);
const ability_entity_1 = __webpack_require__(54);
const abstract_entity_1 = __webpack_require__(55);
class Grant extends abstract_entity_1.AbstractEntity {
    granteeType;
    granteeId;
    abilityId;
    isActive;
    priority;
    ability;
    isRoleGrant() {
        return this.granteeType === "Role";
    }
    isUserGrant() {
        return this.granteeType === "User";
    }
    isEnabled() {
        return this.isActive && this.removedAt === null;
    }
    isHighPriority() {
        return this.priority >= 10;
    }
    isRolePriority() {
        return this.priority >= 0 && this.priority < 10;
    }
}
exports.Grant = Grant;
__decorate([
    (0, class_transformer_1.Type)(() => ability_entity_1.Ability),
    __metadata("design:type", ability_entity_1.Ability)
], Grant.prototype, "ability", void 0);
//# sourceMappingURL=grant.entity.js.map

/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ground = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Ground extends abstract_entity_1.AbstractEntity {
    name;
    label;
    address;
    phone;
    email;
    businessNo;
    spaceId;
    logoImageFileId;
    imageFileId;
    space;
}
exports.Ground = Ground;
//# sourceMappingURL=ground.entity.js.map

/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Group = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Group extends abstract_entity_1.AbstractEntity {
    name;
    label;
    type;
    tenantId;
    spaceId;
    creatorId;
    space;
    creator;
}
exports.Group = Group;
//# sourceMappingURL=group.entity.js.map

/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Image = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Image extends abstract_entity_1.AbstractEntity {
    width;
    height;
    hasAlpha;
    assetId;
    orientation;
    colorSpace;
    asset;
    getAspectRatio() {
        if (this.height === 0)
            return 0;
        return this.width / this.height;
    }
    isLandscape() {
        return this.width > this.height;
    }
    isPortrait() {
        return this.height > this.width;
    }
    getResolution() {
        return `${this.width}x${this.height}`;
    }
    getMegapixels() {
        const pixels = this.width * this.height;
        return Math.round(pixels / 1_000_000);
    }
}
exports.Image = Image;
//# sourceMappingURL=image.entity.js.map

/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const abstract_entity_1 = __webpack_require__(55);
class OidcClient extends abstract_entity_1.AbstractEntity {
    clientId;
    clientSecret;
    clientName;
    redirectUris;
    grantTypes;
    responseTypes;
    tokenEndpointAuthMethod;
    scope;
    isActive;
    logoUri;
    policyUri;
    tosUri;
    isPublicClient() {
        return this.tokenEndpointAuthMethod === "none";
    }
    isConfidentialClient() {
        return this.tokenEndpointAuthMethod !== "none";
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-client.entity.js.map

/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcModel = void 0;
class OidcModel {
    id;
    createdAt;
    updatedAt;
    key;
    modelType;
    payload;
    expiresAt;
    userCode;
    grantId;
    uid;
    isExpired() {
        if (!this.expiresAt)
            return false;
        return this.expiresAt.getTime() < Date.now();
    }
}
exports.OidcModel = OidcModel;
//# sourceMappingURL=oidc-model.entity.js.map

/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PasswordHistory = void 0;
class PasswordHistory {
    id;
    createdAt;
    userId;
    passwordHash;
}
exports.PasswordHistory = PasswordHistory;
//# sourceMappingURL=password-history.entity.js.map

/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Profile = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Profile extends abstract_entity_1.AbstractEntity {
    avatarFileId;
    name;
    nickname;
    userId;
    user;
}
exports.Profile = Profile;
//# sourceMappingURL=profile.entity.js.map

/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Program = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Program extends abstract_entity_1.AbstractEntity {
    routineId;
    sessionId;
    instructorId;
    capacity;
    name;
    level;
    routine;
    session;
}
exports.Program = Program;
//# sourceMappingURL=program.entity.js.map

/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseEntity = exports.RESPONSE_EXTRA_KEYS = void 0;
const decorator_1 = __webpack_require__(82);
const common_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(39);
exports.RESPONSE_EXTRA_KEYS = [
    "stats",
    "filters",
    "actions",
    "aggregations",
    "summary",
];
class ResponseEntity {
    httpStatus;
    message;
    data;
    meta;
    stats;
    filters;
    actions;
    aggregations;
    summary;
    constructor(httpStatus, message, data, meta, extras) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.data = data;
        this.meta = meta;
        if (extras) {
            for (const key of exports.RESPONSE_EXTRA_KEYS) {
                if (extras[key] !== undefined) {
                    this[key] = extras[key];
                }
            }
        }
    }
    static WITH_SUCCESS(message) {
        return new ResponseEntity(common_1.HttpStatus.OK, message || "성공");
    }
    static WITH_ERROR(httpStatus, message, data) {
        return new ResponseEntity(httpStatus, message || "실패", data);
    }
    static WITH_ROUTE(data) {
        return new ResponseEntity(common_1.HttpStatus.OK, "성공", data);
    }
    from(data) {
        return new ResponseEntity(this.httpStatus, "성공", data, this.meta);
    }
}
exports.ResponseEntity = ResponseEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: common_1.HttpStatus,
    }),
    __metadata("design:type", Number)
], ResponseEntity.prototype, "httpStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResponseEntity.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "data", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Object, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "meta", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Object, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "stats", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Array, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "filters", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Array, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "actions", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Object, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "aggregations", void 0);
__decorate([
    (0, decorator_1.ClassField)(() => Object, { nullable: true, required: false }),
    __metadata("design:type", Object)
], ResponseEntity.prototype, "summary", void 0);
//# sourceMappingURL=response.entity.js.map

/***/ }),
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Role extends abstract_entity_1.AbstractEntity {
    name;
    displayName;
    description;
    isSystem;
}
exports.Role = Role;
//# sourceMappingURL=role.entity.js.map

/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleAssociation = void 0;
const abstract_entity_1 = __webpack_require__(55);
class RoleAssociation extends abstract_entity_1.AbstractEntity {
    roleId;
    groupId;
    group;
}
exports.RoleAssociation = RoleAssociation;
//# sourceMappingURL=role-association.entity.js.map

/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleClassification = void 0;
const abstract_entity_1 = __webpack_require__(55);
class RoleClassification extends abstract_entity_1.AbstractEntity {
    categoryId;
    roleId;
    category;
    role;
}
exports.RoleClassification = RoleClassification;
//# sourceMappingURL=role-classification.entity.js.map

/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Routine = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Routine extends abstract_entity_1.AbstractEntity {
    name;
    label;
    spaceId;
    creatorId;
    programs;
    activities;
}
exports.Routine = Routine;
//# sourceMappingURL=routine.entity.js.map

/***/ }),
/* 156 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityPolicy = void 0;
class SecurityPolicy {
    id;
    createdAt;
    updatedAt;
    key;
    passwordMinLength;
    passwordRequireUppercase;
    passwordRequireLowercase;
    passwordRequireNumber;
    passwordRequireSpecial;
    passwordExpirationDays;
    passwordReuseLimit;
    temporaryLockThreshold;
    temporaryLockDurationMin;
    permanentLockThreshold;
    accessTokenTtlSec;
    refreshTokenTtlSec;
    sessionTtlSec;
    ipWhitelistEnabled;
    emailDomainWhitelistEnabled;
    corsOriginWhitelistEnabled;
    getTemporaryLockDurationMs() {
        return this.temporaryLockDurationMin * 60 * 1000;
    }
    isPasswordExpirationEnabled() {
        return this.passwordExpirationDays > 0;
    }
}
exports.SecurityPolicy = SecurityPolicy;
//# sourceMappingURL=security-policy.entity.js.map

/***/ }),
/* 157 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Session = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Session extends abstract_entity_1.AbstractEntity {
    type;
    repeatCycleType;
    startDateTime;
    endDateTime;
    recurringDayOfWeek;
    timelineId;
    name;
    description;
    programs;
    timeline;
}
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map

/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Space = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Space extends abstract_entity_1.AbstractEntity {
    tenants;
    spaceClassifications;
    spaceAssociations;
    ground;
}
exports.Space = Space;
//# sourceMappingURL=space.entity.js.map

/***/ }),
/* 159 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpaceAssociation = void 0;
const abstract_entity_1 = __webpack_require__(55);
class SpaceAssociation extends abstract_entity_1.AbstractEntity {
    spaceId;
    groupId;
    group;
}
exports.SpaceAssociation = SpaceAssociation;
//# sourceMappingURL=space-association.entity.js.map

/***/ }),
/* 160 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpaceClassification = void 0;
const abstract_entity_1 = __webpack_require__(55);
class SpaceClassification extends abstract_entity_1.AbstractEntity {
    categoryId;
    spaceId;
    category;
    space;
}
exports.SpaceClassification = SpaceClassification;
//# sourceMappingURL=space-classification.entity.js.map

/***/ }),
/* 161 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subject = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Subject extends abstract_entity_1.AbstractEntity {
    name;
    displayName;
    icon;
    group;
    order;
    isSystem;
    abilities;
    isEntitySubject() {
        return this.name.startsWith("entity:");
    }
    isMenuSubject() {
        return this.name.startsWith("menu:");
    }
    isFeatureSubject() {
        return this.name.startsWith("feature:");
    }
    isUiSubject() {
        return this.name.startsWith("ui:");
    }
    getSubjectType() {
        if (this.isEntitySubject())
            return "entity";
        if (this.isMenuSubject())
            return "menu";
        if (this.isFeatureSubject())
            return "feature";
        if (this.isUiSubject())
            return "ui";
        return "unknown";
    }
    getSubjectName() {
        const parts = this.name.split(":");
        return parts.length > 1 ? parts.slice(1).join(":") : this.name;
    }
    getGroupColor() {
        switch (this.group) {
            case "entity":
                return "primary";
            case "menu":
                return "secondary";
            case "feature":
                return "success";
            case "ui":
                return "warning";
            default:
                return "default";
        }
    }
    getGroupLabel() {
        switch (this.group) {
            case "entity":
                return "엔티티";
            case "menu":
                return "메뉴";
            case "feature":
                return "기능";
            case "ui":
                return "UI 요소";
            default:
                return "기타";
        }
    }
}
exports.Subject = Subject;
//# sourceMappingURL=subject.entity.js.map

/***/ }),
/* 162 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Task extends abstract_entity_1.AbstractEntity {
    tenantId;
    spaceId;
    creatorId;
    space;
    creator;
    exercise;
    activities;
}
exports.Task = Task;
//# sourceMappingURL=task.entity.js.map

/***/ }),
/* 163 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Template = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Template extends abstract_entity_1.AbstractEntity {
    code;
    name;
    type;
    content;
    isActive;
    subject;
    description;
    variables;
    isEmail() {
        return this.type === "EMAIL";
    }
    isSms() {
        return this.type === "SMS";
    }
    isPush() {
        return this.type === "PUSH";
    }
    isEnabled() {
        return this.isActive && this.removedAt === null;
    }
    extractVariablePlaceholders() {
        const regex = /\{\{(\w+)\}\}/g;
        const placeholders = [];
        let match;
        match = regex.exec(this.content);
        while (match !== null) {
            placeholders.push(match[1]);
            match = regex.exec(this.content);
        }
        return [...new Set(placeholders)];
    }
    hasSubject() {
        return this.subject !== null && this.subject.length > 0;
    }
}
exports.Template = Template;
//# sourceMappingURL=template.entity.js.map

/***/ }),
/* 164 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateVariable = void 0;
class TemplateVariable {
    id;
    createdAt;
    updatedAt;
    name;
    isRequired;
    templateId;
    description;
    defaultValue;
    template;
    hasDefaultValue() {
        return this.defaultValue !== null && this.defaultValue.length > 0;
    }
    toPlaceholder() {
        return `{{${this.name}}}`;
    }
}
exports.TemplateVariable = TemplateVariable;
//# sourceMappingURL=template-variable.entity.js.map

/***/ }),
/* 165 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tenant = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Tenant extends abstract_entity_1.AbstractEntity {
    main;
    spaceId;
    userId;
    roleId;
    space;
    user;
    role;
}
exports.Tenant = Tenant;
//# sourceMappingURL=tenant.entity.js.map

/***/ }),
/* 166 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timeline = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Timeline extends abstract_entity_1.AbstractEntity {
    tenantId;
    spaceId;
    creatorId;
    name;
    description;
    space;
    creator;
    sessions;
}
exports.Timeline = Timeline;
//# sourceMappingURL=timeline.entity.js.map

/***/ }),
/* 167 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Translation = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Translation extends abstract_entity_1.AbstractEntity {
    languageCode;
    key;
    text;
    category;
    isTranslated;
    isCompleted() {
        return this.isTranslated;
    }
    belongsToCategory(category) {
        return this.category === category;
    }
    isLanguage(languageCode) {
        return this.languageCode === languageCode;
    }
    getKeyPrefix() {
        return this.key.split(":")[0] || "";
    }
    getKeyDepth() {
        return this.key.split(":").length;
    }
}
exports.Translation = Translation;
//# sourceMappingURL=translation.entity.js.map

/***/ }),
/* 168 */
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

/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserAssociation = void 0;
const abstract_entity_1 = __webpack_require__(55);
class UserAssociation extends abstract_entity_1.AbstractEntity {
    userId;
    groupId;
    group;
    user;
}
exports.UserAssociation = UserAssociation;
//# sourceMappingURL=user-association.entity.js.map

/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserClassification = void 0;
const abstract_entity_1 = __webpack_require__(55);
class UserClassification extends abstract_entity_1.AbstractEntity {
    categoryId;
    userId;
}
exports.UserClassification = UserClassification;
//# sourceMappingURL=user-classification.entity.js.map

/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Video = void 0;
const abstract_entity_1 = __webpack_require__(55);
class Video extends abstract_entity_1.AbstractEntity {
    width;
    height;
    durationMs;
    hasAudio;
    assetId;
    frameRate;
    codec;
    bitrate;
    asset;
    getDurationFormatted() {
        const totalSeconds = Math.floor(this.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    getDurationSeconds() {
        return Math.floor(this.durationMs / 1000);
    }
    getResolution() {
        return `${this.width}x${this.height}`;
    }
    getAspectRatio() {
        if (this.height === 0)
            return 0;
        return this.width / this.height;
    }
    isHD() {
        return this.height >= 720;
    }
    isFullHD() {
        return this.height >= 1080;
    }
    is4K() {
        return this.height >= 2160;
    }
}
exports.Video = Video;
//# sourceMappingURL=video.entity.js.map

/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhitelistEntry = void 0;
class WhitelistEntry {
    id;
    createdAt;
    updatedAt;
    type;
    value;
    isActive;
    description;
    isIpEntry() {
        return this.type === "IP";
    }
    isEmailDomainEntry() {
        return this.type === "EMAIL_DOMAIN";
    }
    isCorsOriginEntry() {
        return this.type === "CORS_ORIGIN";
    }
}
exports.WhitelistEntry = WhitelistEntry;
//# sourceMappingURL=whitelist-entry.entity.js.map

/***/ })
]);
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f15ff8effb7f2fde60f4")
/******/ })();
/******/ 
/******/ }
;