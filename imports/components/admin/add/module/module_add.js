
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

        $scope.addTheme=function(){
            Meteor.call('insertTheme',{text:this.theme.text})
        }
        $scope.addModule=function(){
            Meteor.call('insertModule',{text:this.module.text,theme_id:this.theme.id,tag:this.module.tag})
            this.module.text="";
            this.module.tag="";
            this.theme.id="";
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

