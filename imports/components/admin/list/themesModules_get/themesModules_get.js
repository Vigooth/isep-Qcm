
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './themesModules_get.html';
import {Themes} from '../../../../api/themes'
import {Modules} from '../../../../api/modules'
class ThemesModulesCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        console.log(!Meteor.user());
        var user_type='';
        $scope.showDeletebutton=false;
        $scope.inputTheme=false;
        $scope.setTheme=function(){
            Meteor.call('updateThemes',this.theme._id,this.theme.text);
            this.inputTheme=!this.inputTheme;
        };
        $scope.setThemee=function(){
            this.inputTheme=!this.inputTheme;
        };
        $scope.collapsee=function(){
            $('.collapse').collapse('hide')
        };
        $scope.tumoi=function(){
            this.inputTheme=false;
            this.inputTheme=!this.inputTheme;
            $scope.showDeletebutton=true;

        };
        this.autorun(()=> {

            if (!Meteor.user()) {
                $state.go('home')
            } else {
                user_type = Meteor.user().profile.type;
            }
        });
        this.helpers({

            themes(){
                return Themes.find({},{sort:[['text','asc']]})
            },
            modules(){
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

