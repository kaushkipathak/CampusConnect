@echo off
title CampusConnect Backend
echo ===================================================
echo Starting CampusConnect Spring Boot Backend (Java 21)
echo ===================================================

set "JAVA_HOME=C:\Users\kaush\.antigravity\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0backend"
echo Using JAVA_HOME: %JAVA_HOME%
java -version
echo.
echo Launching Spring Boot with embedded database and pre-seeded sample events...
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
pause
