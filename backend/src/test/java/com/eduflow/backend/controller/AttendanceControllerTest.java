
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.AttendanceRecordResponse;
import com.eduflow.backend.entity.AttendanceStatus;
import com.eduflow.backend.service.AttendanceService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDate;
import java.util.UUID;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AttendanceController.class)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AttendanceService attendanceService;

    @Test
    @WithMockUser
    void getAllAttendanceRecordsReturnsJson() throws Exception {

        UUID id = UUID.fromString(
                "44444444-4444-4444-8444-444444444444"
        );

        UUID studentId = UUID.fromString(
                "11111111-1111-4111-8111-111111111111"
        );

        UUID subjectId = UUID.fromString(
                "22222222-2222-4222-8222-222222222222"
        );

        UUID teacherAssignmentId = UUID.fromString(
                "33333333-3333-4333-8333-333333333333"
        );

        AttendanceRecordResponse response =
                new AttendanceRecordResponse(
                        id,
                        studentId,
                        subjectId,
                        LocalDate.of(2026, 10, 10),
                        AttendanceStatus.PRESENT,
                        teacherAssignmentId
                );

        when(attendanceService.getAll())
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/attendance-records"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id.toString()))
                .andExpect(jsonPath("$[0].studentId")
                        .value(studentId.toString()))
                .andExpect(jsonPath("$[0].subjectId")
                        .value(subjectId.toString()))
                .andExpect(jsonPath("$[0].date").value("2026-10-10"))
                .andExpect(jsonPath("$[0].status").value("PRESENT"))
                .andExpect(jsonPath("$[0].teacherAssignmentId")
                        .value(teacherAssignmentId.toString()));
    }
}
