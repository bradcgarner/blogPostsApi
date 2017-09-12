--  psql -1 -f ~/Documents/projects/blogPostsApi/blogposts.sql postgres://urwreber:j-Y1DakcJV1aSbOZ4IArPWw6Nqd3Yglk@elmer.db.elephantsql.com:5432/urwreber



-- Create database??
-- createdb -U dev dev-blogposts-app

-- Create a User table 

-- ADding columns for User table: {first names, last names, email addresses, 
-- screen names, user_id}
CREATE TABLE if not exists users(
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  screen_name text NOT NULL
);

-- Create a Posts table

-- adding columns for Posts table:  {id, "author" foreign_user_id(user table),  
-- title, content, publish timestamp, ***number of comments foriegn_comments***, 
-- ***number of tags foreign_tags***}

CREATE TABLE if not exists posts(
  id serial PRIMARY KEY,
  id_users integer REFERENCES users ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  publish_timestamp TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a Comments table

-- adding columns for comments: {"author" foreign_user_id(user table), 
-- "post" foreign_post_id, comment}

CREATE TABLE if not exists comments(
  id serial PRIMARY KEY,
  id_users integer REFERENCES users ON DELETE SET NULL,
  id_posts integer REFERENCES posts ON DELETE CASCADE,
  id_comments integer REFERENCES comments ON DELETE SET NULL,
  comment text NOT NULL,
  publish_timestamp TIMESTAMP with TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a Tags table

-- adding columns for tags: {tags}

CREATE TABLE if not exists tags(
  id serial PRIMARY KEY,
  id_posts integer REFERENCES posts ON DELETE CASCADE,
  tag text NOT NULL
);

-- ______________________

-- Querying users, posts, comments

INSERT INTO users
  (first_name, last_name, email, screen_name) 
  VALUES
  ('Brad', 'Garner', 'bradgarber@gmail.com', 'bgarner'),
  ('Eric', 'Pcholinski', 'ericpcho@gmail.com', 'ericpcho');

INSERT INTO posts 
  (title, content, id_users)
  VALUES
  ('My Tuesday afternoon', 'It was a productive afternoon with my paired partner Eric.', 1),
  ('My Great Summer', 'Went to beach and blah blah blah blah.', 1),
  ('Quit My Job', 'Now eat, sleep, code, eat, sleep, code', 2);

INSERT INTO comments 
  (comment, id_users, id_posts, id_comments)
  VALUES
  ('Hey Thanks Brad! -Eric', 2, 1, null),
  ('Wow! You quit your job?', 1, 3, null),  
  ('Yep! Left last week :). My boss was a jerk', 2, 3, 2);

  INSERT INTO tags 
  (tag, id_posts)
  VALUES
  ('myday', 1),
  ('pairedprogramming', 1),
  ('summerplans', 2),
  ('coding', 3),
  ('what to do when your boss is horrible', 3);
