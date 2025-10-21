🎯 Backend - Fiche de Présence (Django)

Bienvenue dans le backend Django du projet Fiche de Présence, une application permettant la gestion des élèves, des lycées et des classes.

🧱 Technologies utilisées

🐍 Python 3.10+

🌐 Django (framework backend)

⚙️ Django REST Framework (API REST)

📘 drf-yasg (documentation Swagger & ReDoc)

🗄️ SQLite (par défaut, compatible PostgreSQL / MySQL)

⚙️ Installation et configuration
1️⃣ Cloner le projet
git clone https://github.com/ton-utilisateur/fiche_de_presence.git
cd fiche_de_presence

2️⃣ Créer un environnement virtuel
Sous Windows
python -m venv venv
venv\Scripts\activate

Sous Linux / macOS
python3 -m venv venv
source venv/bin/activate

3️⃣ Installer les dépendances
pip install -r requirements.txt

4️⃣ Effectuer les migrations
python manage.py makemigrations
python manage.py migrate

5️⃣ Créer un superutilisateur
python manage.py createsuperuser

6️⃣ Démarrer le serveur
python manage.py runserver

📡 Accès et documentation

⚠️ Important : Ce projet ne possède pas de page d’accueil web.
Si vous accédez à http://127.0.0.1:8000/
, vous verrez un message 404 - Not Found.
C’est normal, car le serveur Django est uniquement utilisé pour exposer des endpoints API.

🧾 Documentation interactive de l’API

La documentation est automatiquement générée via drf-yasg :

Swagger UI → http://127.0.0.1:8000/swagger/

Interface interactive pour explorer et tester les endpoints.

ReDoc UI → http://127.0.0.1:8000/redoc/

Interface plus lisible pour consulter les détails techniques des routes API.

🔐 Accès à l’administration Django

Interface d’administration disponible à :
👉 http://127.0.0.1:8000/admin/

Connectez-vous avec le compte créé via createsuperuser.

🧰 Commandes utiles
Action	Commande
Appliquer les migrations	python manage.py migrate
Créer un superutilisateur	python manage.py createsuperuser
Démarrer le serveur	python manage.py runserver
Mettre à jour requirements.txt	pip freeze > requirements.txt
Désactiver l’environnement virtuel	deactivate
📝 Notes importantes

Toutes les routes API se trouvent sous le préfixe /api/
(ex : http://127.0.0.1:8000/api/ninjas/)

Le projet utilise SQLite par défaut pour simplifier le développement local.

La configuration principale se trouve dans settings.py.
