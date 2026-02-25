"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 53:
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

/***/ 60:
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

/***/ 66:
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

/***/ 69:
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

/***/ 72:
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

/***/ 155:
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

/***/ 162:
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

/***/ 166:
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

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("adab256eab5c4ae0a82b")
/******/ })();
/******/ 
/******/ }
;