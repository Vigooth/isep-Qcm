
import  angular from 'angular';

import angularMeteor from 'angular-meteor';
import angularBoostrap from 'angular-ui-bootstrap';
import template from './qcmList.html'
import {Qcms} from '../../../api/qcms'
import {Modules} from '../../../api/modules'
import {Themes} from '../../../api/themes'
class QcmListCtrl{
    constructor($scope){
        'ngInject';
        $scope.viewModel(this);
        $scope.alerts = [
            { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.addAlert = function() {
            $scope.alerts.push({msg: 'Another alert!'});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.options.minDate = $scope.options.minDate ? null : new Date();
        };

        $scope.toggleMin();

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };
        $scope.totalItems = 64;
        $scope.currentPage = 4;
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date(tomorrow);
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
  
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

    angularMeteor,angularBoostrap,'ui.bootstrap'

])
    .component('qcmList',{
        templateUrl:template,
        controller:['$scope',QcmListCtrl]
    })

