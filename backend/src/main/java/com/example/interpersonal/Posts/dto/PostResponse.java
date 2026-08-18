package com.example.interpersonal.Posts.dto;

import com.example.interpersonal.Posts.Post;
import com.example.interpersonal.User.User;

public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorUsername;
    private String authorName;

    public PostResponse(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();

        User author = post.getAuthor();

        this.authorId = author.getId();
        this.authorUsername = author.getUsername();
        this.authorName = author.getName();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public String getAuthorName() {
        return authorName;
    }
}