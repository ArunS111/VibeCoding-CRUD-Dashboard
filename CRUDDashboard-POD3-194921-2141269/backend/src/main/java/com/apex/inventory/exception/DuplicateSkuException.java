package com.apex.inventory.exception;

public class DuplicateSkuException extends RuntimeException {
    public DuplicateSkuException(String sku) {
        super("An item with SKU '" + sku + "' already exists");
    }
}
