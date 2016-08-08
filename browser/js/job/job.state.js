app.config(function($stateProvider){
  $stateProvider.state('job', {
    url: '/job',
    templateUrl: 'js/job/job.html',
    controller: 'JobCtrl',
    resolve: {
      allJobs: function(JobFactory){
        return JobFactory.fetchAll();
      }
    }
  });
});
