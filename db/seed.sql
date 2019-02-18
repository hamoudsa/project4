DROP DATABASE IF EXISTS react_map;
CREATE DATABASE react_map;
\c react_map;

CREATE TABLE places (
  place_id int NOT NULL,
  formatted_address varchar DEFAULT NULL,
  icon varchar DEFAULT NULL,
  name varchar DEFAULT NULL,
  rating int DEFAULT NULL,
  user_id int DEFAULT NULL
)

CREATE TABLE users (
  id int NOT NULL,
  username varchar DEFAULT NULL,
  email varchar DEFAULT NULL,
  password varchar DEFAULT NULL
)

ALTER TABLE places
  ADD PRIMARY KEY (place_id);


ALTER TABLE users
  ADD PRIMARY KEY (id);
