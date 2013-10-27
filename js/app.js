function PostCtrl($scope) {
    var FIREBASE_POSTS = 'https://improbanews.firebaseIO.com/posts/'
    var remoteLinks = new Firebase(FIREBASE_POSTS);
    var firstTime = true;
    $scope.posts=[]

    remoteLinks.on('child_added', function(childItem) {
        var post = childItem.val();
        post.ref = childItem.ref() + "";

        $scope.posts.push(post);    
        sortPosts();    
        $scope.$digest();
    });

    var sortPosts = function() {
        $scope.posts.sort(function(postA, postB) {
            // post priority = upvote - (age in days)
            var postAgeA = new Date(postA.timestamp).getDay();
            var postAgeB = new Date(postB.timestamp).getDay();
            var postPriorityA = postA.upvote - postAgeA;
            var postPriorityB = postB.upvote - postAgeB;
            var result = postPriorityB - postPriorityA;
            if (result == 0) {
                return postB.timestamp - postA.timestamp;
            }
            return result;
        });
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

