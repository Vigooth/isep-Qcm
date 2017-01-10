
import  angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './module_add.html';
import {Themes} from '../../../../api/themes'
import {Modules} from '../../../../api/modules'

class ModuleAddCtrl{
    constructor($scope,$reactive,$state){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);
        console.log(!Meteor.user());
        var user_type='';
        this.autorun(()=> {

            if (!Meteor.user()) {
                $state.go('home')
            } else {
                user_type = Meteor.user().profile.type;

            }

        });
        $scope.addTheme=function(){
            Meteor.call('insertThemes',{text:this.theme.text})
        }
        $scope.addModule=function(){
            Meteor.call('insertModules',{text:this.module.text,theme_id:this.theme.id,module_id:this.module.code})
        }
        this.helpers({

            themes(){
                return Themes.find({})
            },
            modules(){
                return Modules.find({})
            }

        });
     
    }
}

export default angular.module('moduleAdd', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('moduleAdd',{
        templateUrl:template,
        controller:['$scope','$reactive','$state',ModuleAddCtrl]
    })

