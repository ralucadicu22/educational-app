package com.example.educational_app.controllers;

import com.example.educational_app.entities.Courses;
import com.example.educational_app.service.CoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
public class CoursesController {

    @Autowired
    private CoursesService coursesService;

    @GetMapping("/{courseId}")
    public Courses getCourseById(@PathVariable Long courseId) {
        return coursesService.getCourseById(courseId);
    }
    @PostMapping("/add")
    @PreAuthorize("hasRole('Teacher')")
    public Courses createCourse(@RequestBody Courses course) {
        return coursesService.createCourse(course.getName(), course.getDescription());
    }


    @PostMapping("/{courseId}/generate-code")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<String> generateJoinCode(@PathVariable Long courseId) {
        String joinCode = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        coursesService.setJoinCode(courseId, joinCode);
        return ResponseEntity.ok(joinCode);
    }

    @PostMapping("/join")
    @PreAuthorize("hasRole('Student')")
    public ResponseEntity<String> joinCourse(@RequestParam String joinCode) {
        boolean success = coursesService.enrollStudentByCode(joinCode);
        return success ? ResponseEntity.ok("Enrollment successful!") : ResponseEntity.badRequest().body("Invalid or expired code.");
    }

    @GetMapping("/my-created")
    @PreAuthorize("hasRole('Teacher')")
    public List<Courses> getMyCreatedCourses() {
        return coursesService.getMyCreatedCourses();
    }


    @GetMapping("/my-enrolled")
    @PreAuthorize("hasRole('Student')")
    public List<Courses> getMyEnrolledCourses() {
        return coursesService.getMyEnrolledCourses();
    }

    @GetMapping("/by-user/{userId}")
    public List<Courses> getCoursesByUser(@PathVariable Long userId) {
        return coursesService.getCoursesByUser(userId);
    }

    @PutMapping("/{courseId}/edit")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<Courses> updateCourse(@PathVariable Long courseId, @RequestBody Courses updatedCourse) {
        Courses course = coursesService.updateCourse(courseId, updatedCourse.getName(), updatedCourse.getDescription());
        return ResponseEntity.ok(course);
    }
}
