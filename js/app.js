function PostCtrl($scope) {
    var FIREBASE_POSTS = 'https://improbanews.firebaseIO.com/posts/'
    var remoteLinks = new Firebase(FIREBASE_POSTS);
    var firstTime = true;
    $scope.posts=[]

    remoteLinks.limit(100).on('child_added', function(childItem) {
        var post = childItem.val();
        post.ref = childItem.ref() + "";

        $scope.posts.push(post);    
		$scope.$digest();
    });

    $scope.postPriority = function(postA) {
		// post priority = upvote - (age * decayRate)
		var postAgeA = (new Date().getTime() - postA.timestamp) / 86400000;
		return postA.upvote - postAgeA * 2;   
	}

    $scope.submitPost = function() {
        var date = new Date();
        $scope.post.timestamp = date.getTime();
        $scope.post.timeString = date.toLocaleString();
        $scope.post.upvote = 1;
        remoteLinks.push().setWithPriority($scope.post, -1.0 * date.getTime());
        $scope.post = {};
    }

    $scope.upvote = function(post) {
        var remotePost = new Firebase(post.ref);
        remotePost.child('upvote').set(post.upvote + 1);
        alert("Vote received!")
    }

    $scope.upgradeRemotePostJson = function(post) {
        var remotePost = new Firebase(post.ref);
        alert(remotePost.child('upvote'));
        var upgradedPost = []
        upgradedPost.link = post.link;
        upgradedPost.timeString = post.timestamp;
        upgradedPost.timestamp = new Date().getTime();
        upgradedPost.title = post.title;
        upgradedPost.upvote = 1;
        upgradedPost.user = post.user;
        remotePost.set(upgradedPost);
    }
}

