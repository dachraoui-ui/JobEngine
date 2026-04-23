import os
import re

BASE_DIR = r"c:\Users\21627\Desktop\pfa\jobengine-backend\src\main\java\com\jobengine"

mapping = {
    "auth": ["AuthController", "AuthService", "LoginRequest", "RegisterRequest", "AuthResponse"],
    "user": ["AdminController", "UserController", "UserService", "User", "UserRepository", 
             "CandidateProfile", "CandidateProfileRepository", "RecruiterProfile", 
             "RecruiterProfileRepository", "UserResponse"],
    "job": ["JobController", "JobService", "Job", "JobRepository", "JobRequest", "JobResponse"],
    "application": ["ApplicationController", "ApplicationService", "Application", "ApplicationRepository", "StatusUpdateRequest"],
    "cv": ["CvController", "CvService", "Cv", "CvRepository"],
    "ai": ["MatchingController", "MatchingService"],
    "webhook": ["WebhookService"],
}

enums = ["Role", "Visibility", "JobType", "JobStatus", "ApplicationStatus", "ExperienceLevel"]
commons = ["ApiResponse", "GlobalExceptionHandler", "DuplicateResourceException", 
           "ResourceNotFoundException", "UnauthorizedException", "SecurityConfig", 
           "MongoConfig", "JwtTokenProvider", "JwtAuthenticationFilter", "CustomUserDetailsService"]

all_classes = {}
for pkg, classes in mapping.items():
    for c in classes:
        all_classes[c] = pkg

for e in enums:
    all_classes[e] = "common"
for c in commons:
    all_classes[c] = "common"

def get_pkg(cls_name):
    return all_classes.get(cls_name, "common")

# Now we need to sweep through all java files and replace:
# 1. import com.jobengine.dto.*; -> Add specific imports for anything referenced in this file
# 2. Add imports for ApiResponse etc if they are used but not imported
# Actually, the simplest way to fix wildcard imports is to remove them and add explicit imports for every recognized class used in the file.

def fix_imports():
    java_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        for f in files:
            if f.endswith(".java"):
                java_files.append(os.path.join(root, f))
                
    for filepath in java_files:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content
        
        # Remove wildcard imports
        content = re.sub(r'import com\.jobengine\.[a-z]+\.\*;\n', '', content)
        
        # We need to discover all words in the file that match our classes, and add their imports if they are not in the same package
        # current package:
        pkg_match = re.search(r'package com\.jobengine\.([a-z]+);', content)
        current_pkg = pkg_match.group(1) if pkg_match else "common"
        
        # identify words
        words = set(re.findall(r'\b[A-Z][a-zA-Z0-9_]+\b', content))
        
        required_imports = set()
        for word in words:
            if word in all_classes:
                target_pkg = all_classes[word]
                if target_pkg != current_pkg:
                    required_imports.add(f"import com.jobengine.{target_pkg}.{word};")
        
        # Remove old wrong explicit imports
        content = re.sub(r'import com\.jobengine\.(dto|model|repository|service|controller|exception|security|config|model\.enums)\.[A-Za-z]+;\n', '', content)
        content = re.sub(r'import com\.jobengine\.dto;\n', '', content)
        
        # Add required imports to the top, after package declaration
        if required_imports:
            imports_str = "\n".join(sorted(list(required_imports))) + "\n"
            content = re.sub(r'(package [a-z0-9.]+;\n)', r'\1\n' + imports_str, content)
            
        if content != original_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed imports for {os.path.basename(filepath)}")

if __name__ == "__main__":
    fix_imports()
