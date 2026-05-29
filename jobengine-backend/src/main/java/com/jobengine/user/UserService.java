package com.jobengine.user;

import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.common.Role;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    public UserResponse updateUser(String id, UserResponse updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (updates.getFirstName() != null) user.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) user.setLastName(updates.getLastName());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public void deactivateUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(false);
        userRepository.save(user);
    }

    public void verifyRecruiter(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setVerified(true);
        userRepository.save(user);
    }

    public List<UserResponse> getPendingRecruiters() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.RECRUITER && !u.isVerified())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CandidateResponse> getCandidates() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CANDIDATE && u.isActive())
                .map(u -> {
                    CandidateProfile profile = candidateProfileRepository.findByUserId(u.getId()).orElse(null);
                    return CandidateResponse.builder()
                            .id(u.getId())
                            .email(u.getEmail())
                            .firstName(u.getFirstName())
                            .lastName(u.getLastName())
                            .phone(u.getPhone())
                            .role(u.getRole())
                            .isVerified(u.isVerified())
                            .isActive(u.isActive())
                            .createdAt(u.getCreatedAt())
                            .skills(profile != null ? profile.getSkills() : null)
                            .experienceLevel(profile != null ? profile.getExperienceLevel() : null)
                            .values(profile != null ? profile.getValues() : null)
                            .visibility(profile != null ? profile.getVisibility() : null)
                            .cvId(profile != null ? profile.getCvId() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
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
