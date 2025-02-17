package com.example.educational_app.service;

import com.example.educational_app.entities.Courses;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.CoursesRepository;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.utils.KeycloakUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoursesService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    public Courses createCourse(String name, String description) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context (JWT missing?).");
        }


        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }

        if (!"Teacher".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only Teachers can create courses.");
        }

        Courses course = new Courses(name, description, user);
        return coursesRepository.save(course);
    }

    public void setJoinCode(Long courseId, String joinCode) {
        Courses course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setJoinCode(joinCode);
        coursesRepository.save(course);
    }

    public boolean enrollStudentByCode(String joinCode) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        User student = userRepository.findByKeycloakId(keycloakId);

        if (student == null || !"Student".equalsIgnoreCase(student.getRole())) {
            throw new RuntimeException("Only students can enroll.");
        }

        Courses course = coursesRepository.findByJoinCode(joinCode);
        if (course == null) {
            return false; // Cod invalid
        }

        if (student.getEnrolledCourses().contains(course)) {
            return false;
        }

        student.getEnrolledCourses().add(course);
        userRepository.save(student);
        coursesRepository.save(course);
        return true;
    }


    public List<Courses> getMyCreatedCourses() {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context.");
        }

        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }

        if (!"Teacher".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Not a teacher");
        }

        return coursesRepository.findByCreatorId(user.getId());
    }


    public List<Courses> getMyEnrolledCourses() {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            throw new RuntimeException("No user in context.");
        }

        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User not found in DB");
        }

        if (!"Student".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Not a student");
        }

        return coursesRepository.findAllByStudentId(user.getId());
    }
    public Courses getCourseById(Long courseId) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        User user = userRepository.findByKeycloakId(keycloakId);

        Courses course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (user != null && "Student".equalsIgnoreCase(user.getRole())) {
            course.setJoinCode(null);
        }

        return course;
    }

}
