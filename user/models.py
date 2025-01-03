import datetime, os

from bson import ObjectId
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256
import uuid
from app import db

class User:

    def start_session(self, user):
        del user['password']
        session['logged_in'] = True
        session['user'] = user
        return jsonify({"success": True, "redirect": "/home/"}), 200

    def signup(self):

        if request.form.get('userType') == 'atleta':
            #create user object
            user = {
            "_id": uuid.uuid4().hex,
            "userType":'atleta',
            "name": request.form.get("name"),
            "surname": request.form.get("surname"),
            "email": request.form.get("email"),
            "username": request.form.get("username"),
            "phone_number": request.form.get("phone_number"),
            "password": request.form.get("password"),
            "followers": [],
            "is_following": []
        }

        elif request.form.get('userType') == 'trainer':
            user = {
                "_id": uuid.uuid4().hex,
                "userType": 'trainer',
                "name": request.form.get("name"),
                "surname": request.form.get("surname"),
                "email": request.form.get("email"),
                "username": request.form.get("username"),
                "phone_number": request.form.get("phone_number"),
                "password": request.form.get("password"),
                "certificate": request.form.get("certificate"),
                "followers": [],
                "is_following": []
            }

        elif request.form.get('userType') == 'palestra':
            user = {
                "_id": uuid.uuid4().hex,
                "userType": 'palestra',
                "name": request.form.get("name"),
                "surname": request.form.get("surname"),
                "email": request.form.get("email"),
                "username": request.form.get("username"),
                "phone_number": request.form.get("phone_number"),
                "gym_phone_number": request.form.get("gym_phone_number"),
                "password": request.form.get("password"),
                "followers": [],
                "is_following": []
            }

        repeat_password = request.form.get("repeat_password")
        if user['password'] != repeat_password:
            return jsonify({"error": "Passwords do not match"}), 400

        #encrypt the password
        user['password'] = pbkdf2_sha256.encrypt(user['password'])

        #check for existing email address
        if db.Users.find_one({"email": user['email']}):
            return jsonify({"error": "Email already registered"}), 400


        if db.Users.insert_one(user):
            return jsonify({"success": True, "redirect": "/"}), 200

        return jsonify({"error": "Signup failed"}), 400

    def signout(self):
        session.clear()
        #return redirect('/')


    def login(self):
        user = db.Users.find_one({"username": request.form.get("username")})
        if user and pbkdf2_sha256.verify(request.form.get("password"),user['password']):
            return  self.start_session(user)
        return jsonify({"error": "Invalid credentials"}), 401







class Post:
    def create_post(self):

        if 'user' not in session:
            return jsonify({"error": "You must be logged in"}), 401


        post = {
            "_id": uuid.uuid4().hex,
            "User_id": session['user']['_id'],
            "date": datetime.datetime.now(),
            "text": request.form.get("text").strip(),
            "media": None,
            "likes": [],

        }
        # Gestione del file multimediale (opzionale)
        media_file = request.files.get("media")
        if media_file:
            filename = secure_filename(media_file.filename)
            media_path = os.path.join("static/uploads", filename)

            try:
                media_file.save(media_path)
                post["media"] = f"/static/uploads/{filename}"
            except Exception as e:
                return jsonify({"error":f"Media upload failed {str(e)}"}), 500

        if db.Posts.insert_one(post):
            return jsonify({"success": True, "redirect": "/home/"}), 200
        return jsonify({"error": "Post creation failed"}), 500

    def get(self):

        if 'user' not in session:
            return jsonify({"error": "You must be logged in"}), 401

         # Recupera tutti i post dell'utente corrente
        user_posts = list(db.Posts.find({"User_id": session['user']['_id']}))

        # Trasforma i dati in un formato serializzabile (JSON friendly)
        for post in user_posts:
            post["_id"] = str(post["_id"])  # Converte ObjectId in stringa
            post["date"] = post["date"].strftime("%Y-%m-%d %H:%M:%S")  # Formatta la data

        return jsonify({"success": True, "posts": user_posts}), 200



class Chat:
    def create_Chat(self):
        if 'user' not in session:
            return jsonify({"error": "You must be logged in"}), 401

        chat = {
            "_id": uuid.uuid4().hex,
            "User_id": session['user']['_id'],
            "date": datetime.datetime.now(),
            "text": request.form.get("text").strip(),
            "media": None,
            "likes": [],

        }
        # Gestione del file multimediale (opzionale)
        media_file = request.files.get("media")
        if media_file:
            filename = secure_filename(media_file.filename)
            media_path = os.path.join("static/uploads", filename)

            try:
                media_file.save(media_path)
                chat["media"] = f"/static/uploads/{filename}"
            except Exception as e:
                return jsonify({"error":f"Media upload failed {str(e)}"}), 500

        if db.Chat.insert_one(chat):
            return jsonify({"success": True, "redirect": "/home/"}), 200
        return jsonify({"error": "Chat creation failed"}), 500

    def find(self):
        if 'user' not in session:
            return jsonify({"error": "You must be logged in"}), 401

        user_chats = list(db.Chat.find({"User_id": session['user']['_id']}))

        for chat in user_chats:
            chat["_id"] = str(chat["_id"])