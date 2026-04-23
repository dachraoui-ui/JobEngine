package com.jobengine.auth;

import com.jobengine.common.DuplicateResourceException;
import com.jobengine.common.JwtTokenProvider;
import com.jobengine.common.Role;
import com.jobengine.common.UnauthorizedException;
import com.jobengine.user.CandidateProfile;
import com.jobengine.user.CandidateProfileRepository;
import com.jobengine.user.RecruiterProfile;
import com.jobengine.user.RecruiterProfileRepository;
import com.jobengine.user.User;
import com.jobengine.user.UserRepository;
import com.jobengine.user.UserResponse;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Prevent self-registration as ADMIN
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot register as ADMIN");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole())
                .isVerified(request.getRole() == Role.CANDIDATE) // Candidates auto-verified
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Create empty profile based on role
        if (savedUser.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .userId(savedUser.getId())
                    .build();
            candidateProfileRepository.save(profile);
        } else if (savedUser.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = RecruiterProfile.builder()
                    .userId(savedUser.getId())
                    .build();
            recruiterProfileRepository.save(profile);
        }

        // Generate JWT
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String token = jwtTokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public AuthResponse googleLogin(GoogleAuthRequest request) {
        try {
            com.google.api.client.http.HttpTransport transport = new com.google.api.client.http.javanet.NetHttpTransport();
            com.google.api.client.json.JsonFactory jsonFactory = com.google.api.client.json.gson.GsonFactory.getDefaultInstance();

            // We accept any client ID for now by not setting a strict audience, or you can configure it via application.yml
            com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = 
                new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .build();

            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken != null) {
                com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                
                User user = userRepository.findByEmail(email).orElse(null);
                
                if (user == null) {
                    if (request.getRole() == null) {
                        throw new UnauthorizedException("Role is required for first-time Google registration");
                    }
                    if (request.getRole() == Role.ADMIN) {
                        throw new IllegalArgumentException("Cannot register as ADMIN");
                    }
                    
                    // Create new user
                    user = User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString())) // Random password for google users
                        .firstName((String) payload.get("given_name"))
                        .lastName((String) payload.get("family_name"))
                        .role(request.getRole())
                        .isVerified(request.getRole() == Role.CANDIDATE)
                        .isActive(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    user = userRepository.save(user);
                    
                    if (user.getRole() == Role.CANDIDATE) {
                        candidateProfileRepository.save(CandidateProfile.builder().userId(user.getId()).build());
                    } else if (user.getRole() == Role.RECRUITER) {
                        recruiterProfileRepository.save(RecruiterProfile.builder().userId(user.getId()).build());
                    }
                }
                
                String token = jwtTokenProvider.generateToken(user.getEmail());
                
                return AuthResponse.builder()
                        .token(token)
                        .userId(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole())
                        .build();
            } else {
                throw new UnauthorizedException("Invalid Google token");
            }
        } catch (Exception e) {
            throw new UnauthorizedException("Failed to verify Google token: " + e.getMessage());
        }
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
