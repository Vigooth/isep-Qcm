
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from '../qcmChoose/qcmChoose.html';


import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'

class QcmChooseCtrl {

    constructor($scope) {
        $scope.viewModel(this);



        this.helpers({
            qcms(){
                    return Qcms.find({})

            },
            returnIdmodulee(){
                return Qcms.find({})

        },
            modules(){
                return Modules.find({})
            },
            themes(){
                return Themes.find({})
            }

        })

    }


}



export default angular.module('qcmChoose', [

    angularMeteor
])

    .component('qcmChoose', {

        templateUrl: template,

        controller:['$scope','$stateParams',QcmChooseCtrl]

    });

