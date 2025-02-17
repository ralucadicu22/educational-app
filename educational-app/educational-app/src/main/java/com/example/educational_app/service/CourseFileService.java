package com.example.educational_app.service;

import com.example.educational_app.utils.CourseFile;
import com.example.educational_app.entities.Courses;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.CourseFileRepository;
import com.example.educational_app.repository.CoursesRepository;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseFileService {

    @Autowired
    private CourseFileRepository courseFileRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private UserRepository userRepository;
    public CourseFile uploadFile(Long courseId, String fileName, String fileUrl, String fileType, Integer weekNumber) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context (JWT?).");
        }

        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }

        if (!"Teacher".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only Teachers can upload files.");
        }

        Courses course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getCreator() == null || !course.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("You are not the creator of this course.");
        }


        CourseFile cf = new CourseFile(fileName, fileUrl, fileType, course);
        cf.setWeekNumber(weekNumber);
        return courseFileRepository.save(cf);
    }


    public CourseFile getFile(Long fileId) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context");
        }

        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }

        CourseFile cf = courseFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        Courses course = cf.getCourse();
        if (course == null) {
            throw new RuntimeException("Course not found for this file");
        }

        if ("Teacher".equalsIgnoreCase(user.getRole())) {
            if (course.getCreator() == null ||
                    !course.getCreator().getId().equals(user.getId())) {
                throw new RuntimeException("You are not the creator of this course.");
            }
        } else if ("Student".equalsIgnoreCase(user.getRole())) {
            if (!user.getEnrolledCourses().contains(course)) {
                throw new RuntimeException("You are not enrolled in this course.");
            }
        } else {
            throw new RuntimeException("Your role does not have access to this file.");
        }
        return cf;
    }
}
