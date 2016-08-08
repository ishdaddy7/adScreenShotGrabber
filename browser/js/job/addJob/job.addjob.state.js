app.config(function($stateProvider){
  $stateProvider.state('addJob', {
    url: '/job/addJob',
    templateUrl: 'js/job/addJob/job.addjob.html',
    controller: 'AddJobCtrl'
  });
});
