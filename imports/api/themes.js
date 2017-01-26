import {Mongo} from 'meteor/mongo';
export const Themes=new Mongo.Collection('themes');
Themes.allow({
    insert(userId, themes) {
        return userId && themes.owner === userId;
    },
    update(userId, themes, fields, modifier) {
        return userId && themes.owner === userId;
    },
    remove(userId, themes) {
        return userId && themes.owner === userId;
    }
});