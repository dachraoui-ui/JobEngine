import os
import re
import shutil

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

# The rest goes to common (Enums, Config, Security, Exceptions, ApiResponse, etc)

def get_target_package(class_name):
    for pkg, classes in mapping.items():
        if class_name in classes:
            return pkg
    return "common"

def process_all():
    java_files = []
    
    # 1. Collect all java files
    for root, dirs, files in os.walk(BASE_DIR):
        for f in files:
            if f.endswith(".java") and f != "JobEngineApplication.java":
                java_files.append(os.path.join(root, f))
    
    print(f"Found {len(java_files)} java files.")

    # 2. Build import replacements map
    # Old import -> New import
    import_replacements = {}
    for file_path in java_files:
        class_name = os.path.basename(file_path).replace(".java", "")
        old_pkg = None
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("package "):
                    old_pkg = line.replace("package ", "").replace(";", "").strip()
                    break
        
        target_pkg_name = get_target_package(class_name)
        new_pkg = f"com.jobengine.{target_pkg_name}"
        
        if old_pkg:
            import_replacements[f"{old_pkg}.{class_name}"] = f"{new_pkg}.{class_name}"
            
    # Also handle the enums moving to common
    enum_files = ["Role", "Visibility", "JobType", "JobStatus", "ApplicationStatus", "ExperienceLevel"]
    for e in enum_files:
        import_replacements[f"com.jobengine.model.enums.{e}"] = f"com.jobengine.common.{e}"

    # 3. Create target directories
    target_dirs = set(mapping.keys()) | {"common"}
    for td in target_dirs:
        os.makedirs(os.path.join(BASE_DIR, td), exist_ok=True)

    # 4. Process each file
    for file_path in java_files:
        class_name = os.path.basename(file_path).replace(".java", "")
        target_pkg_name = get_target_package(class_name)
        new_pkg = f"com.jobengine.{target_pkg_name}"
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Replace package
        content = re.sub(r'package\s+com\.jobengine\.[a-z.]+;', f'package {new_pkg};', content)

        # Replace imports
        for old_imp, new_imp in import_replacements.items():
            content = content.replace(old_imp, new_imp)

        # Write to new destination
        dest_path = os.path.join(BASE_DIR, target_pkg_name, os.path.basename(file_path))
        with open(dest_path, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"Moved {class_name} to {target_pkg_name}")

    # Remove old dirs
    old_dirs = ["controller", "service", "repository", "model", "exception", "dto", "security", "config"]
    for od in old_dirs:
        d = os.path.join(BASE_DIR, od)
        if os.path.exists(d):
            shutil.rmtree(d)
            print(f"Removed old dir {od}")

if __name__ == "__main__":
    process_all()
