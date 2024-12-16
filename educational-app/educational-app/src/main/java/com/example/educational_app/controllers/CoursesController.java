package com.example.educational_app.controllers;

import com.example.educational_app.entities.Courses;
import com.example.educational_app.repository.CoursesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CoursesController {
    @Autowired
    private CoursesRepository coursesRepository;

    @PostMapping
    public Courses createCourse(@RequestBody Courses course) {
        return coursesRepository.save(course);
    }

    @GetMapping
    public List<Courses> getAllCourses() {
        return coursesRepository.findAll();
    }
}