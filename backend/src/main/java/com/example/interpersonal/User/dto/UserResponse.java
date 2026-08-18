package com.example.interpersonal.User.dto;

import com.example.interpersonal.User.User;

public class UserResponse {

    private Long id;
    private String username;
    private String name;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }
}