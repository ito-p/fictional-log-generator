# create database
CREATE DATABASE fictional_log;
use fictional_log;

# create table
CREATE TABLE actions (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  action VARCHAR(255) NOT NULL,
  detail JSON NOT NULL,
  timestamp DATETIME NOT NULL,
  primary key (id)
);

# insert template
INSERT INTO actions (
  user_id,
  action,
  detail,
  timestamp
) VALUES (
  1,
  'transit',
  '{ "view": "Ranking" }',
  '2017-01-01 00:00:10'
);

# truncate table actions
TRUNCATE TABLE actions;
