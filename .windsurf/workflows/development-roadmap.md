---
description: Roadmap de développement de la plateforme de gestion des touristes
---

# 🗺️ Roadmap de Développement - Plateforme de Gestion des Touristes

## ✅ Phase 1 : Authentification (COMPLÉTÉ)
- [x] Module Auth avec JWT
- [x] Stratégies d'authentification
- [x] Guards (JWT, Roles)
- [x] Gestion des utilisateurs de base

---

## 📋 Phase 2 : Infrastructure & Guards (PRIORITÉ HAUTE)

### Étape 1 : Finaliser les Guards et Décorateurs
**Pourquoi commencer ici ?** Les guards sont transversaux et seront utilisés par tous les modules.

1. **Vérifier les guards existants** (`src/common/guards/`)
   - `jwt-auth.guard.ts` - Protection des routes authentifiées
   - `roles.guard.ts` - Contrôle d'accès basé sur les rôles
   - `public-route.decorator.ts` - Marquer les routes publiques

2. **Créer les décorateurs manquants**
   - `@CurrentUser()` - Récupérer l'utilisateur connecté
   - `@Roles()` - Définir les rôles autorisés
   - Valider que tous les décorateurs sont dans `src/common/decorators/`

3. **Tester les guards**
   - Créer des endpoints de test dans le module User
   - Vérifier l'accès ADMIN, TOURISTE, PRESTATAIRE

---

## 🏗️ Phase 3 : Modules Core (ORDRE RECOMMANDÉ)

### Étape 2 : Module User (Service Principal)
**Pourquoi ?** C'est la base de tous les autres modules (relations avec Touriste, Prestataire, Admin)

**Actions :**
1. **Service User** (`src/Modules/user/services/`)
   - CRUD complet (Create, Read, Update, Delete)
   - Gestion des profils utilisateurs
   - Recherche et filtrage
   - Gestion des rôles

2. **Controller User** (`src/Modules/user/controllers/`)
   - GET /users (Admin only)
   - GET /users/:id (Admin + Self)
   - PUT /users/:id (Admin + Self)
   - DELETE /users/:id (Admin only)
   - GET /users/me (Current user)

3. **DTOs** (`src/Modules/user/dto/`)
   - UpdateUserDto
   - CreateUserDto (si nécessaire)
   - FilterUserDto

