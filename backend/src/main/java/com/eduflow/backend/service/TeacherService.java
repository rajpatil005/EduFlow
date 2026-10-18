package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateTeacherRequest;
import com.eduflow.backend.dto.response.TeacherResponse;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.entity.User;
import com.eduflow.backend.entity.Role;
import com.eduflow.backend.repository.DepartmentRepository;
import com.eduflow.backend.repository.TeacherRepository;
import com.eduflow.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public TeacherResponse createTeacher(CreateTeacherRequest request) {

        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String employeeId = request.employeeId().trim();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        if (teacherRepository.existsByEmployeeId(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Employee ID already exists"
            );
        }

        if (!departmentRepository.existsById(request.departmentId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Department not found"
            );
        }

        User user = new User(
                request.name().trim(),
                Role.TEACHER,
                email,
                passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUserId(savedUser.getId());
        teacher.setEmployeeId(employeeId);
        teacher.setDepartmentId(request.departmentId());

        Teacher savedTeacher = teacherRepository.save(teacher);

        return new TeacherResponse(
                savedTeacher.getId(),
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedTeacher.getEmployeeId(),
                savedTeacher.getDepartmentId()
        );
    }
}