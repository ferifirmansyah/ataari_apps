"use strict";
class TokenModel {
    constructor() {
        this.userId = "";
        this.parentName = "";
        this.blToken = "";
        this.childBirthDate = null;
        this.childName = "";
        this.childGender = "";
    }
    setUserId(userId) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }
    setParentName(parentname) {
        this.parentName = parentname;
    }
    getParentName() {
        return this.parentName;
    }
    setBLToken(bl_token) {
        this.blToken = bl_token;
    }
    getBLToken() {
        return this.blToken;
    }
    setChildName(childname) {
        this.childName = childname;
    }
    getChildName() {
        return this.childName;
    }
    setChildGender(childgender) {
        this.childGender = childgender;
    }
    getChildGender() {
        return this.childGender;
    }
    setChildBirthDate(childbd) {
        this.childBirthDate = childbd;
    }
    getChildBirthDate() {
        return this.childBirthDate;
    }
}
exports.TokenModel = TokenModel;
//# sourceMappingURL=token.model.js.map