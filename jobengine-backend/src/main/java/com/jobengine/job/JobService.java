package com.jobengine.job;

import com.jobengine.application.ApplicationRepository;
import com.jobengine.common.JobStatus;
import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobType;
import com.jobengine.user.CandidateProfile;
import com.jobengine.user.CandidateProfileRepository;
import com.jobengine.user.RecruiterProfile;
import com.jobengine.user.RecruiterProfileRepository;
import com.jobengine.user.User;
import com.jobengine.user.UserRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public JobResponse createJob(JobRequest request, String recruiterId) {
        Job job = Job.builder()
                .recruiterId(recruiterId)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .type(request.getType())
                .requiredSkills(request.getRequiredSkills())
                .experienceLevel(request.getExperienceLevel())
                .companyValues(request.getCompanyValues())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .deadline(request.getDeadline())
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getOpenJobs() {
        return jobRepository.findByStatus(JobStatus.OPEN).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    public List<JobResponse> getJobsByRecruiter(String recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobResponse updateJob(String id, JobRequest request, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new IllegalArgumentException("You can only update your own jobs");
        }

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getType() != null) job.setType(request.getType());
        if (request.getRequiredSkills() != null) job.setRequiredSkills(request.getRequiredSkills());
        if (request.getExperienceLevel() != null) job.setExperienceLevel(request.getExperienceLevel());
        if (request.getCompanyValues() != null) job.setCompanyValues(request.getCompanyValues());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    public void deleteJob(String id, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new IllegalArgumentException("You can only delete your own jobs");
        }
        jobRepository.delete(job);
    }

    public List<JobResponse> searchJobs(List<String> skills, JobType type, String location, ExperienceLevel experienceLevel) {
        return jobRepository.findByStatus(JobStatus.OPEN).stream()
                .filter(job -> {
                    if (type != null && job.getType() != type) {
                        return false;
                    }
                    if (experienceLevel != null && job.getExperienceLevel() != experienceLevel) {
                        return false;
                    }
                    if (location != null && !location.isBlank() && 
                        (job.getLocation() == null || !job.getLocation().toLowerCase().contains(location.toLowerCase()))) {
                        return false;
                    }
                    if (skills != null && !skills.isEmpty()) {
                        if (job.getRequiredSkills() == null) {
                            return false;
                        }
                        boolean match = skills.stream().anyMatch(skill -> 
                            job.getRequiredSkills().stream().anyMatch(jobSkill -> 
                                jobSkill.equalsIgnoreCase(skill)
                            )
                        );
                        if (!match) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getRecommendedJobs(String candidateId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateId).orElse(null);
        
        if (profile == null || (profile.getSkills() == null && profile.getExperienceLevel() == null)) {
            return getOpenJobs();
        }

        List<String> candidateSkills = profile.getSkills();
        ExperienceLevel exp = profile.getExperienceLevel();

        return jobRepository.findByStatus(JobStatus.OPEN).stream()
                .filter(job -> {
                    if (exp != null && job.getExperienceLevel() != null && job.getExperienceLevel() != exp) {
                        return false;
                    }
                    if (profile.getPreferences() != null && profile.getPreferences().getJobType() != null &&
                        job.getType() != null && job.getType() != profile.getPreferences().getJobType()) {
                        return false;
                    }
                    return true;
                })
                .sorted((j1, j2) -> {
                    long m1 = candidateSkills == null ? 0 : j1.getRequiredSkills().stream()
                            .filter(s -> candidateSkills.stream().anyMatch(cs -> cs.equalsIgnoreCase(s)))
                            .count();
                    long m2 = candidateSkills == null ? 0 : j2.getRequiredSkills().stream()
                            .filter(s -> candidateSkills.stream().anyMatch(cs -> cs.equalsIgnoreCase(s)))
                            .count();
                    return Long.compare(m2, m1);
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JobResponse mapToResponse(Job job) {
        String recruiterName = "";
        String companyName = "";

        User recruiter = userRepository.findById(job.getRecruiterId()).orElse(null);
        if (recruiter != null) {
            recruiterName = recruiter.getFirstName() + " " + recruiter.getLastName();
            RecruiterProfile profile = recruiterProfileRepository.findByUserId(recruiter.getId()).orElse(null);
            if (profile != null) {
                companyName = profile.getCompanyName() != null ? profile.getCompanyName() : "";
            }
        }

        int applicantCount = applicationRepository.findByJobId(job.getId()).size();

        return JobResponse.builder()
                .id(job.getId())
                .recruiterId(job.getRecruiterId())
                .recruiterName(recruiterName)
                .companyName(companyName)
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .type(job.getType())
                .requiredSkills(job.getRequiredSkills())
                .experienceLevel(job.getExperienceLevel())
                .companyValues(job.getCompanyValues())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .deadline(job.getDeadline())
                .applicantCount(applicantCount)
                .build();
    }
}
