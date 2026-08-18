package com.example.interpersonal.Posts;

import com.example.interpersonal.Posts.dto.PostResponse;
import com.example.interpersonal.User.User;
import com.example.interpersonal.User.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }



    public PostResponse createPost(String title, String content) {

        User author = getAuthenticatedUser();

        Post post = new Post(title, content, author);

        Post savedPost = postRepository.save(post);

        return new PostResponse(savedPost);
    }



    public PostResponse updatePost(
            Long postId,
            String title,
            String content) {

        User currentUser = getAuthenticatedUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own posts");
        }

        post.setTitle(title);
        post.setContent(content);

        Post updatedPost = postRepository.save(post);

        return new PostResponse(updatedPost);
    }



    public List<PostResponse> findAllPosts() {

        return postRepository.findAll()
                .stream()
                .map(PostResponse::new)
                .toList();
    }



    public PostResponse findPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return new PostResponse(post);
    }



    public List<PostResponse> findPostsByAuthorId(Long authorId) {

        return postRepository.findAllByAuthorId(authorId)
                .stream()
                .map(PostResponse::new)
                .toList();
    }



    public void deleteById(Long id) {

        User currentUser = getAuthenticatedUser();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }



    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        return user;
    }
}