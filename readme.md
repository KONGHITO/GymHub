# Gym Hub

Gym Hub is a social network platform for gym enthusiasts. It allows users to create a profile, connect with other users, and share their fitness journey. Users can post updates, photos, and videos of their workouts, as well as follow other users to stay updated on their progress. The platform is designed to be user-friendly and intuitive, making it easy for users to connect with others who share their passion for fitness.

## Features

- User profiles: Users can create a profile with their name, profile picture, and bio. Users are differentiated by a Usertype (Athlete, Coach, or Gym Owner).
- Posts: Users can create posts with text, photos, and videos. Posts can be liked and commented on by other users.
- Follow: Users can follow other users to stay updated on their posts and progress.
- Direct messaging: Users can send direct messages to other users.
- Map: Users can view a map of gyms in their area.
- Search: Users can search for other users by name or username.

## Technologies

- Frontend: html, css, javascript
- Backend: Python, Flask
- Database: MongoDB in local environment


## Requirements
Requirements are also present in the requirements.txt file:

- blinker==1.9.0
- click==8.1.7
- colorama==0.4.6
- dnspython==2.7.0
- Flask==3.1.0
- Flask-PyMongo==2.3.0
- Flask-WTF==1.2.2
- itsdangerous==2.2.0
- Jinja2==3.1.4
- MarkupSafe==3.0.2
- passlib==1.7.4
- pymongo==4.10.1
- Werkzeug==3.1.3
- WTForms==3.2.1


## Installation

1. Install dependencies ('pip install -r requirements.txt')
2. Install MongoDB
3. Run mongoDB ('mongod')
4. Run the application ('python app.py')


## MongoDB document structure
For some reason some of the ids ended up being strings instead of ObjectIds. Here is the structure of the documents in the database:

**Database name: gymhub_db**
- Users:
  - _id: string
  - name: string
  - surname: string
  - email: string
  - username: string
  - phone_number: string
  - password: string
  - is_following: list of strings
  - followers: list of strings
  - userType: string
  - gym_phone_number: string
  - certificate: string
  - image_url: string


- Posts:
  - _id: string
  - User_id: string
  - data: Date
  - text: string
  - media: string
  - likes: list of strings


- Comments: 
  - _id: objectid
  - post_id: string
  - user_id: string
  - text: string
  - date: Date


- Chats:
  - _id: objectid
  - user_1: string
  - user_2: string
  - created_at: Date
  - last_message: Object
  - unread_counts: Object

- Messages: 
  - _id: objectid
  - chat_id: objectid
  - sender_id: string
  - text: string
  - media_url: string
  - date: Date
  - status: string



## Authors
- **Alessandro Bartolucci** - **0124002907** - [GitHub](https://github.com/barto01)  - [Email](mailto:alessandro.bartolucci001@studenti.uniparthenope.it)
- **Luciano Palmisciano** - **0124002802** - [GitHub](https://github.com/KONGHITO)  - [Email](mailto:luciano.palmisciano001@studenti.uniparthenope.it)
- **Raffaele Volpicelli** - **0124002824** - [GitHub](https://github.com/Raffaele1711)  - [Email](mailto:raffaele.volpicelli001@studenti.uniparthenope.it)