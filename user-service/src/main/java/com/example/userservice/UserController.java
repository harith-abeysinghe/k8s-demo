package com.example.userservice;

import com.example.userservice.clients.OrderClient;
import com.example.userservice.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private static final Logger logger = LogManager.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final OrderClient orderClient;

    @GetMapping
    public List<User> getAllUsers() {
        logger.info("Get all users");
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        logger.info("Create user : {}", user.getName());
        return userRepository.save(user);
    }
    @GetMapping("/{userId}/orders")
    public List<OrderDto> getUserOrders(@PathVariable Long userId) {
        return orderClient.getOrdersByUserId(userId);
    }
}

