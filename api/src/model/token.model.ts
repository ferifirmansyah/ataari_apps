export class TokenModel{
    private userId: string;
    private blToken: string;
    private parentName: string;
    private childName: string;
    private childGender: string;
    private childBirthDate: Date;

    constructor(){
        this.userId="";
        this.parentName="";
        this.blToken = "";
        this.childBirthDate = null;
        this.childName = "";
        this.childGender = "";
    }
    setUserId(userId:string){
        this.userId = userId;
    }
    getUserId(){
        return this.userId;
    }
    setParentName(parentname:string){
        this.parentName = parentname;
    }
    getParentName(){
        return this.parentName;
    }
    setBLToken(bl_token:string){
        this.blToken = bl_token;
    }
    getBLToken(){
        return this.blToken;
    }
    setChildName(childname:string){
        this.childName = childname;
    }
    getChildName(){
        return this.childName;
    }
    setChildGender(childgender:string){
        this.childGender = childgender;
    }
    getChildGender(){
        return this.childGender;
    }
    setChildBirthDate(childbd:Date){
        this.childBirthDate = childbd;
    }
    getChildBirthDate(){
        return this.childBirthDate;
    }
}