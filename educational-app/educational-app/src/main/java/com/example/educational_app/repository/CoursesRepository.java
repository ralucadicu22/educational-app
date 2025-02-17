package com.example.educational_app.repository;

import com.example.educational_app.entities.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface CoursesRepository extends JpaRepository<Courses, Long> {
    @Query("SELECT c FROM Courses c WHERE c.creator.id = :creatorId")
    List<Courses> findByCreatorId(@Param("creatorId") Long creatorId);
    @Query("SELECT c FROM Courses c JOIN c.enrolledStudents s WHERE s.id = :studentId")
    List<Courses> findAllByStudentId(@Param("studentId") Long studentId);
    Courses findByJoinCode(String joinCode);
}
