
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './myQcms.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '../../../../api/questions'
import {Answers} from '../../../../api/answers'
import {Themes} from '../../../../api/themes'
import {Qcms} from '../../../../api/qcms'
import {Modules} from '../../../../api/modules'
class MyQcmsCtrl{
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
        
        $scope.removeQcm=function(){
            Meteor.call('removeQcm',this.qcm._id);
        }
    }

}

export default angular.module('myQcms', [

    angularMeteor,angularMeteor

])
    .component('myQcms',{
        templateUrl:template,
        controller:['$scope','$stateParams',MyQcmsCtrl]
    })

