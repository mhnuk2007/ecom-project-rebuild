package com.learning.SpringEcom.controller;

import com.learning.SpringEcom.model.Product;
import com.learning.SpringEcom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product.getId() > 0) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        try {
            Product savedProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/product/generate-description")
    public ResponseEntity<String> generateDescription(@RequestParam String name, @RequestParam String category) {
        try {
            String description = productService.generateDescription(name, category);
            return new ResponseEntity<>(description, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/product/generate-image")
    public ResponseEntity<?> generateImage(@RequestParam String name, @RequestParam String category, @RequestParam String description) {
        try {
            byte[] aiImage = productService.generateImage(name, category, description);
            return new ResponseEntity<>(aiImage, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product.getId() > 0) {
            return new ResponseEntity<>(product.getImageData(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile) {

        Product existingProduct = productService.getProductById(id);
        if (existingProduct.getId() > 0) {
            try {
                Product updatedProduct = productService.addOrUpdateProduct(product, imageFile);
                return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        Product existingProduct = productService.getProductById(id);
        if (existingProduct.getId() > 0) {
            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        System.out.println("searching with " + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

}


