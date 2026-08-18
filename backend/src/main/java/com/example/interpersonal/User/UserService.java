package com.example.interpersonal.User;

import com.example.interpersonal.User.dto.RegisterUserRequest;
import com.example.interpersonal.User.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegisterUserRequest request) {

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getUsername(),
                request.getName(),
                encodedPassword
        );

        userRepository.save(user);
    }

    public List<UserResponse> showAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUserByUsername(String username) {
        userRepository.deleteByUsername(username);
    }

    public List<UserResponse> addFriend(String username, String friendUsername) {
        User user = userRepository.findByUsername(username);
        User friend = userRepository.findByUsername(friendUsername);

        user.addFriend(friend);
        userRepository.save(user);

        return user.getFriends()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    public List<UserResponse> removeFriend(String username, String friendUsername) {
        User user = userRepository.findByUsername(username);
        User friend = userRepository.findByUsername(friendUsername);

        user.removeFriend(friend);
        userRepository.save(user);

        return user.getFriends()
                .stream()
                .map(UserResponse::new)
                .toList();
    }
}