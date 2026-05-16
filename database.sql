CREATE DATABASE IF NOT EXISTS wspeedrun;
USE wspeedrun;

CREATE TABLE IF NOT EXISTS users (
  user_id  VARCHAR(36)  NOT NULL,
  username VARCHAR(55)  NOT NULL,
  email    VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  country  VARCHAR(55)  NOT NULL,
  role     VARCHAR(25)  NOT NULL DEFAULT 'USER',
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE IF NOT EXISTS games (
  game_id     VARCHAR(36)  NOT NULL,
  game_name   VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS run_categories (
  run_category_id   VARCHAR(36)  NOT NULL,
  game_id           VARCHAR(36)  NOT NULL,
  run_category_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (run_category_id),
  CONSTRAINT fk_run_categories_game FOREIGN KEY (game_id) REFERENCES games (game_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS runs (
  run_id          VARCHAR(36)  NOT NULL,
  run_category_id VARCHAR(36)  NOT NULL,
  user_id         VARCHAR(36)  NOT NULL,
  vod_url         VARCHAR(255) NOT NULL,
  run_duration    BIGINT       NOT NULL,
  submitted_at    DATETIME     NOT NULL,
  verified_at     DATETIME     NULL,
  status          VARCHAR(25)  NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (run_id),
  CONSTRAINT fk_runs_run_category FOREIGN KEY (run_category_id) REFERENCES run_categories (run_category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id VARCHAR(36)  NOT NULL,
  run_id     VARCHAR(36)  NOT NULL,
  user_id    VARCHAR(36)  NOT NULL,
  comment    VARCHAR(255) NOT NULL,
  created_at DATETIME     NOT NULL,
  PRIMARY KEY (comment_id),
  CONSTRAINT fk_comments_run FOREIGN KEY (run_id) REFERENCES runs (run_id) ON DELETE CASCADE
);
