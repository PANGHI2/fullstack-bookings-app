# Installation Guide for Bookings REST API

This REST API, designed for managing bookings within an application, leverages JWT for authentication. It uses a Laravel
application, version 10.2.5.

## Prerequisites

- PHP 8.3 or higher
- Composer
- SQLite

## Initial Setup

### Install Dependencies

Laravel and JWT auth depend on various PHP packages. Install them with Composer:

```sh
composer install
```

### Environment Configuration

1. **Copy Environment File**: Start by duplicating the `.env.example` file to `.env` to create your application's
   environment configuration.

    ```sh
    cp .env.example .env
    ```

2. **Generate Application Key**: Laravel uses this key for application-level encryption and security.

    ```sh
    php artisan key:generate
    ```

   This command automatically updates your `.env` file with an appropriate `APP_KEY`.

3. **Generate JWT Secret**: Essential for JWT authentication.

    ```sh
    php artisan jwt:secret
    ```

   It adds a `JWT_SECRET` to your `.env` file, used to sign your tokens.

4. **Database Connection**: If using SQLite, update your `.env` file to use SQLite as the database connection. Also,
   ensure you have the database file created if it doesn't exist.

    ```plaintext
    DB_CONNECTION=sqlite
    DB_DATABASE=/path/to/database.sqlite
    ```

   For SQLite, an empty database file has to be created:

    ```sh
    touch database/database.sqlite
    ```
5. **Database Migrations and Seeders**: To set up your database schema and repopulate it with initial data, run the
   following command:

    ```sh
    php artisan migrate:refresh --seed
    ```

### Running the Application

You can start the Laravel development server by executing:

    php artisan serve

This command starts a development server on `http://localhost:8000`, allowing you to access the backend application and
its APIs.

# Authentication API Endpoints

## Overview

This section covers the authentication-related endpoints of the API. These endpoints facilitate user authentication
actions, including login, token refresh, logout, and retrieving current user details.

### Login

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates the user with email and password, and returns a token upon success.
- **Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Success Response**: Token and user details.

### Refresh Token

- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refreshes the user's authentication token.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: A new token.

### Logout

- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logs out the user and invalidates the current token.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: Confirmation of logout.

### Get Current User

- **Endpoint**: `POST /api/auth/user`
- **Description**: Returns details of the currently logged-in user.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: User details.

# Bookings API Endpoints

## Overview

This section describes the endpoints related to bookings management in the API. These endpoints allow users to create,
update, fetch, and delete booking records.

### Create a Booking

- **Endpoint**: `POST /api/bookings`
- **Description**: Creates a new booking record with the provided details.
- **Body**:
    ```json
    {
      "fullname": "string",
      "roomNumber": "string",
      "checkIn": "YYYY-MM-DD",
      "checkOut": "YYYY-MM-DD"
    }
    ```
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: Details of the created booking.

### Update a Booking

- **Endpoint**: `PUT /api/bookings/{id}`
- **Description**: Updates an existing booking record identified by `{id}`.
- **Parameters**:
    - `id`: Booking ID to update.
- **Body**:
    ```json
    {
      "fullname": "string",
      "roomNumber": "string",
      "checkIn": "YYYY-MM-DD",
      "checkOut": "YYYY-MM-DD"
    }
    ```
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: Updated booking details.

### Get All Bookings

- **Endpoint**: `GET /api/bookings`
- **Description**: Retrieves all bookings for the currently logged-in user, supports optional pagination.
- **Query Parameters**:
    - `page`: Optional. The page number of bookings to retrieve.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: A list of bookings, optionally paginated.

### Get a Single Booking

- **Endpoint**: `GET /api/bookings/{id}`
- **Description**: Retrieves details of a specific booking identified by `{id}`.
- **Parameters**:
    - `id`: Booking ID to retrieve.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: Details of the specified booking.

### Delete a Booking

- **Endpoint**: `DELETE /api/bookings/{id}`
- **Description**: Deletes a specific booking identified by `{id}`.
- **Parameters**:
    - `id`: Booking ID to delete.
- **Required Headers**:
    - `Authorization: Bearer <Token>`
- **Success Response**: Confirmation of the booking deletion.
