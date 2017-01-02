
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './settings.html'
import angularBootstrap from 'angular-ui-bootstrap';

import {Questions} from '../../../../api/questions'
import {Qcms} from '../../../../api/qcms'
import {Answers} from '../../../../api/answers'
import {Themes} from '../../../../api/themes'
class QcmSettingsCtrl{

    constructor($scope,$stateParams) {

        'ngInject';
        $scope.viewModel(this);
        $scope.qcmForClassroom=false;
        var qcmId = $stateParams.qcmId;
        this.autorun(()=> {
            $scope.qcm=Qcms.findOne({qcmId});

        })
            console.log(Qcms.findOne(qcmId))
console.log("ok")

        this.helpers({
            qcms(){
                var qcms=Qcms.findOne({_id:qcmId})
                if(!!qcms){
                    console.log(qcms.text)
                    console.log(qcms.module_id)

                    if(qcms.classTest){

                   }
                }
               return Qcms.find({_id:qcmId})},
            qcmss:(()=>{
                return Qcms.findOne({qcmId});

            })
        });
    
    }
}

export default angular.module('qcmSettings', [

    angularMeteor,angularMeteor,angularBootstrap

])
    .component('qcmSettings',{
        templateUrl:template,
        controller:['$scope','$stateParams',QcmSettingsCtrl]
    })

