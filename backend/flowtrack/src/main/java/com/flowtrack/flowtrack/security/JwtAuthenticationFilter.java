package com.flowtrack.flowtrack.security;

import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        String authHeader = request.getHeader("Authorization");
        
        if (token != null) {
            try {
                if (tokenProvider.validateToken(token)) {
                    Long userId = tokenProvider.getUserIdFromToken(token);
                    Optional<User> userOptional = userRepository.findByIdWithPessoa(userId);
                    
                    if (userOptional.isPresent()) {
                        User user = userOptional.get();
                        if (user.getPessoa() != null) {
                            user.getPessoa().getNome(); // Access to initialize
                        }
                        String role = "ROLE_" + user.getRole();
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                user, 
                                null, 
                                Collections.singletonList(new SimpleGrantedAuthority(role))
                            );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        System.err.println("JWT: User not found for ID: " + userId);
                    }
                } else {
                    System.err.println("JWT: Invalid token for request: " + request.getRequestURI());
                }
            } catch (Exception e) {
                System.err.println("JWT Authentication error: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            if (authHeader != null) {
                System.err.println("JWT: Authorization header present but token extraction failed. Header: " + authHeader.substring(0, Math.min(20, authHeader.length())));
            } else {
                System.err.println("JWT: No Authorization header for request: " + request.getRequestURI());
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

