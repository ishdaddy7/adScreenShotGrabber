app.controller('JobCtrl', function(JobFactory, $scope, allJobs){
  $scope.allJobs = allJobs;
  console.log($scope.allJobs);
});
