package com.eduflow.backend.security;

import com.eduflow.backend.entity.User;
import com.eduflow.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        log.info("JWT Filter: {} {}", request.getMethod(), request.getRequestURI());
        log.info("JWT DEBUG: Authorization header = {}",
                authHeader == null ? "NULL" : "PRESENT");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("JWT Filter: Missing or invalid Authorization header");
            filterChain.doFilter(request, response);
            return;
        }

        log.info("JWT Filter: Bearer token received");

        String token = authHeader.substring(7);

        try {
            Claims claims = jwtService.extractClaims(token);
            String email = claims.getSubject();

            log.info("JWT Filter: Token parsed successfully. Subject={}", email);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    log.warn("JWT Filter: No user found for email={}", email);
                } else {
                    log.info("JWT Filter: DB user found. Email={}, Role={}",
                            user.getEmail(), user.getRole());

                    boolean valid = jwtService.isTokenValid(token, user);

                    log.info("JWT Filter: Token valid={}", valid);

                    if (valid) {
                        var authorities = List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + user.getRole().name()
                                )
                        );

                        var authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user.getEmail(),
                                        null,
                                        authorities
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                        log.info("JWT Filter: Authentication set. Principal={}, Authorities={}",
                                authentication.getPrincipal(),
                                authentication.getAuthorities());
                    }
                }
            } else {
                log.warn("JWT Filter: Subject is null or authentication already exists");
            }

        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException exception) {
            log.error("JWT Filter: Token validation failed. Type={}, Message={}",
                    exception.getClass().getSimpleName(),
                    exception.getMessage());

            SecurityContextHolder.clearContext();
        }

        log.info("JWT Filter: Continuing to next filter");
        filterChain.doFilter(request, response);
    }
}