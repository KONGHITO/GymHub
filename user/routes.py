from datetime import datetime
import os
from itertools import count
import bson
from bson import ObjectId
from flask import Flask, jsonify, render_template, session, request, redirect, url_for
from werkzeug.utils import secure_filename
from app import app, db, login_required
from user.models import User, Post, Chat




@app.route('/user/login',methods=['POST'])
def login():
    return User().login()

@app.route('/user/signup',methods=['POST'])
def signup():
    return User().signup()

@app.route('/user/signout',methods=['POST'])
def signout():
    User().signout()
    return jsonify({"success": True, "message": "Signed out successfully"}), 200


@app.route('/user/profile',methods=['GET'])
def profile():
    user = db.Users.find_one({"_id": session['user']['_id']})
    username = user.get('username')
    if not user:
        return redirect('/')
    profile_image = user.get("image_url", "default-profile.jpg")
    # Recupera i post dell'utente corrente
    user_posts = list(db.Posts.find({"User_id": session['user']['_id']}).sort("date", -1))
    for post in user_posts:
        post["_id"] = str(post["_id"])
        post["date"] = post["date"].strftime("%Y-%m-%d %H:%M")

    # Passa i post al template
    return render_template('Profile.html', posts=user_posts, profile_image=profile_image, username=username)


@app.route('/post/create', methods=['POST'])
def create_post():
    return Post().create_post()




