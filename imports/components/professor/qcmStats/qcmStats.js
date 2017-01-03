
import angular from 'angular';

import angularMeteor from 'angular-meteor';
import template from './qcmStats.html'
import angularBootstrap from 'angular-ui-bootstrap';
import angularChart from 'angular-chart.js';

import {Questions} from '../../../api/questions'
import {Answers} from '../../../api/answers'
import {Themes} from '../../../api/themes'
import {Stats} from '../../../api/stats'

class QcmStatsCtrl{

    constructor($scope,$stateParams, $timeout) {
        'ngInject';
        $scope.viewModel(this);

        var qcmId = $stateParams.qcmId;
        const stats=Stats.findOne({qcm_id:qcmId});
        const questions = Questions.find({qcm_id: qcmId}, {sort: {createdAt: -1}});
        const answers = Answers.find({qcm_id: qcmId}, {sort: {created: -1}});
        const themes = Themes.find({});
        this.autorun(()=>{
            console.log(questions.fetch());
            console.log(stats);
           $scope.labels= getLabels(questions.count())
            console.log(questions.count());
            var data=[];
            var questionsFetched=questions.fetch()
            if(!!stats){
                for(var index in questionsFetched){
                    var question_id=questionsFetched[index]._id;
                    var nb_success=stats[question_id].nb_success;
                    var total=stats[question_id].total;
                    var pourcentage=0;
                    pourcentage=Math.round(nb_success*(100/total))
                    data.push(pourcentage)
                }
            }

            console.log(data)
$scope.data=[data]
        })
        function getLabels(nb_total_labels){
            var array=[];
            for(var i=1;i<=nb_total_labels;i++){
                array.push(i)
            }
            return array
        }
        //$scope.labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
        $scope.series = ['Essai 1'];
       // $scope.data = [
       //     [65, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40],
        //    [28, 48, 40, 19, 86, 27, 90, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40],

       // ];
        $scope.colors= ['#d82727','#c9c7f9'];
        $scope.options ={
            fontColor:'#27d835',
            elements: { rectangle: {
                borderWidth: 5,
            }},
            scales: {
                xAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: '% réussite',
                        fontSize:15
                    },
                    gridLines:{
                        //color:"#27d835",
                        zeroLineColor:"#000000",
                        borderDash:[0,0]
                    },
                    ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 25
                },
                    barThickness: 2
                }],
                yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: 'Questions',
                        fontSize:15
                    },
                    gridLines:{display:false,
                        //color:"#27d835",
                        zeroLineColor:"#000000",
                        borderDash:[0,0]
                    },
                    barThickness: 5,
                    ticks: {
                        //fontSize:9,
                        labelOffset:100,
                        max: 5,
                        min: 0,
                        stepSize: 0.5
                    }
                }]
            }};
        $scope.onClick = function (points, evt) {
            //window.location.href = "http://stackoverflow.com";
            console.log(points, evt);
            console.log(evt.clientX=800);
        };

        // Simulate async data update
      /*  $timeout(function () {
            $scope.data = [
                [65, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55, 40]
            ];
        }, 3000);*/
       /* new Chartist.Bar('.ct-chart', {
            labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '13', '14','1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12', '13', '14'],
            series: [
                [5, 4, 3, 7, 5, 10, 3,5, 4, 3, 7, 5, 10, 3,5, 4, 3, 7, 5, 10, 3,5, 4, 3, 7, 5, 10, 3],
                [3, 2, 9, 5, 4, 6, 4,5, 4, 3, 7, 5, 10, 3,5, 4, 3, 7, 5, 10, 3,5, 4, 3, 7, 5, 10, 3]
            ]
        }, {
            seriesBarDistance: 20,
            reverseData: true,
            horizontalBars: true,
            width: 300,
            height: 200,
            axisY: {
                offset: 10
            },
            axisX: {
                offset: 100
            }
        });*/
        
        this.helpers({
            questions(){
                return questions
            },
            answers(){
                return answers
            },
            themes(){
                return themes
            }

        });

    }}

export default angular.module('qcmStats', [

    angularMeteor,angularMeteor,angularChart


])  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#8f8bed','#c9c7f9'],
        responsive: true,
        defaultFontSize:2,
        defaultFontColor:'#f20707'

    });
    ChartJsProvider.setOptions('line', {
        showLines: true,
        showBars: true,
        defaultFontSize:2,
        defaultFontColor:'#f20707',
        barValueSpacing : 70,
        barDatasetSpacing : 30
        
    });
    // Configure all line charts
    ChartJsProvider.setOptions('QcmStats', {
        datasetFill: false,
        barShowStroke: false,
        scaleShowGridLines : false,
        barValueSpacing : 70,
        barDatasetSpacing : 30
    });
}])
    .component('qcmStats',{
        templateUrl:template,
        controller:['$scope','$stateParams','$timeout',QcmStatsCtrl]
    });

