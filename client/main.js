
import angular from 'angular';

import angularMeteor from 'angular-meteor';

import qcmList from '../imports/components/professor/qcmList/qcmList'
import qcmCreate from '../imports/components/professor/qcmCreate/qcmCreate'

import uiRouter from 'angular-ui-router';

angular.module('isep-qcm', [

  angularMeteor,
    uiRouter,
    qcmList.name,
    qcmCreate.name

]).config(config);

function config($stateProvider,$locationProvider,$urlRouterProvider){
  $stateProvider
      .state('qcmList',{
        url:"/qcm",
        templateUrl:qcmList,
        template:'<qcm-list></qcm-list>'
      })
      .state('qcmCreate',{
          url:"/qcm/:qcmId",
          templateUrl:qcmCreate,
          params:{'qcmId':['$stateParams',function($stateParams){
              return $stateParams.qcmId;
          }]},
          template:'<qcm-create></qcm-create>'
      });
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/qcm')
}