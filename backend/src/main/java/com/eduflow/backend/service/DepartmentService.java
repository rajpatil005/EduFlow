
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

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

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
}
