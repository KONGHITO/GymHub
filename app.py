from datetime import datetime

from bson import ObjectId
from flask import Flask, render_template, session, redirect, jsonify, flash, request
import pymongo
from functools import wraps
import os
app = Flask(__name__, static_folder="static")
print(app.url_map)

app.debug = True
app.secret_key = 'bYw\xa7Njz9\xc2P\xb3Z\xf5\xe1\xa7H\x82' #python -c 'import os; print(os.urandom(16))'

#Database
client = pymongo.MongoClient('localhost', 27017)
db = client.gymhub_db #nome db

# Configurazione della cartella di upload
app.config["UPLOAD_FOLDER"] = os.path.join("static", "uploads", "profile_images")

# Crea la directory se non esiste
if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])

#Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')
    return wrap

from user import routes
@app.route('/')
def home():
    return render_template('login.html')


@app.route('/api/home', methods=['GET'])
@login_required
def api_dashboard():
    try:
        user_id = session['user']['_id']
        user_data = db.Users.find_one({"_id": user_id})
        if not user_data:
            return jsonify({"error": "Utente non trovato"}), 404

        following = user_data.get('is_following', [])
        posts = list(db.Posts.aggregate([
            {"$match": {"User_id": {"$in": following}}},
            {"$sort": {"date": -1}},
            {
                "$lookup": {
                    "from": "Comments",  # Nome della collezione dei commenti
                    "localField": "_id",
                    "foreignField": "post_id",
                    "as": "comments"
                }
            }
        ])) if following else []

        posts_serialized = [
            {
                "_id": str(post["_id"]),
                "user_id": post["User_id"],
                "content": post.get("text", ""),
                "date": post["date"].isoformat() if post.get("date") else None,
                "media": post.get("media"),
                "likes": len(post.get("likes", [])),
                "username": db.Users.find_one({"_id": post["User_id"]}).get("username", "Anonimo"),
                "profile_image": db.Users.find_one({"_id": post["User_id"]}).get("image_url", "/static/img/default-profile.jpg"),
                "self_img": db.Users.find_one({"_id": user_data["_id"]}).get("image_url", "/static/img/default.jpg"),
                "comments": [
                    {
                        "comment_id": str(comment["_id"]),
                        "user_id": comment["user_id"],
                        "text": comment["text"],
                        "username": db.Users.find_one({"_id": comment["user_id"]}).get("username", "Anonimo"),
                        "img_url": db.Users.find_one({"_id": comment["user_id"]}).get("image_url", "/static/img/default-profile.jpg"),
                        "date": comment["date"].isoformat() if comment.get("date") else None
                    }
                    for comment in post.get("comments", [])
                ]
            }
            for post in posts
        ]
        return jsonify({
            "currentUserId": str(user_id),
            "posts": posts_serialized
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/home/')
@login_required
def dashboard():
    return render_template('Home.html', user=session['user'])


@app.route('/api/posts', methods=['GET'])
@login_required
def get_user_posts():
    user_id = session['user']['_id']
    posts = list(db.Posts.find({"User_id": user_id}).sort("date",1))
    for post in posts:
        post["_id"] = str(post["_id"])  # Converti ObjectId in stringa
    return jsonify({"success": True, "posts": posts}), 200


@app.route('/api/user-profile', methods=['GET'])
def get_user_profile():
    if 'user' in session:
        user_id = session['user']['_id']
        user = db.Users.find_one({"_id": user_id})
        if user:
            return jsonify({
                'profile_image': user.get('image_url','/static/img/default-profile.jpg')
            })
    return jsonify({'profile_image': '/static/img/default-profile.jpg'})


@app.route('/post/<post_id>/like', methods=['POST'])
@login_required
def like_post(post_id):
    user_id = session['user']['_id']
    post = db.Posts.find_one({"_id": post_id})
    if not post:
        return jsonify({"error": "Post non trovato"}), 404

    likes = post.get("likes", [])
    if user_id in likes:
        db.Posts.update_one({"_id": post_id}, {"$pull": {"likes": user_id}})
        liked = False
    else:
        db.Posts.update_one({"_id": post_id}, {"$addToSet": {"likes": user_id}})
        liked = True

    updated_post = db.Posts.find_one({"_id": post_id})
    like_count = len(updated_post.get("likes", []))
    return jsonify({"liked": liked, "like_count": like_count}), 200


@app.route('/post/<post_id>/comment', methods=['POST'])
@login_required
def add_comment(post_id):
    try:
        user_id = session['user']['_id']
        data = request.get_json()
        comment_text = data.get("text")

        if not comment_text:
            return jsonify({"error": "Il testo del commento è obbligatorio"}), 400

        comment = {
            "post_id": post_id,
            "user_id": user_id,
            "text": comment_text,
            "date": datetime.now()
        }
        db.Comments.insert_one(comment)
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
