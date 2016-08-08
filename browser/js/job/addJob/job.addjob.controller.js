app.controller('AddJobCtrl', function($scope, $state, JobFactory){

  $scope.jobDetails = [{id: 'jobDetail1'},{id: 'jobDetail2'}];

  $scope.addJobDetail = function(){
    var newJobDetail = $scope.jobDetails.length+1;
    $scope.jobDetails.push({'id': 'jobDetail' + newJobDetail});
  }

  $scope.removeJobDetail = function(){
    $scope.jobDetails.splice($scope.jobDetails.length-1);
  }

  $scope.submitJobForm = function(){
    console.log('clicked');
    console.log($scope.job)
  }
});
