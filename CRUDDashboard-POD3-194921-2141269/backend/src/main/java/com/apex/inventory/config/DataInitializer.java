package com.apex.inventory.config;

import com.apex.inventory.model.InventoryItem;
import com.apex.inventory.repository.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(InventoryRepository repo) {
        return args -> {
            if (repo.count() > 0) return;

            repo.saveAll(List.of(
                // Electronics
                item("Wireless Noise-Cancelling Headphones", "ELEC-001", "Electronics", "249.99", 42),
                item("Mechanical Keyboard TKL",              "ELEC-002", "Electronics", "129.99", 18),
                item("4K Webcam Pro",                        "ELEC-003", "Electronics",  "89.99",  7),
                item("USB-C Hub 7-in-1",                     "ELEC-004", "Electronics",  "49.99", 35),
                item("Portable SSD 1TB",                     "ELEC-005", "Electronics",  "99.99",  3),
                item("Smart LED Desk Lamp",                  "ELEC-006", "Electronics",  "59.99",  0),

                // Furniture
                item("Ergonomic Office Chair",               "FURN-001", "Furniture",   "399.99", 12),
                item("Standing Desk Converter",              "FURN-002", "Furniture",   "219.99",  5),
                item("Monitor Arm Dual Mount",               "FURN-003", "Furniture",    "79.99", 22),
                item("Under-Desk Cable Tray",                "FURN-004", "Furniture",    "24.99",  9),

                // Office Supplies
                item("Whiteboard 48x36",                     "OFFC-001", "Office Supplies", "89.99", 14),
                item("Ballpoint Pen Set (12-pack)",          "OFFC-002", "Office Supplies",  "8.99", 60),
                item("Sticky Notes Assorted (10-pack)",      "OFFC-003", "Office Supplies",  "6.49",  2),
                item("Stapler Heavy Duty",                   "OFFC-004", "Office Supplies", "19.99",  0),

                // Networking
                item("Wi-Fi 6 Router",                       "NETW-001", "Networking",  "179.99", 11),
                item("Network Switch 8-Port",                "NETW-002", "Networking",   "45.99",  6),
                item("Cat6 Ethernet Cable 50ft",             "NETW-003", "Networking",   "12.99", 80)
            ));
        };
    }

    private InventoryItem item(String name, String sku, String category, String price, int quantity) {
        return InventoryItem.builder()
                .name(name)
                .sku(sku)
                .category(category)
                .price(new BigDecimal(price))
                .quantity(quantity)
                .build();
    }
}
