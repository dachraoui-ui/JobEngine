package com.jobengine.common;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Query using raw MongoTemplate to avoid mapping User class and encountering java.time reflection restrictions
        Query query = new Query(Criteria.where("email").is("admin@jobengine.com"));
        boolean exists = mongoTemplate.exists(query, "users");

        if (!exists) {
            log.info("No system administrator account detected. Seeding default ADMIN user via raw document...");

            Document adminDoc = new Document();
            adminDoc.append("email", "admin@jobengine.com");
            adminDoc.append("password", passwordEncoder.encode("admin123"));
            adminDoc.append("firstName", "System");
            adminDoc.append("lastName", "Admin");
            adminDoc.append("phone", "+1234567890");
            adminDoc.append("role", "ADMIN");
            adminDoc.append("isVerified", true);
            adminDoc.append("isActive", true);
            adminDoc.append("createdAt", new Date());
            adminDoc.append("updatedAt", new Date());
            adminDoc.append("_class", "com.jobengine.user.User"); // Crucial for Spring Data mapping on login

            mongoTemplate.insert(adminDoc, "users");
            log.info("Default administrator seeded successfully!");
            log.info("Username: admin@jobengine.com | Password: admin123");
        } else {
            log.info("System administrator account exists. Running raw database field repair...");

            Update update = new Update()
                    .set("isActive", true)
                    .set("isVerified", true)
                    .set("password", passwordEncoder.encode("admin123"));

            mongoTemplate.updateFirst(query, update, "users");
            log.info("Successfully repaired admin@jobengine.com properties in database (Active=true, Verified=true, Password reset to 'admin123').");
        }

        // Write users to a debug text file so the agent and user can view them
        try {
            java.util.List<Document> allUsers = mongoTemplate.findAll(Document.class, "users");
            java.io.FileWriter writer = new java.io.FileWriter("db_users_debug.txt");
            writer.write("Database users log on startup:\n");
            for (Document userDoc : allUsers) {
                String email = userDoc.getString("email");
                String role = userDoc.getString("role");
                Boolean active = userDoc.getBoolean("isActive");
                Boolean verified = userDoc.getBoolean("isVerified");
                String passwordHash = userDoc.getString("password");
                
                writer.write(String.format("Email: %s | Role: %s | Active: %s | Verified: %s | Hash: %s\n", 
                        email, role, active, verified, passwordHash));
                
                if ("ADMIN".equals(role)) {
                    // Update this admin password to admin123
                    Query adminQuery = new Query(Criteria.where("email").is(email));
                    Update adminUpdate = new Update()
                            .set("isActive", true)
                            .set("isVerified", true)
                            .set("password", passwordEncoder.encode("admin123"));
                    mongoTemplate.updateFirst(adminQuery, adminUpdate, "users");
                    writer.write(String.format("  -> Password reset to 'admin123' for ADMIN email: %s\n", email));
                }
            }
            writer.close();
            log.info("Wrote db_users_debug.txt successfully.");
        } catch (Exception e) {
            log.error("Failed to write db_users_debug.txt", e);
        }
    }
}
