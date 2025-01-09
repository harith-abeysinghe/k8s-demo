package com.example.userservice;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final Logger logger = LogManager.getLogger(UserController.class);
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        logger.info("Get all users");
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        logger.info("Create user : {}", user);
        return userRepository.save(user);
    }
}

