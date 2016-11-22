import { Meteor } from 'meteor/meteor';

import {Modules} from '../imports/api/modules'

import {Themes} from '../imports/api/themes'



Meteor.startup(() => {

    console.log("a "+Modules.find({}).count())

    if(Themes.find({}).count()==0) {

        var themes = [

            "Informatique",

            "Telecom Réseaux",

            "Signal",

            "Electronique",

            "Langues et culture",

            "Formation managériale"];


        for (var x in themes) {

            var aa=themes[x];

            console.log(x+"  :   "+aa);

            Themes.insert(

                {text:aa}

            )

        }


        var modules=[{

            text:"Génie logiciel / Software Engineering",

            theme_id:Themes.findOne({text:"Informatique"})._id,

            module_id:'II.2405'},

            {text:"Technologies Web / Web Technologies",

                theme_id:Themes.findOne({text:"Informatique"})._id,

                module_id:'II.2306'},

            {text:"Anglais",

                theme_id:Themes.findOne({text:"Langues et culture"})._id,

                module_id:'II.2308'}];

        for (var index in modules) {

            var module=modules[index];



            Modules.insert(module);

        }

    }





    // code to run on server at startup

});