@app.route('/post/delete/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    if 'user' not in session:
        return jsonify({"error": "Non sei autenticato"}), 401

    result = db.Posts.delete_one({"_id": post_id, "User_id": session['user']['_id']})
    if result.deleted_count:
        return jsonify({"success": True}), 200
    return jsonify({"error": "Post non trovato"}), 404



@app.route('/post/edit/<post_id>', methods=['PUT'])
def edit_post(post_id):
    if 'user' not in session:
        return jsonify({"error": "Non sei autenticato"}), 401

    data = request.json
    updated = db.Posts.update_one(
        {"_id": post_id, "User_id": session['user']['_id']},
        {"$set": {"text": data['text']}}
    )

    if updated.modified_count:
        return jsonify({"success": True}), 200
    return jsonify({"error": "Post non trovato o nessun aggiornamento"}), 404



@app.route('/user/upload_profile_image', methods=['POST'])
def upload_profile_image():
    if 'user' not in session:
        return jsonify({"error": "Non sei autenticato"}), 401

    user_id = session['user']['_id']
    profile_image = request.files.get('profile_image')

    if not profile_image:
        return jsonify({"error": "Nessuna immagine fornita"}), 400

    filename = secure_filename(profile_image.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    try:
        profile_image.save(file_path)
    except Exception as e:
        return jsonify({"error":f"Errore durante il salvataggio dell'immagine: {str(e)}"}), 500
    image_url = url_for('static', filename=f'uploads/profile_images/{filename}')


    db.Users.update_one({"_id": user_id}, {"$set": {"image_url": image_url}})

    return jsonify({"success": True, "image_url": image_url}), 200






@app.route('/user/<user_id>', methods=['GET'])
@login_required
def user_profile(user_id):
    if 'user' not in session or '_id' not in session['user']:
        return jsonify({"error": "Non sei autenticato"}), 401

    user = session['user']
    user_id = user['_id']
    following = user.get('is_following', [])
    followers = user.get('followers', [])
    following_count = len(following) if following else 0
    follower_count = len(followers) if followers else 0

    return render_template(
        'Friend.html',
        user_id=user_id,
        following=following,
        followers=followers,
        following_count=following_count,
        follower_count=follower_count
    )

@app.route('/api/session-user', methods=['GET'])
@login_required
def session_user():
    if 'user' not in session or '_id' not in session['user']:
        return jsonify({"error": "Utente non autenticato"}), 401
    return jsonify({"user_id": session['user']['_id']})


@app.route('/search_page')
def search_page():
    return render_template('search.html')

@app.route('/search', methods=['GET'])
def search_users():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    users_collection = db["Users"]
    results = users_collection.find({"username": {"$regex": query, "$options": "i"}})  # Ricerca case-insensitive

    users = [{
        "id": str(user["_id"]),
        "username": user["username"],
        "profile_image": user.get("image_url", "/static/img/default-profile.jpg")  # URL immagine profilo o immagine di default
    } for user in results]
    return jsonify(users)




@app.route('/follow/<user_id>', methods=['POST'])
@login_required
def follow_user(user_id):
    if not user_id:
        return jsonify({"success": False, "error": "ID utente non fornito"}), 400

    try:
        user_to_follow = db.Users.find_one({"_id": user_id})
    except Exception as e:
        return jsonify({"success": False, "error": f"ID non valido: {e}"}), 400

    if not user_to_follow:
        return jsonify({"success": False, "error": "Utente non trovato"}), 404

    current_user_id = session['user']['_id']

    db.Users.update_one(
        {"_id": current_user_id},
        {"$addToSet": {"is_following": user_id}}
    )

    db.Users.update_one(
        {"_id": user_id},
        {"$addToSet": {"followers": current_user_id}}
    )

    session['user'] = db.Users.find_one({"_id": current_user_id})
    session.modified = True

    return jsonify({"success": True}), 200




@app.route('/profile/<user_id>')
@login_required
def show_user_profile(user_id):
    current_user_id = session['user']['_id']
    user = db.Users.find_one({"_id": user_id})
    username = user.get('username')
    is_following = current_user_id in user.get('followers', [])
    if user:
        profile_image = user.get("image_url", "default-profile.jpg")
        user_posts = list(db.Posts.find({"User_id": user_id}).sort("date", -1))
        for post in user_posts:
            post["_id"] = str(post["_id"])
            post["date"] = post["date"].strftime("%Y-%m-%d %H:%M")


        is_current_user = str(session['user']['_id']) == user_id
        return render_template('Profile.html', profile_image = profile_image, posts = user_posts, is_current_user = is_current_user, user=user, user_id=user_id, is_following=is_following, username=username)
    else:
        return "User not found",404






@app.route('/unfollow/<user_id>', methods=['POST'])
@login_required
def unfollow_user(user_id):
   if not user_id:
       return jsonify({"success": False, "error": "ID utente non fornito"}), 400

   try:
       user_to_unfollow = db.Users.find_one({"_id": user_id})
   except Exception as e:
        return jsonify({"success": False, "error": f"ID non valido: {e}"}), 400

   if not user_to_unfollow:
       return jsonify({"success": False, "error": "Utente non trovato"}), 404

   current_user_id = session['user']['_id']

   db.Users.update_one(
       {"_id": current_user_id},
       {"$pull": {"is_following": user_id}}
   )

   db.Users.update_one(
       {"_id": user_id},
       {"$pull": {"followers": current_user_id}}
   )

   session['user'] = db.Users.find_one({"_id": current_user_id})
   session.modified = True

   return jsonify({"success": True}), 200


@app.route('/remove-follower/<user_id>', methods=['POST'])
@login_required
def remove_follower(user_id):
    if not user_id:
        return jsonify({"success": False, "error": "ID utente non fornito"}), 400

    try:
        user_to_unfollow = db.Users.find_one({"_id": user_id})
    except Exception as e:
        return jsonify({"success": False, "error": f"ID non valido: {e}"}), 400

    if not user_to_unfollow:
        return jsonify({"success": False, "error": "Utente non trovato"}), 404

    current_user_id = session['user']['_id']

    db.Users.update_one(
        {"_id": current_user_id},
        {"$pull": {"followers": user_id}}
    )

    db.Users.update_one(
        {"_id": user_id},
        {"$pull": {"is_following": current_user_id}}
    )

    session['user'] = db.Users.find_one({"_id": current_user_id})
    session.modified = True

    return jsonify({"success": True}), 200


@app.route('/user/<user_id>/followers', methods=['GET'])
@login_required
def get_followers(user_id):
    # Trova gli ID dei followers come stringhe
    user = db.Users.find_one({"_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    followers_ids = user.get("followers", [])  # Array di stringhe degli ID

    try:
        # Cerca gli utenti i cui ID sono nei followers
        followers = list(db.Users.find(
            {"_id": {"$in": followers_ids}},
            {"_id": 1, "username": 1, "image_url": 1}
        ))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Converti gli ID in stringhe (se necessario)
    for follower in followers:
        follower["_id"] = str(follower["_id"])

    return jsonify({"followers": followers}), 200


@app.route('/user/<user_id>/following', methods=['GET'])
@login_required
def get_following(user_id):
    # Trova gli ID degli utenti seguiti come stringhe
    user = db.Users.find_one({"_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    following_ids = user.get("is_following", [])  # Array di stringhe degli ID

    try:
        # Cerca gli utenti i cui ID sono in "is_following"
        following = list(db.Users.find(
            {"_id": {"$in": following_ids}},
            {"_id": 1, "username": 1, "image_url": 1}
        ))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Converti gli ID in stringhe (se necessario)
    for user in following:
        user["_id"] = str(user["_id"])

    return jsonify({"following": following}), 200




@app.route('/<user_id>/messages', methods=['GET'])
@login_required
def messages(user_id):
    current_user_id = session['user']['_id']

    # Trova le chat a cui partecipa l'utente corrente
    chats = db.Chats.find({
        "$or": [
            {"user_1": current_user_id},
            {"user_2": current_user_id}
        ]
    })

    chat_list = []
    for chat in chats:
        # Controlla se la chat contiene messaggi
        has_messages = db.Messages.find_one({"chat_id": chat["_id"]})

        if has_messages:
            # Determina l'ID dell'altro utente
            other_user_id = chat["user_1"] if chat["user_2"] == current_user_id else chat["user_2"]
            other_user = db.Users.find_one({"_id": other_user_id})

            if other_user:
                # Ottieni l'ultimo messaggio nella chat
                last_message_doc = db.Messages.find_one(
                    {"chat_id": chat["_id"]},
                    sort=[("date", -1)]  # Ordina per data decrescente
                )

                last_message = last_message_doc["text"] if last_message_doc else "Nessun messaggio"

                # Aggiungi dettagli della chat alla lista
                chat_list.append({
                    "chat_id": str(chat["_id"]),
                    "user_id": str(other_user["_id"]),
                    "username": other_user["username"],
                    "profile_image": other_user.get("image_url", url_for('static', filename='img/default-profile.jpg')),
                    "last_message": last_message
                })

    # Passa le chat attive al template
    return render_template('Messages.html', user_id=user_id, chats=chat_list)



@app.route('/search_chat', methods=['GET'])
@login_required
def search_chat():
    current_user_id = session['user']['_id']
    user = db.Users.find_one({"_id": current_user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_following = user.get("is_following", [])
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    matched_users = db.Users.find({
        "$and": [
            {"_id": {"$in": user_following}},
            {"username": {"$regex": query, "$options": "i"}}
        ]
    })

    search_results = []
    for matched_user in matched_users:
        # Cerca una chat esistente tra l'utente corrente e l'altro utente
        chat = db.Chats.find_one({
            "$or": [
                {"user_1": current_user_id, "user_2": matched_user["_id"]},
                {"user_1": matched_user["_id"], "user_2": current_user_id}
            ]
        })

        last_message = None
        if chat:
            # Ottieni l'ultimo messaggio dalla collezione Messages
            last_message_doc = db.Messages.find_one(
                {"chat_id": chat["_id"]},
                sort=[("timestamp", -1)]  # Ordina per data decrescente
            )
            last_message = last_message_doc["text"] if last_message_doc else None

        search_results.append({
            "user_id": matched_user["_id"],
            "username": matched_user["username"],
            "image_url": matched_user.get("image_url", url_for('static', filename='img/default-profile.jpg')),
            "last_message": last_message if last_message else "Inizia una nuova chat"
        })

    return jsonify(search_results), 200




@app.route('/chat/<user_id>', methods=['GET'])
@login_required
def chat(user_id):
    current_user_id = session['user']['_id']

    # Ottieni l'utente corrente dal database
    user = db.Users.find_one({"_id": current_user_id})
    if not user:
        return jsonify({"error": "Utente non trovato."}), 404



    # Trova o crea una chat tra i due utenti
    chat = db.Chats.find_one({
        "$or": [
            {"user_1": current_user_id, "user_2": user_id},
            {"user_1": user_id, "user_2": current_user_id}
        ]
    })

    if not chat:
        chat_result = db.Chats.insert_one({
            "user_1": current_user_id,
            "user_2": user_id,
            "created_at": datetime.utcnow()
        })
        chat_id = chat_result.inserted_id
    else:
        chat_id = chat["_id"]

    # Ottieni i dettagli dell'altro utente per mostrarli nella chat
    other_user = db.Users.find_one({"_id": user_id})
    if not other_user:
        return jsonify({"error": "L'utente non esiste."}), 404

    # Prepara i dettagli per il rendering della chat
    other_user_details = {
        "user_id": str(other_user["_id"]),
        "username": other_user["username"],
        "image_url": other_user.get("image_url", url_for('static', filename='img/default-profile.jpg'))
    }

    return render_template('Chat.html', chat_id=str(chat_id), other_user=other_user_details, current_user= str(current_user_id))


@app.route('/chat/<chat_id>/messages', methods=['GET'])
@login_required
def get_messages(chat_id):
    try:
        # Converte chat_id in ObjectId
        try:
            chat_id = ObjectId(chat_id)
        except Exception:
            return jsonify({"error": "Formato chat_id non valido"}), 400

        # Query con ObjectId
        messages = db.Messages.find({"chat_id": chat_id}).sort("date", -1)

        message_list = [
            {
                "sender_id": msg["sender_id"],
                "text": msg["text"],
                "media_url": msg.get("media_url"),
                "date": msg["date"].strftime("%H:%M")
            }
            for msg in messages
        ]
        return jsonify(message_list), 200
    except Exception as e:
        print(f"Errore nel caricamento dei messaggi: {e}")
        return jsonify({"error": "Errore interno del server"}), 500





@app.route('/message/send', methods=['POST'])
@login_required
def send_message():
    try:
        chat_id = request.form.get('chat_id')
        text = request.form.get('text', '').strip()
        file = request.files.get('file')

        if not chat_id or (not text and not file):
            return jsonify({"error": "Messaggio vuoto o chat_id mancante"}), 400

        # Converti chat_id in ObjectId
        try:
            chat_id = ObjectId(chat_id)
        except Exception:
            return jsonify({"error": "Formato chat_id non valido"}), 400

        # Controlla se la chat esiste
        chat = db.Chats.find_one({"_id": chat_id})
        if not chat:
            return jsonify({"error": "Chat non trovata"}), 404

        # Crea il messaggio
        message = {
            "chat_id": chat_id,
            "sender_id": session['user']['_id'],  # Assicurati che questo sia un ObjectId o stringa coerente
            "text": text,
            "media_url": None,
            "date": datetime.utcnow(),
            "status": "sent"
        }

        # Gestisci file se presente
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join('uploads', filename)
            file.save(file_path)
            message['media_url'] = file_path

        db.Messages.insert_one(message)

        # Aggiorna il campo `last_message` nella chat
        db.Chats.update_one(
            {"_id": chat_id},
            {"$set": {
                "last_message": {
                    "text": text,
                    "sender_id": session['user']['_id'],
                    "timestamp": datetime.utcnow()
                }
            }}
        )

        return jsonify({"success": True, "message": "Messaggio inviato"}), 201

    except Exception as e:
        print(f"Errore nel salvataggio del messaggio: {e}")
        return jsonify({"error": "Errore interno del server"}), 500




@app.route('/explore')
def explore():
    return render_template('Map.html')