package com.example.interpersonal.Posts;

import com.example.interpersonal.Posts.dto.PostResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    //needs post find by title and or content

    @GetMapping("/all")
    public List<PostResponse> findAll() {
        return postService.findAllPosts();
    }

    @PostMapping("/create")
    public PostResponse create(
            @RequestParam String title,
            @RequestParam String content) {

        return postService.createPost(title, content);
    }

    @GetMapping("/byId")
    public PostResponse findById(@RequestParam Long id) {
        return postService.findPostById(id);
    }

    @GetMapping("/byAuthor")
    public List<PostResponse> findByAuthor(@RequestParam Long authorId) {
        return postService.findPostsByAuthorId(authorId);
    }

    @PatchMapping("/update")
    public PostResponse update(
            @RequestParam Long postId,
            @RequestParam String title,
            @RequestParam String content) {

        return postService.updatePost(postId, title, content);
    }

    @DeleteMapping("/delete")
    public void deleteById(@RequestParam Long id) {
        postService.deleteById(id);
    }
}