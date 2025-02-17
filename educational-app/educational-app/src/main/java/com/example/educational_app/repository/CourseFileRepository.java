package com.example.educational_app.repository;

import com.example.educational_app.utils.CourseFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseFileRepository extends JpaRepository<CourseFile, Long> {
}
