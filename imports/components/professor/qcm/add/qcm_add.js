
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './qcm_add.html'
import {Themes} from '../../../../api/themes'
import {Qcms} from '../../../../api/qcms'
import {Modules} from '../../../../api/modules'
class QcmAddCtrl{
    constructor($scope,$stateParams) {
        'ngInject';
        $scope.viewModel(this);
        this.helpers({
            qcms:() =>{
                return Qcms.find({})
            },
            modules:() =>{
                return Modules.find({})
            },
            themes:() =>{
                return Themes.find({})
            }

        });
    
        $scope.qcm={
            type:'training'
        };
            $scope.addQcm=function(){
                var mail=Meteor.user().emails[0].address;
                if(this.qcm.type=='training'){
                    Meteor.call('insertQcm',{text:this.qcm.title,createdAt:new Date,createdBy:mail,theme_id:this.theme.title,module_id:this.module.id,type:this.qcm.type,settings:{}})

                }else{
                    Meteor.call('insertQcm',{text:this.qcm.title,createdAt:new Date,createdBy:mail,theme_id:this.theme.title,module_id:this.module.id,type:this.qcm.type,settings:{duration:0,password:""}})

                }
                this.onSuccess=true;
                this.module.id={};
                this.theme.title="";
                this.qcm.title="";
                this.qcm.classTest=false;
            }
    }

}

export default angular.module('qcmAdd', [

    angularMeteor,angularMeteor

])
    .component('qcmAdd',{
        templateUrl:template,
        controller:['$scope','$stateParams',QcmAddCtrl]
    })

