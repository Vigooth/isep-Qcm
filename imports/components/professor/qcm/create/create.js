
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './create.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '../../../../api/questions'
import {Answers} from '../../../../api/answers'
import {Themes} from '../../../../api/themes'
import {Qcms} from '../../../../api/qcms'
import {Modules} from '../../../../api/modules'
class CreateCtrl{
    constructor($scope,$stateParams) {
        'ngInject';
        $scope.viewModel(this);
        this.helpers({
            qcms(){
                return Qcms.find({})
            },
            modules(){
                return Modules.find({})
            },
            themes(){
                return Themes.find({})
            }

        });
    
            $scope.addQcm=function(){
                Meteor.call('insertQcm',{text:this.qcm.title,createdAt:new Date,theme_id:this.theme.title,module_id:this.module.id})
                this.onSuccess=true;
                this.module.id={};
                this.theme.title="";
                this.qcm.title="";
            }
    }

}

export default angular.module('create', [

    angularMeteor,angularMeteor

])
    .component('create',{
        templateUrl:template,
        controller:['$scope','$stateParams',CreateCtrl]
    })

