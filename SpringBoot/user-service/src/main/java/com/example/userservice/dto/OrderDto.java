package com.example.userservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class OrderDto {
    private Long id;
    private Long userId;
    private String productName;
    private Double amount;
}
