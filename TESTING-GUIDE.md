# 🧪 Guide de Test API - Plateforme de Gestion des Touristes

## 📋 Table des Matières
1. [Configuration Initiale](#configuration-initiale)
2. [Tests d'Authentification](#tests-dauthentification)
3. [Tests par Rôle](#tests-par-rôle)
4. [Scénarios de Test Complets](#scénarios-de-test-complets)
5. [Collection Postman](#collection-postman)

---

## 🔧 Configuration Initiale

### Variables d'Environnement Postman/Insomnia

```json
{
  "baseUrl": "http://localhost:3000",
  "adminToken": "",
  "touristeToken": "",
  "prestataireToken": "",
  "adminId": "",
  "touristeId": "",
  "prestataireId": ""
}
```

---

## 🔐 Tests d'Authentification

### 1. Inscription d'un Touriste
```http
POST {{baseUrl}}/auth/signup
Content-Type: application/json

{
  "username": "touriste1",
  "email": "touriste1@test.com",
  "password": "Password123!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "userRole": "TOURISTE"
}
```

**Résultat attendu :** 201 Created
**Action :** Sauvegarder le `userId` retourné

### 2. Inscription d'un Prestataire
```http
POST {{baseUrl}}/auth/signup
Content-Type: application/json

{
  "username": "prestataire1",
  "email": "prestataire1@test.com",
  "password": "Password123!",
  "firstName": "Marie",
  "lastName": "Martin",
  "userRole": "PRESTATAIRE"
}
```

**Résultat attendu :** 201 Created

### 3. Connexion Admin
```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Résultat attendu :** 200 OK avec `accessToken`
**Action :** Sauvegarder le token dans `adminToken`

### 4. Connexion Touriste
```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "touriste1",
  "password": "Password123!"
}
```

**Action :** Sauvegarder le token dans `touristeToken`

### 5. Connexion Prestataire
```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "prestataire1",
  "password": "Password123!"
}
```

**Action :** Sauvegarder le token dans `prestataireToken`

---

## 👤 Tests ADMIN

### Voir tous les utilisateurs
```http
GET {{baseUrl}}/users
Authorization: Bearer {{adminToken}}
```

**Résultat attendu :** 200 OK - Liste de tous les utilisateurs

### Voir toutes les réservations
```http
GET {{baseUrl}}/reservations
Authorization: Bearer {{adminToken}}
```

**Résultat attendu :** 200 OK - Liste de toutes les réservations

### Créer un utilisateur
```http
POST {{baseUrl}}/users
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@test.com",
  "password": "Password123!",
  "firstName": "Test",
  "lastName": "User",
  "userRole": "TOURISTE"
}
```

**Résultat attendu :** 201 Created

---

## 🧳 Tests TOURISTE

### Voir mon profil utilisateur
```http
GET {{baseUrl}}/users/currentUser
Authorization: Bearer {{touristeToken}}
```

**Résultat attendu :** 200 OK - Profil du touriste connecté

### Créer un profil touriste
```http
POST {{baseUrl}}/touristes
Content-Type: application/json

{
  "userId": "{{touristeUserId}}",
  "dateNaissance": "1990-01-01",
  "nationalite": "Française",
  "telephone": "+33612345678"
}
```

**Résultat attendu :** 201 Created (Route publique)

### Voir tous les prestataires (Recherche)
```http
GET {{baseUrl}}/prestataires?page=1&limit=10
Authorization: Bearer {{touristeToken}}
```

**Résultat attendu :** 200 OK - Liste des prestataires

### Voir tous les hôtels
```http
GET {{baseUrl}}/hotels?page=1&limit=10
```

**Résultat attendu :** 200 OK - Liste publique des hôtels

### Créer une réservation
```http
POST {{baseUrl}}/reservations
Authorization: Bearer {{touristeToken}}
Content-Type: application/json

{
  "touristeId": "{{touristeId}}",
  "prestataireId": "{{prestataireId}}",
  "dateReservation": "2026-08-10",
  "dateDebut": "2026-09-01",
  "dateFin": "2026-09-07",
  "montant": 500,
  "statut": "CONFIRMEE"
}
```

**Résultat attendu :** 201 Created

### Voir mes réservations
```http
GET {{baseUrl}}/reservations/me?page=1&limit=10
Authorization: Bearer {{touristeToken}}
```

**Résultat attendu :** 200 OK - Uniquement les réservations du touriste connecté

### Créer un avis (après réservation confirmée)
```http
POST {{baseUrl}}/avis
Authorization: Bearer {{touristeToken}}
Content-Type: application/json

{
  "touristeId": "{{touristeId}}",
  "prestataireId": "{{prestataireId}}",
  "note": 5,
  "commentaire": "Excellent service !",
  "dateAvis": "2026-08-10"
}
```

**Résultat attendu :** 201 Created (si réservation confirmée existe)
**Erreur attendue :** 400 Bad Request (si aucune réservation confirmée)

---

## 🏢 Tests PRESTATAIRE

### Créer un profil prestataire
```http
POST {{baseUrl}}/prestataires
Authorization: Bearer {{prestataireToken}}
Content-Type: application/json

{
  "userId": "{{prestataireUserId}}",
  "nomEntreprise": "Hotel Paradise",
  "adress": "123 Rue de la Plage",
  "ville": "Nice",
  "localisation": "43.7102,7.2620"
}
```

**Résultat attendu :** 201 Created

### Voir mon profil prestataire
```http
GET {{baseUrl}}/prestataires/me
Authorization: Bearer {{prestataireToken}}
```

**Résultat attendu :** 200 OK - Profil du prestataire connecté

### Créer un hôtel
```http
POST {{baseUrl}}/hotels
Authorization: Bearer {{prestataireToken}}
Content-Type: application/json

{
  "prestataireId": "{{prestataireId}}",
  "nom": "Hotel Paradise",
  "adresse": "123 Rue de la Plage",
  "ville": "Nice",
  "etoiles": 4,
  "description": "Hôtel en bord de mer"
}
```

**Résultat attendu :** 201 Created

### Modifier mon hôtel
```http
PUT {{baseUrl}}/hotels/{{hotelId}}
Authorization: Bearer {{prestataireToken}}
Content-Type: application/json

{
  "description": "Magnifique hôtel en bord de mer avec vue panoramique"
}
```

**Résultat attendu :** 200 OK (si propriétaire)
**Erreur attendue :** 403 Forbidden (si pas propriétaire)

### Tenter de voir les autres prestataires (INTERDIT)
```http
GET {{baseUrl}}/prestataires
Authorization: Bearer {{prestataireToken}}
```

**Résultat attendu :** 403 Forbidden

---

## 🚫 Tests de Sécurité

### 1. Accès sans token
```http
GET {{baseUrl}}/users
```

**Résultat attendu :** 401 Unauthorized

### 2. Touriste tente d'accéder à la liste des utilisateurs
```http
GET {{baseUrl}}/users
Authorization: Bearer {{touristeToken}}
```

**Résultat attendu :** 403 Forbidden

### 3. Prestataire tente de modifier l'hôtel d'un autre
```http
PUT {{baseUrl}}/hotels/{{autreHotelId}}
Authorization: Bearer {{prestataireToken}}
Content-Type: application/json

{
  "description": "Tentative de modification"
}
```

**Résultat attendu :** 403 Forbidden

### 4. Touriste tente de créer un avis sans réservation
```http
POST {{baseUrl}}/avis
Authorization: Bearer {{touristeToken}}
Content-Type: application/json

{
  "touristeId": "{{touristeId}}",
  "prestataireId": "{{prestataireNonReserveId}}",
  "note": 5,
  "commentaire": "Test",
  "dateAvis": "2026-08-10"
}
```

**Résultat attendu :** 400 Bad Request - "Vous devez avoir effectué une réservation confirmée..."

### 5. Touriste tente de voir les réservations d'un autre
```http
GET {{baseUrl}}/reservations/{{autreReservationId}}
Authorization: Bearer {{touristeToken}}
```

**Résultat attendu :** 403 Forbidden

---

## 📊 Scénarios de Test Complets

### Scénario 1 : Parcours Touriste Complet

1. **Inscription** → POST /auth/signup (TOURISTE)
2. **Connexion** → POST /auth/login
3. **Créer profil touriste** → POST /touristes
4. **Rechercher hôtels** → GET /hotels?ville=Nice
5. **Voir détails hôtel** → GET /hotels/{id}
6. **Créer réservation** → POST /reservations
7. **Voir mes réservations** → GET /reservations/me
8. **Laisser un avis** → POST /avis

**Résultats attendus :** Toutes les étapes réussissent

### Scénario 2 : Parcours Prestataire Complet

1. **Inscription** → POST /auth/signup (PRESTATAIRE)
2. **Connexion** → POST /auth/login
3. **Créer profil prestataire** → POST /prestataires
4. **Voir mon profil** → GET /prestataires/me
5. **Créer un hôtel** → POST /hotels
6. **Créer des chambres** → POST /chambres
7. **Modifier mon hôtel** → PUT /hotels/{id}
8. **Tenter de voir autres prestataires** → GET /prestataires (DOIT ÉCHOUER)

**Résultats attendus :** Toutes les étapes réussissent sauf la dernière (403)

### Scénario 3 : Validation Avis

1. **Touriste crée réservation** → POST /reservations (statut: EN_ATTENTE)
2. **Touriste tente de créer avis** → POST /avis (DOIT ÉCHOUER)
3. **Admin confirme réservation** → PUT /reservations/{id} (statut: CONFIRMEE)
4. **Touriste crée avis** → POST /avis (DOIT RÉUSSIR)

**Résultats attendus :** L'avis n'est créé qu'après confirmation de la réservation

---

## 📦 Collection Postman JSON

Créez une collection avec cette structure :

```
Plateforme Tourisme
├── 🔐 Auth
│   ├── Signup Touriste
│   ├── Signup Prestataire
│   ├── Login Admin
│   ├── Login Touriste
│   └── Login Prestataire
├── 👤 Users (Admin)
│   ├── Get All Users
│   ├── Get Current User
│   ├── Get User by ID
│   ├── Create User
│   ├── Update User
│   └── Delete User
├── 🧳 Touristes
│   ├── Create Touriste Profile
│   ├── Get All Touristes (Admin)
│   ├── Get Touriste by ID
│   ├── Update Touriste
│   └── Delete Touriste
├── 🏢 Prestataires
│   ├── Get My Profile (Prestataire)
│   ├── Get All Prestataires (Touriste/Admin)
│   ├── Get Prestataire by ID
│   ├── Create Prestataire
│   ├── Update Prestataire
│   └── Delete Prestataire
├── 🏨 Hotels
│   ├── Get All Hotels (Public)
│   ├── Get Hotel by ID (Public)
│   ├── Create Hotel (Prestataire)
│   ├── Update Hotel (Owner)
│   └── Delete Hotel (Owner)
├── 💰 Reservations
│   ├── Get My Reservations (Touriste)
│   ├── Get All Reservations (Admin)
│   ├── Get Reservation by ID
│   ├── Create Reservation (Touriste)
│   ├── Update Reservation
│   └── Delete Reservation
├── ⭐ Avis
│   ├── Get All Avis (Public)
│   ├── Get Avis by ID (Public)
│   ├── Create Avis (Touriste - après réservation)
│   ├── Update Avis (Owner)
│   └── Delete Avis (Owner)
└── 🚫 Security Tests
    ├── Access without token
    ├── Touriste access admin route
    ├── Prestataire modify other's hotel
    └── Create avis without reservation
```

---

## ✅ Checklist de Tests

### Tests Fonctionnels
- [ ] Inscription et connexion pour chaque rôle
- [ ] CRUD complet pour chaque module
- [ ] Endpoints `/me` fonctionnent correctement
- [ ] Pagination fonctionne sur tous les GET
- [ ] Recherche fonctionne avec le paramètre `search`

### Tests de Sécurité
- [ ] Routes publiques accessibles sans token
- [ ] Routes protégées bloquées sans token
- [ ] Admin a accès à tout
- [ ] Touriste ne peut voir que ses données
- [ ] Prestataire ne peut modifier que ses services
- [ ] Prestataire ne peut pas voir les autres prestataires
- [ ] Avis créé uniquement après réservation confirmée

### Tests d'Erreur
- [ ] 400 Bad Request pour données invalides
- [ ] 401 Unauthorized sans token
- [ ] 403 Forbidden pour accès non autorisé
- [ ] 404 Not Found pour ressources inexistantes

---

## 🔍 Commandes cURL de Test Rapide

### Test rapide de l'authentification
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Utiliser le token
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test rapide endpoint /me
```bash
# Réservations du touriste connecté
curl -X GET http://localhost:3000/reservations/me \
  -H "Authorization: Bearer TOURISTE_TOKEN"

# Profil du prestataire connecté
curl -X GET http://localhost:3000/prestataires/me \
  -H "Authorization: Bearer PRESTATAIRE_TOKEN"
```

---

## 📝 Notes Importantes

1. **Ordre de création des données :**
   - User → Touriste/Prestataire → Services → Réservations → Avis

2. **IDs à sauvegarder :**
   - userId (après signup)
   - touristeId (après création profil)
   - prestataireId (après création profil)
   - hotelId, reservationId, etc.

3. **Statuts de réservation :**
   - `EN_ATTENTE` : Réservation créée
   - `CONFIRMEE` : Validée (requis pour avis)
   - `ANNULEE` : Annulée

4. **Tokens JWT :**
   - Durée de validité : Vérifier dans `jwt.config.ts`
   - Format : `Bearer <token>`
   - À inclure dans header `Authorization`

---

**Date de création :** 7 août 2026  
**Version API :** 1.0.0  
**Base URL :** http://localhost:3000
