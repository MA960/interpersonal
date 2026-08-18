package com.example.interpersonal.Feed;


import com.example.interpersonal.Posts.PostRepository;
import com.example.interpersonal.Posts.dto.PostResponse;
import com.example.interpersonal.User.User;
import com.example.interpersonal.Posts.Post;
import com.example.interpersonal.User.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    public FeedService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }



    public List<PostResponse> getFeed(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> friends = user.getFriends();

        List<Post> posts =
                postRepository.findAllByAuthorInOrderByCreatedAtDesc(friends);

        return posts.stream()
                .map(PostResponse::new)
                .toList();
    }


}
