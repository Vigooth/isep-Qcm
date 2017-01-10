
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './themesModules_get.html';
import {Themes} from '../../../../api/themes'
import {Modules} from '../../../../api/modules'
import {Qcms} from '../../../../api/qcms'
class ThemesModulesCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        //Hover to display a delete button to remove a theme/module
        $scope.removeThemeBtn=false;
        $scope.removeModuleBtn=false;
        $scope.hide_btnRemoveTheme=function(){
            this.removeThemeBtn=false;
        };
        $scope.hide_btnRemoveModule=function(){
            this.removeModuleBtn=false;
        };
        $scope.setTheme=function(){
            Meteor.call('updateTheme',this.theme._id,this.theme.text);
        };

        $scope.setModuleTag=function(){
            Meteor.call('updateModuleTag',this.module._id,this.module.tag);

        };
        $scope.setModuleText=function(){
            Meteor.call('updateModuleText',this.module._id,this.module.text);

        };
        $scope.collapseAll=function(){
            $('.collapse').collapse('hide')
        };

        $scope.show_btnRemoveTheme=function() {
            this.removeThemeBtn = true;
        };
        $scope.show_btnRemoveModule=function(){
            this.removeModuleBtn=true;

        };


        $scope.getNumberOfQcm=function(){
            var module_id=this.module._id
            return Qcms.find({module_id:module_id}).count()

        };
        $scope.removeTheme=function(){
            var theme_id=this.theme._id;
            if(Modules.find({theme_id:theme_id}).count()!=0){
                alert("Vous ne pouvez pas supprimer une catégorie comprenant des modules")
            }else{
                if( confirm("Êtes-vous sûr de vouloir supprimer cette catégorie de cours?")) {
                    Meteor.call('removeTheme',theme_id)
                }}
        };
        $scope.removeModule=function(){
            if( confirm("Êtes-vous sûr de vouloir supprimer ce module?")) {
                Meteor.call('removeModule', this.module._id)
            }
        };

        this.helpers({

            themes:() =>{
                return Themes.find({},{sort:[['text','asc']]})
            },
            modules:() =>{
                return Modules.find({})
            }
        });

    }
}

export default angular.module('themesModulesGet', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('themesModulesGet',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',ThemesModulesCtrl]
    })

