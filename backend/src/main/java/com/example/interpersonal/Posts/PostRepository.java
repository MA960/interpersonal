package com.example.interpersonal.Posts;


import com.example.interpersonal.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByAuthorId(Long id);
    List<Post> findAllByAuthorInOrderByCreatedAtDesc(List<User> authors);
}