package com.learning.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {
}
