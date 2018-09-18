
angular.module('gitapi', []).controller('GitApiController', function($scope, $http) {
	$scope.RepoIssues = [];					//container for results
	$scope.RepoIssuesPrettyDebug = "";		//container for results as string
	
	$scope.getIssues = function() {
		getIssues(function(data){
			$scope.RepoIssues=data; 
			$scope.RepoIssuesPrettyDebug = JSON.stringify(data, null, 2);
		});
	};
	
	$scope.getIssues();			//initialize
	
	function getIssues(callback) {
		var owner = $('#owner').val();
		var repo = $('#repo').val();
		$scope.owner = owner;
		$scope.repo = repo;
		
		//for the url
		var urlBase = 'https://api.github.com/';
		var urlUser   = urlBase + 'users/' + owner;
		var urlUserRepos  = urlUser + '/repos';
		var urlRepoIssues = urlBase + 'repos/' + owner + '/' + repo + '/issues';
		
		//link to DOM objects
		var ownerInput = angular.element(document.querySelector('#owner'));
		var repoInput = angular.element(document.querySelector('#repo'));
		var sinceInput = angular.element(document.querySelector('#since'));
		var errorFeedback = angular.element(document.querySelector('#errorFeedback'));
		
		//Account for first visit default date (do to poor input type="date" support)
		try {
			var sinceDate = new Date(sinceInput.val()).toISOString();
		}
		catch(err) {
			var todayMinusSeven = new Date();
			todayMinusSeven.setDate( todayMinusSeven.getDate() - 7 );
			var sinceDate = todayMinusSeven.toISOString();

		}
		
		//Angular Ajax call to git hub to gather issues
		$http({
			method: 'GET',
			url: urlRepoIssues,
			params: { 'since': sinceDate }
		}).then(
			//Success
			function(response) {
				ownerInput.addClass('is-valid').removeClass('is-invalid');
				repoInput.addClass('is-valid').removeClass('is-invalid');
				errorFeedback.html('');
				
				var data = response.data;
				callback(data);
			},
			//Fail
			function(response) {
				ownerInput.addClass('is-invalid').removeClass('is-valid');
				repoInput.addClass('is-invalid').removeClass('is-valid');
				errorFeedback.html("Results " + response.data.message);
				
				var data = [];
				callback(data);
			}
		);
	};
	
	//Provide all the data for a specific issue via modal
	$scope.GetDetails = function (index) {
		var issueDetails = $scope.RepoIssues[index];
		$scope.issueDetails = issueDetails;
	};

});
