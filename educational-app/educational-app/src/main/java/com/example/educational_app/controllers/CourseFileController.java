package com.example.educational_app.controllers;

import com.example.educational_app.utils.CourseFile;
import com.example.educational_app.service.CourseFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;

@RestController
@RequestMapping("/course-files")
public class CourseFileController {

    @Autowired
    private CourseFileService courseFileService;

    private static final String UPLOAD_DIR = "uploads";


    @PostMapping("/upload")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<?> uploadFile(@RequestParam Long courseId,
                                        @RequestParam("file") MultipartFile file,
                                        @RequestParam(required = false) Integer weekNumber) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty.");
        }
        try {
            String originalFilename = file.getOriginalFilename();
            Path targetLocation = Paths.get(UPLOAD_DIR).resolve(originalFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = targetLocation.toString();
            String fileType = file.getContentType();

            CourseFile cf = courseFileService.uploadFile(courseId, originalFilename, fileUrl, fileType, weekNumber);

            return ResponseEntity.ok(cf);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Could not store file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {
        try {
            CourseFile cf = courseFileService.getFile(fileId);
            Path filePath = Paths.get(cf.getFileUrl());
            byte[] fileData = Files.readAllBytes(filePath);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cf.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(cf.getFileType()))
                    .body(fileData);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not read file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    @PostMapping("/add-video")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<?> addVideo(@RequestParam Long courseId,
                                      @RequestParam String title,
                                      @RequestParam String videoUrl,
                                      @RequestParam(required = false) Integer weekNumber) {

        if (!videoUrl.contains("youtube.com") ) {
            return ResponseEntity.badRequest().body("Invalid video URL.");
        }

        CourseFile video = courseFileService.uploadFile(courseId, title, videoUrl, "youtube", weekNumber);
        return ResponseEntity.ok(video);
    }



}
