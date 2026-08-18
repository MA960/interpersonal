package com.example.interpersonal.User;

import com.example.interpersonal.User.dto.RegisterUserRequest;
import com.example.interpersonal.User.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }


    @GetMapping("/me")
    public UserResponse getCurrentUser(
            org.springframework.security.core.Authentication authentication
    ) {
        User user = userService.findByUsername(
                authentication.getName()
        );

        return new UserResponse(user);
    }

    //needs exceptions so find it out and make
    @PostMapping("/register")
    public void register(@Valid @RequestBody RegisterUserRequest request) {
        userService.registerUser(request);
    }

    @GetMapping("/allusers")
    public List<UserResponse> showAllUsers() {
        return userService.showAllUsers();
    }

    @DeleteMapping("/delete")
    public void deleteUserByUsername(@RequestParam String username) {
        userService.deleteUserByUsername(username);
    }

    @PostMapping("/addfriend")
    public List<UserResponse> addFriend(
            @RequestParam String username,
            @RequestParam String friendUsername
    ) {
        return userService.addFriend(username, friendUsername);
    }

    @DeleteMapping("/removefriend")
    public List<UserResponse> removeFriend(
            @RequestParam String username,
            @RequestParam String friendUsername
    ) {
        return userService.removeFriend(username, friendUsername);
    }
}