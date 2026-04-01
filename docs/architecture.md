# Architecture Overview

This project is a layered backend for a digital game store application.

It manages:
- customer and staff accounts
- game catalog
- shopping cart and transactions
- payment information
- reviews
- promotion codes

The backend follows a layered Spring Boot architecture:
- Controller layer
- Service layer
- Repository (DAO) layer
- Domain model layer
- DTO layer

# Layered Architecture

The backend follows a layered architecture:

## Controller Layer
Responsible for HTTP request handling and response formatting.

## Service Layer
Contains business rules and validation logic.

## DAO Layer
Handles persistence through Spring Data repositories.

## Model Layer
Defines domain entities and relationships.

## DTO Layer
Separates external API contracts from internal domain objects.

# Flow Diagram

User Action
   ↓
Vue Component
   ↓
API Call
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database

# Folder Structure

src/main/java/ca/mcgill/ecse321/gamestore/

- controller/: REST API endpoints
- service/: business logic
- dao/: persistence layer
- dto/: request/response objects
- model/: domain entities
