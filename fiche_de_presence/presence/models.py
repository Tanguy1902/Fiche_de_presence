from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Lycee(models.Model):
    nom = models.CharField(max_length=150, unique=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nom
    
# --- Equipe (chaque lycée a une équipe CoderDojo assignée) ---
class Equipe(models.Model):
    nom = models.CharField(max_length=100)
    lycee = models.OneToOneField(Lycee, on_delete=models.CASCADE, related_name="equipe")

    def __str__(self):
        return f"{self.nom} ({self.lycee.nom})"
    
class Profil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profil")
    equipe = models.ForeignKey(Equipe, on_delete=models.CASCADE, related_name="membres")

    def __str__(self):
        return f"{self.user.username} ({self.equipe.nom if self.equipe else 'Aucune équipe'})"


class Ninja(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    lycee = models.ForeignKey(Lycee, on_delete=models.CASCADE)
    classe = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Session(models.Model):
    theme = models.CharField(max_length=200)

    def __str__(self):
        return self.theme


class Presence(models.Model):
    ninja = models.ForeignKey(Ninja, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    lycee = models.ForeignKey(Lycee, on_delete=models.CASCADE) 
    present = models.BooleanField(default=False)
    fait_par = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=date.today)  # <-- date de présence spécifique
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['ninja', 'session'],
                name='unique_presence_per_ninja_session'
            )
        ]


    def __str__(self):
        etat = "Présent" if self.present else "Absent"
        auteur = self.fait_par.username if self.fait_par else "Inconnu"
        return f"{self.ninja} - {self.session} ({etat}) le {self.date} par {auteur}"
