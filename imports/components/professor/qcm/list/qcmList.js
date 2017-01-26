
import  angular from 'angular';

import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './qcmList.html'
import {Qcms} from '/imports/api/qcms'
import {Modules} from '/imports/api/modules'
import {Themes} from '/imports/api/themes'

class QcmsCtrl{
    constructor($scope,$reactive){
        'ngInject';

        $scope.viewModel(this);
        $reactive(this).attach($scope);

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
   

    }
}

export default angular.module('qcms', [

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('qcms',{
        templateUrl:template,
        controller:['$scope','$reactive',QcmsCtrl]
    })

