
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './qcmList.html'
import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'
class QcmListCtrl{
    constructor($scope){
        $scope.viewModel(this);
       var x=0;
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
            Meteor.call('removeQcm',this.qcm._id)
            x++;
            console.log(x)
        },
        $scope.addQcm=function(){
            Meteor.call('insertQcm',{text:$scope.qcm.title,createdAt:new Date,theme_id:$scope.theme.title,module_id:$scope.module.id})
        }
    }
}

export default angular.module('qcmList', [

    angularMeteor

])
    .component('qcmList',{
        templateUrl:template,
        controller:['$scope',QcmListCtrl]
    })

