from django.contrib import admin
from .models import Lycee, Ninja, Session, Presence, Equipe, Profil


class LyceeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'adresse')
    search_fields = ('nom',)

class NinjaAdmin(admin.ModelAdmin):
    list_display = ('nom', 'classe', "lycee")
    search_fields = ('nom',)

class SessionAdmin(admin.ModelAdmin):
    search_fields = ('theme',)      

class PresenceAdmin(admin.ModelAdmin):
    list_display = ('session', 'present')
    search_fields = ('session__theme',)

admin.site.register(Lycee, LyceeAdmin)
admin.site.register(Ninja, NinjaAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Presence, PresenceAdmin)
admin.site.register(Equipe)
admin.site.register(Profil)



