from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields
from .models import Lycee, Ninja, Session, Presence, Equipe, Profil
from import_export.widgets import ForeignKeyWidget


class LyceeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'adresse')
    search_fields = ('nom',)

class NinjaResource(resources.ModelResource):
    lycee = fields.Field(
        column_name='lycee',
        attribute='lycee',
        widget=ForeignKeyWidget(Lycee, 'nom')
    )

    class Meta:
        model = Ninja
        fields = ('nom', 'prenom', 'lycee', 'classe')
        skip_unchanged = True
        report_skipped = True
        import_id_fields = ()

@admin.register(Ninja)
class NinjaAdmin(ImportExportModelAdmin):
    resource_class = NinjaResource
    list_display = ('prenom', 'nom', 'lycee', 'classe')
    search_fields = ('prenom', 'nom', 'lycee__nom')

class SessionAdmin(admin.ModelAdmin):
    search_fields = ('theme',)      

class PresenceAdmin(admin.ModelAdmin):
    list_display = ('session', 'ninja', 'present')
    search_fields = ('session__theme',)

admin.site.register(Lycee, LyceeAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Presence, PresenceAdmin)
admin.site.register(Equipe)
admin.site.register(Profil)



