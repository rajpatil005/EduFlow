
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateDepartmentRequest;
import com.eduflow.backend.dto.response.DepartmentResponse;
import com.eduflow.backend.entity.Department;
import com.eduflow.backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.eduflow.backend.dto.response.DepartmentOverviewResponse;
import com.eduflow.backend.dto.response.DepartmentStaffResponse;
import com.eduflow.backend.entity.DepartmentHodAssignment;
import com.eduflow.backend.entity.Role;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.entity.User;
import com.eduflow.backend.repository.DepartmentHodAssignmentRepository;
import com.eduflow.backend.repository.TeacherRepository;
import com.eduflow.backend.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final DepartmentHodAssignmentRepository hodAssignmentRepository;

    @Transactional
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase(Locale.ROOT);

        if (departmentRepository.existsByCode(code)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Department code '" + code + "' already exists"
            );
        }

        Department department = new Department();
        department.setName(name);
        department.setCode(code);

        Department saved = departmentRepository.save(department);

        return new DepartmentResponse(
                saved.getId(),
                saved.getName(),
                saved.getCode()
        );
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(department -> new DepartmentResponse(
                        department.getId(),
                        department.getName(),
                        department.getCode()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(UUID departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found"
                ));

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getCode()
        );
    }


    @Transactional(readOnly = true)
    public DepartmentOverviewResponse getDepartmentOverview(
            UUID departmentId,
            String requesterEmail) {

        // Find department
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found"
                ));

        // Find logged-in user
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"
                ));

        // Check permission
        if (requester.getRole() != Role.ADMIN) {

            if (requester.getRole() != Role.HOD
                    && requester.getRole() != Role.TEACHER) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You are not allowed to view the department staff"
                );
            }

            Teacher requesterTeacher = teacherRepository
                    .findByUserId(requester.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Your teacher profile was not found"
                    ));

            if (!requesterTeacher.getDepartmentId().equals(departmentId)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You can only view staff of your own department"
                );
            }
        }

        // Find all teachers in this department
        List<Teacher> departmentTeachers =
                teacherRepository.findAllByDepartmentId(departmentId);

        // Fetch their user details in one query
        Set<UUID> userIds = departmentTeachers.stream()
                .map(Teacher::getUserId)
                .collect(Collectors.toSet());

        Map<UUID, User> usersById = userRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // Find current HOD assignment
        DepartmentHodAssignment activeAssignment =
                hodAssignmentRepository
                        .findByDepartmentIdAndEndedAtIsNull(departmentId)
                        .orElse(null);

        DepartmentStaffResponse hod = null;
        UUID currentHodTeacherId = null;

        if (activeAssignment != null) {

            UUID assignedHodTeacherId = activeAssignment.getTeacherId();
            currentHodTeacherId = assignedHodTeacherId;

            Teacher hodTeacher = departmentTeachers.stream()
                    .filter(teacher ->
                            teacher.getId().equals(assignedHodTeacherId))
                    .findFirst()
                    .orElse(null);

            if (hodTeacher != null) {
                User hodUser = usersById.get(hodTeacher.getUserId());

                if (hodUser != null) {
                    hod = toStaffResponse(hodTeacher, hodUser);
                }
            }
        }

        // Build teacher list, excluding the current HOD
        UUID finalHodTeacherId = currentHodTeacherId;

        List<DepartmentStaffResponse> teachers = departmentTeachers.stream()
                .filter(teacher -> !teacher.getId().equals(finalHodTeacherId))
                .map(teacher -> {
                    User user = usersById.get(teacher.getUserId());

                    if (user == null) {
                        return null;
                    }

                    return toStaffResponse(teacher, user);
                })
                .filter(response -> response != null)
                .toList();

        // Return department overview
        return new DepartmentOverviewResponse(
                department.getId(),
                department.getName(),
                department.getCode(),
                hod,
                teachers
        );
    }

    private DepartmentStaffResponse toStaffResponse(
            Teacher teacher,
            User user) {

        return new DepartmentStaffResponse(
                teacher.getId(),
                teacher.getEmployeeId(),
                user.getName(),
                user.getEmail(),
                user.isActive()
        );
    }

}