4. **Appliquer les guards**
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   ```

---

### Étape 3 : Module Touriste
**Pourquoi ?** Les touristes sont les utilisateurs principaux de la plateforme

**Actions :**
1. **Entity Touriste**
   - Relation OneToOne avec User
   - Informations spécifiques (préférences, historique)

2. **Service Touriste**
   - CRUD touriste
   - Lier un User à un profil Touriste
   - Récupérer les réservations d'un touriste
   - Récupérer les avis d'un touriste

3. **Controller Touriste**
   - POST /touristes (Public ou Admin)
   - GET /touristes (Admin only)
   - GET /touristes/:id (Admin + Self)
   - PUT /touristes/:id (Admin + Self)
   - GET /touristes/:id/reservations
   - GET /touristes/:id/avis

4. **Guards appropriés**
   - Routes publiques pour l'inscription
   - Routes protégées pour la gestion

---

### Étape 4 : Module Prestataire
**Pourquoi ?** Les prestataires gèrent les services (hôtels, restaurants, transports)

**Actions :**
1. **Entity Prestataire**
   - Relation OneToOne avec User
   - Informations entreprise (SIRET, adresse, etc.)
   - Type de prestataire (Hôtel, Restaurant, Transport, Guide)

2. **Service Prestataire**
   - CRUD prestataire
   - Validation des prestataires (Admin)
   - Récupérer les services d'un prestataire

3. **Controller Prestataire**
   - POST /prestataires (Public registration)
   - GET /prestataires (Public - liste validée)
   - GET /prestataires/:id (Public)
   - PUT /prestataires/:id (Admin + Self)
   - PATCH /prestataires/:id/validate (Admin only)

---

## 🏨 Phase 4 : Modules Services (Gérés par Prestataires)

### Étape 5 : Module Hôtel
1. **Entity Hotel**
   - Relation ManyToOne avec Prestataire
   - Informations (nom, adresse, étoiles, description)

2. **Service Hotel**
   - CRUD hôtel
   - Recherche par ville, étoiles, prix
   - Disponibilité

3. **Controller Hotel**
   - POST /hotels (Prestataire + Admin)
   - GET /hotels (Public)
   - GET /hotels/:id (Public)
   - PUT /hotels/:id (Owner + Admin)
   - DELETE /hotels/:id (Owner + Admin)

**Guards :**
```typescript
@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
// + Custom guard pour vérifier ownership
```

---

### Étape 6 : Module Chambre
1. **Entity Chambre**
   - Relation ManyToOne avec Hotel
   - Type, prix, capacité

2. **Service Chambre**
   - CRUD chambre
   - Vérifier disponibilité
   - Gestion des prix

3. **Controller Chambre**
   - Nested routes : `/hotels/:hotelId/chambres`

---

### Étape 7 : Module Restaurant
**Structure similaire à Hotel**
- Entity, Service, Controller
- Relation avec Prestataire
- Gestion des menus, horaires

---

### Étape 8 : Module Transport
**Structure similaire**
- Types : Bus, Train, Avion, Voiture
- Relation avec Prestataire
- Gestion des trajets, horaires, prix

---

### Étape 9 : Module Guide
- Guides touristiques
- Relation avec Prestataire
- Langues parlées, spécialités

---

## 🎯 Phase 5 : Modules Business Logic

### Étape 10 : Module Circuit
1. **Entity Circuit**
   - Itinéraire touristique
   - Relation avec Guide
   - Durée, prix, description

2. **Service Circuit**
   - CRUD circuit
   - Recherche par destination, durée, prix

3. **Controller Circuit**
   - Routes publiques pour consultation
   - Routes protégées pour gestion (Prestataire/Guide)

---

### Étape 11 : Module Pack Voyage
**Pourquoi après ?** Combine plusieurs services (Hotel, Transport, Circuit)

1. **Entity PackVoyage**
   - Relations avec Hotel, Transport, Circuit, Guide
   - Prix global, durée, description

2. **Service PackVoyage**
   - CRUD pack
   - Calcul prix total
   - Vérification disponibilité de tous les composants

3. **Controller PackVoyage**
   - GET /packs (Public)
   - POST /packs (Admin + Agence)

---

### Étape 12 : Module Agence Voyage
1. **Entity AgenceVoyage**
   - Relation avec User/Prestataire
   - Gestion des packs

2. **Service & Controller**
   - CRUD agence
   - Gestion des packs de l'agence

---

## 💰 Phase 6 : Réservations & Paiements

### Étape 13 : Module Réservation
**Pourquoi en dernier ?** Dépend de tous les modules précédents

1. **Entity Reservation**
   - Relation avec Touriste
   - Relation polymorphique (Hotel, Pack, Circuit, etc.)
   - Statut (EN_ATTENTE, CONFIRMEE, ANNULEE)
   - Prix, dates

2. **Service Reservation**
   - Créer réservation
   - Vérifier disponibilité
   - Calculer prix
   - Gérer statuts
   - Annulation

3. **Controller Reservation**
   - POST /reservations (Touriste)
   - GET /reservations (Touriste - ses réservations)
   - GET /reservations/:id (Owner + Admin)
   - PATCH /reservations/:id/cancel (Owner + Admin)
   - GET /reservations (Admin - toutes)

**Guards complexes :**
- Vérifier que le touriste ne réserve que pour lui
- Admin peut tout voir
- Prestataire voit les réservations de ses services

---

## ⭐ Phase 7 : Avis & Notations

### Étape 14 : Module Avis
1. **Entity Avis**
   - Relation avec Touriste
   - Relation polymorphique (Hotel, Restaurant, Circuit, etc.)
   - Note (1-5), commentaire, date

2. **Service Avis**
   - CRUD avis
   - Vérifier que le touriste a bien réservé avant d'avis
   - Calcul moyenne des notes

3. **Controller Avis**
   - POST /avis (Touriste - après réservation)
   - GET /hotels/:id/avis (Public)
   - DELETE /avis/:id (Owner + Admin)

---

## 🔧 Phase 8 : Fonctionnalités Avancées

### Étape 15 : Features Additionnelles
1. **Notifications**
   - Email confirmation réservation
   - Rappels

2. **Recherche Avancée**
   - Filtres multiples
   - Tri par prix, note, etc.

3. **Dashboard Admin**
   - Statistiques
   - Gestion globale

4. **Paiement**
   - Intégration Stripe/PayPal
   - Gestion des transactions

---

## 📝 Bonnes Pratiques à Suivre

### Pour Chaque Module :

1. **Ordre de développement :**
   ```
   Entity → DTO → Service → Controller → Guards → Tests
   ```

2. **Structure des fichiers :**
   ```
   module/
   ├── entities/
   ├── dto/
   ├── services/
   ├── controllers/
   ├── guards/ (si spécifiques au module)
   └── module.module.ts
   ```

3. **Appliquer les guards :**
   - Au niveau du controller (global)
   - Au niveau de la méthode (spécifique)
   ```typescript
   @Controller('resource')
   @UseGuards(JwtAuthGuard, RolesGuard)
   export class ResourceController {
     
     @Get()
     @Roles(UserRole.ADMIN)
     findAll() {}
     
     @Post()
     @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
     create() {}
   }
   ```

4. **Validation des DTOs :**
   - Utiliser class-validator
   - Valider toutes les entrées

5. **Gestion des erreurs :**
   - Exceptions NestJS appropriées
   - Messages clairs

6. **Relations TypeORM :**
   - Définir les cascades
   - Utiliser eager/lazy loading approprié

---

## 🎯 Résumé de l'Ordre Recommandé

1. ✅ **Auth** (Fait)
2. 🔒 **Guards & Decorators** (Infrastructure)
3. 👤 **User** (Service de base)
4. 🧳 **Touriste** (Utilisateur principal)
5. 🏢 **Prestataire** (Fournisseur de services)
6. 🏨 **Hotel** → **Chambre**
7. 🍽️ **Restaurant**
8. 🚗 **Transport**
9. 🗺️ **Guide**
10. 🎯 **Circuit**
11. 📦 **Pack Voyage**
12. 🏢 **Agence Voyage**
13. 💰 **Réservation** (Combine tout)
14. ⭐ **Avis** (Feedback)
15. 🚀 **Features avancées**

---

## 🚀 Commencer Maintenant

**Prochaine action immédiate :**
```bash
# 1. Vérifier les guards existants
# 2. Compléter le module User
# 3. Tester avec les guards
```

**Commande pour démarrer :**
1. Finaliser les décorateurs dans `src/common/decorators/`
2. Implémenter le service User complet
3. Créer les endpoints User avec guards appropriés
4. Tester l'authentification et l'autorisation

---

**Note :** Ce roadmap est flexible. Ajustez selon vos besoins spécifiques et les dépendances de votre projet.
