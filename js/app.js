function PostCtrl($scope) {
    var remoteLinks = new Firebase('https://improbanews.firebaseIO.com/posts/');
    var firstTime = true;

    remoteLinks.on('value', function(value) {
        $scope.posts = [];
        value.forEach(function(item) {
            $scope.posts.push(item.val());
        });
        if(firstTime) {
            $scope.$digest();
            firstTime = false;
        }
    });

    $scope.submitPost = function() {
        $scope.post.timestamp = new Date().toLocaleString();
        remoteLinks.push().setWithPriority($scope.post, -1.0 * new Date().getTime());
        $scope.post = {};
    }
}

