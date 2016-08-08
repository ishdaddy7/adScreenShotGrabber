app.factory('JobFactory', function($http){
  function getData (obj) {
    return obj.data;
  }

  return {
    fetchAll: function(){
      return $http.get('/api/job')
      .then(getData);
    },

    fetchById: function(id){
      return $http.get('/api/job' + id)
      .then(getData);
    },

    updateJob: function(id, updatedJob) {
      return $http.put('/api/job' + id, updatedJob)
      .then(getData);
    },

    createJob: function(id, job){
      return $http.post('/api/job' + id, job)
      .then(getData);
    }
  }
});
