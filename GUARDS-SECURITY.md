# 🔒 Documentation des Guards et Sécurité

## 📋 Résumé

Tous les endpoints de l'API ont été sécurisés avec des guards appropriés selon les rôles et les permissions.

---

## 🛡️ Guards Créés

### 1. **JwtAuthGuard** (`src/common/guards/jwt-auth.guard.ts`)

- Vérifie que l'utilisateur est authentifié via JWT
- Permet les routes publiques marquées avec `@Public()`
- **Appliqué globalement** sur tous les controllers

### 2. **RolesGuard** (`src/common/guards/roles.guard.ts`)

- Vérifie que l'utilisateur a le rôle requis
- Utilise le décorateur `@Roles(UserRole.ADMIN, UserRole.TOURISTE, ...)`
- **Appliqué globalement** sur tous les controllers

### 3. **OwnershipGuard** (`src/common/guards/ownership.guard.ts`) ✨ NOUVEAU

- Vérifie que l'utilisateur accède uniquement à ses propres données
- Admin a accès à toutes les données
- Utilisé pour User, Touriste, Reservation, Avis

### 4. **PrestataireOwnershipGuard** (`src/common/guards/prestataire-ownership.guard.ts`) ✨ NOUVEAU

- Vérifie que le prestataire modifie uniquement ses propres services
- Admin a accès à toutes les données
- Utilisé pour Prestataire, Hotel, Restaurant, Transport, Guide, Circuit, Chambre, Agence

---

## 📊 Matrice des Permissions par Module

### 👤 **User** (`/users`)

| Endpoint             | Méthode | Accès                | Guards                       |
| -------------------- | ------- | -------------------- | ---------------------------- |
| `/users`             | GET     | Admin uniquement     | `@Roles(UserRole.ADMIN)`     |
| `/users/currentUser` | GET     | Utilisateur connecté | JWT uniquement               |
| `/users/:id`         | GET     | Owner + Admin        | `@UseGuards(OwnershipGuard)` |
| `/users`             | POST    | Admin uniquement     | `@Roles(UserRole.ADMIN)`     |
| `/users/:id`         | PUT     | Owner + Admin        | `@UseGuards(OwnershipGuard)` |
| `/users/:id`         | DELETE  | Owner + Admin        | `@UseGuards(OwnershipGuard)` |

---

### 🧳 **Touriste** (`/touristes`)

| Endpoint         | Méthode | Accès                    | Guards                       |
| ---------------- | ------- | ------------------------ | ---------------------------- |
| `/touristes`     | GET     | Admin uniquement         | `@Roles(UserRole.ADMIN)`     |
| `/touristes/:id` | GET     | Owner + Admin            | `@UseGuards(OwnershipGuard)` |
| `/touristes`     | POST    | **Public** (inscription) | `@Public()`                  |
| `/touristes/:id` | PUT     | Owner + Admin            | `@UseGuards(OwnershipGuard)` |
| `/touristes/:id` | DELETE  | Owner + Admin            | `@UseGuards(OwnershipGuard)` |

**Logique :**

- Les touristes peuvent s'inscrire librement (POST public)
- Seul l'admin peut voir la liste complète
- Chaque touriste ne peut voir/modifier que son propre profil

---

### 🏢 **Prestataire** (`/prestataires`)

| Endpoint            | Méthode | Accès                | Guards                                               |
| ------------------- | ------- | -------------------- | ---------------------------------------------------- |
| `/prestataires`     | GET     | **Admin + Touriste** | `@Roles(UserRole.ADMIN, UserRole.TOURISTE)`          |
| `/prestataires/me`  | GET     | Prestataire connecté | `@Roles(UserRole.PRESTATAIRE)`                       |
| `/prestataires/:id` | GET     | **Admin + Touriste** | `@Roles(UserRole.ADMIN, UserRole.TOURISTE)`          |
| `/prestataires`     | POST    | Prestataire + Admin  | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)`       |
| `/prestataires/:id` | PUT     | Owner + Admin        | `@UseGuards(PrestataireOwnershipGuard)` + validation |
| `/prestataires/:id` | DELETE  | Owner + Admin        | `@UseGuards(PrestataireOwnershipGuard)` + validation |

**Logique :**

- **Seuls Admin et Touriste peuvent voir tous les prestataires** (recherche de services)
- **Prestataires NE PEUVENT PAS voir les autres prestataires** (concurrence)
- Chaque prestataire peut voir son propre profil via `/me`
- Seuls les prestataires peuvent créer leur profil
- Chaque prestataire ne peut modifier/supprimer que son propre profil (avec validation d'ownership dans le service)

---

### 🏨 **Hotel** (`/hotels`)

| Endpoint      | Méthode | Accès               | Guards                                         |
| ------------- | ------- | ------------------- | ---------------------------------------------- |
| `/hotels`     | GET     | **Public**          | `@Public()`                                    |
| `/hotels/:id` | GET     | **Public**          | `@Public()`                                    |
| `/hotels`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/hotels/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/hotels/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

**Logique :**

- Touristes peuvent consulter tous les hôtels
- Seuls les prestataires peuvent créer des hôtels
- Le prestataire propriétaire peut modifier/supprimer son hôtel

---

### 🛏️ **Chambre** (`/chambres`)

| Endpoint        | Méthode | Accès               | Guards                                         |
| --------------- | ------- | ------------------- | ---------------------------------------------- |
| `/chambres`     | GET     | **Public**          | `@Public()`                                    |
| `/chambres/:id` | GET     | **Public**          | `@Public()`                                    |
| `/chambres`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/chambres/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/chambres/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 🍽️ **Restaurant** (`/restaurants`)

| Endpoint           | Méthode | Accès               | Guards                                         |
| ------------------ | ------- | ------------------- | ---------------------------------------------- |
| `/restaurants`     | GET     | **Public**          | `@Public()`                                    |
| `/restaurants/:id` | GET     | **Public**          | `@Public()`                                    |
| `/restaurants`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/restaurants/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/restaurants/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 🚗 **Transport** (`/transports`)

| Endpoint          | Méthode | Accès               | Guards                                         |
| ----------------- | ------- | ------------------- | ---------------------------------------------- |
| `/transports`     | GET     | **Public**          | `@Public()`                                    |
| `/transports/:id` | GET     | **Public**          | `@Public()`                                    |
| `/transports`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/transports/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/transports/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 🗺️ **Guide** (`/guides`)

| Endpoint      | Méthode | Accès               | Guards                                         |
| ------------- | ------- | ------------------- | ---------------------------------------------- |
| `/guides`     | GET     | **Public**          | `@Public()`                                    |
| `/guides/:id` | GET     | **Public**          | `@Public()`                                    |
| `/guides`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/guides/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/guides/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 🎯 **Circuit** (`/circuits`)

| Endpoint        | Méthode | Accès               | Guards                                         |
| --------------- | ------- | ------------------- | ---------------------------------------------- |
| `/circuits`     | GET     | **Public**          | `@Public()`                                    |
| `/circuits/:id` | GET     | **Public**          | `@Public()`                                    |
| `/circuits`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/circuits/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/circuits/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 🏢 **Agence Voyage** (`/agences-voyage`)

| Endpoint              | Méthode | Accès               | Guards                                         |
| --------------------- | ------- | ------------------- | ---------------------------------------------- |
| `/agences-voyage`     | GET     | **Public**          | `@Public()`                                    |
| `/agences-voyage/:id` | GET     | **Public**          | `@Public()`                                    |
| `/agences-voyage`     | POST    | Prestataire + Admin | `@Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)` |
| `/agences-voyage/:id` | PUT     | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |
| `/agences-voyage/:id` | DELETE  | Owner + Admin       | `@UseGuards(PrestataireOwnershipGuard)`        |

---

### 💰 **Reservation** (`/reservations`)

| Endpoint            | Méthode | Accès             | Guards                                      |
| ------------------- | ------- | ----------------- | ------------------------------------------- |
| `/reservations`     | GET     | Admin uniquement  | `@Roles(UserRole.ADMIN)`                    |
| `/reservations/me`  | GET     | Touriste connecté | `@Roles(UserRole.TOURISTE)`                 |
| `/reservations/:id` | GET     | Owner + Admin     | `@UseGuards(OwnershipGuard)`                |
| `/reservations`     | POST    | Touriste + Admin  | `@Roles(UserRole.TOURISTE, UserRole.ADMIN)` |
| `/reservations/:id` | PUT     | Owner + Admin     | `@UseGuards(OwnershipGuard)`                |
| `/reservations/:id` | DELETE  | Owner + Admin     | `@UseGuards(OwnershipGuard)`                |

**Logique :**

- Seuls les touristes peuvent créer des réservations
- Chaque touriste peut voir ses propres réservations via `/me`
- Chaque touriste ne voit que ses propres réservations
- Admin peut voir toutes les réservations

---

### ⭐ **Avis** (`/avis`)

| Endpoint    | Méthode | Accès            | Guards                                                                     |
| ----------- | ------- | ---------------- | -------------------------------------------------------------------------- |
| `/avis`     | GET     | **Public**       | `@Public()`                                                                |
| `/avis/:id` | GET     | **Public**       | `@Public()`                                                                |
| `/avis`     | POST    | Touriste + Admin | `@Roles(UserRole.TOURISTE, UserRole.ADMIN)` + **vérification réservation** |
| `/avis/:id` | PUT     | Owner + Admin    | `@UseGuards(OwnershipGuard)`                                               |
| `/avis/:id` | DELETE  | Owner + Admin    | `@UseGuards(OwnershipGuard)`                                               |

**Logique :**

- Tout le monde peut voir les avis (transparence)
- Seuls les touristes peuvent créer des avis
- **IMPORTANT : Le touriste doit avoir une réservation CONFIRMEE chez le prestataire avant de créer un avis**
- Chaque touriste ne peut modifier/supprimer que ses propres avis

---

## 🎭 Rôles Utilisateurs

```typescript
export enum UserRole {
  ADMIN = 'ADMIN', // Accès complet
  TOURISTE = 'TOURISTE', // Créer réservations et avis
  PRESTATAIRE = 'PRESTATAIRE' // Gérer ses services
}
```

---

## 🔑 Décorateurs Disponibles

### `@Public()`

Marque une route comme publique (pas d'authentification requise)

```typescript
@Get()
@Public()
findAll() { ... }
```

### `@Roles(...roles)`

Définit les rôles autorisés pour une route

```typescript
@Post()
@Roles(UserRole.ADMIN, UserRole.PRESTATAIRE)
create() { ... }
```

### `@CurrentUser()`

Récupère l'utilisateur connecté depuis le JWT

```typescript
@Get('me')
getProfile(@CurrentUser() user: JWTPayloadType) { ... }
```

---

## 📝 Exemple d'Utilisation

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { Public } from 'src/common/guards/public-route.decorator';

@Controller('example')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards globaux
export class ExampleController {
  // Route publique
  @Get()
  @Public()
  findAll() {
    return 'Accessible par tous';
  }

  // Route protégée - Admin uniquement
  @Post()
  @Roles(UserRole.ADMIN)
  create() {
    return 'Accessible par Admin uniquement';
  }

  // Route protégée - Prestataire + Admin
  @Post('service')
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  createService() {
    return 'Accessible par Prestataire et Admin';
  }
}
```

---

## ✅ Améliorations Implémentées

### 1. **Validation de l'ownership dans les services** ✅

Implémenté dans `PrestataireService` :

```typescript
async verifyOwnership(prestataireId: string, userId: string): Promise<boolean> {
  const prestataire = await this.prestataireRepository.findOne({
    where: { id: prestataireId },
    relations: { user: true }
  });

  if (!prestataire) {
    throw new NotFoundException(`Prestataire avec l'ID ${prestataireId} non trouvé`);
  }

  return prestataire.user.id === userId;
}
```

Utilisé dans le controller :

```typescript
@Put(':id')
@UseGuards(PrestataireOwnershipGuard)
async update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() updatePrestatairePayload: UpdatePrestatairePayload,
  @CurrentUser() user: JWTPayloadType
): Promise<PrestataireDto> {
  if (user.userRole !== UserRole.ADMIN) {
    const isOwner = await this.prestataireService.verifyOwnership(id, user.id);
    if (!isOwner) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil prestataire');
    }
  }
  return this.prestataireService.update(id, updatePrestatairePayload);
}
```

### 2. **Endpoints `/me` pour les ressources personnelles** ✅

**Prestataire :**

```typescript
@Get('me')
@Roles(UserRole.PRESTATAIRE)
async getMyProfile(@CurrentUser() user: JWTPayloadType): Promise<PrestataireDto> {
  const prestataire = await this.prestataireService.findByUserId(user.id);
  if (!prestataire) {
    throw new NotFoundException('Profil prestataire non trouvé pour cet utilisateur');
  }
  return prestataire;
}
```

**Réservations du touriste :**

```typescript
@Get('me')
@Roles(UserRole.TOURISTE)
async getMyReservations(
  @CurrentUser() user: JWTPayloadType,
  @Query() query: FindAllQuryParams
): Promise<PaginatedResult<ReservationDto>> {
  let { page, limit } = query;
  page = page ?? 1;
  limit = limit ?? 10;
  return this.reservationService.findByTouristeUserId(user.id, page, limit);
}
```

### 3. **Vérification de réservation avant création d'avis** ✅

Implémenté dans `AvisService.create()` :

```typescript
// Vérifier que le touriste a bien réservé chez ce prestataire
const hasReserved = await this.reservationService.hasTouristeReservedPrestataire(touriste.user.id, prestataire.id);

if (!hasReserved) {
  throw new BadRequestException(
    'Vous devez avoir effectué une réservation confirmée chez ce prestataire pour laisser un avis'
  );
}
```

Méthode dans `ReservationService` :

```typescript
async hasTouristeReservedPrestataire(touristeUserId: string, prestataireId: string): Promise<boolean> {
  const reservation = await this.reservationRepository
    .createQueryBuilder('reservation')
    .leftJoin('reservation.touriste', 'touriste')
    .leftJoin('touriste.user', 'touristeUser')
    .leftJoin('reservation.prestataire', 'prestataire')
    .where('touristeUser.id = :touristeUserId', { touristeUserId })
    .andWhere('prestataire.id = :prestataireId', { prestataireId })
    .andWhere('reservation.statut = :statut', { statut: 'CONFIRMEE' })
    .getOne();

  return !!reservation;
}
```

---

## 🚀 État d'Avancement

1. ✅ Guards appliqués sur tous les controllers
2. ✅ Logique d'ownership implémentée dans les services
3. ✅ Endpoints `/me` ajoutés pour les ressources personnelles
4. ✅ Vérification de réservation avant création d'avis
5. ✅ Guide de test Postman/Insomnia créé (voir TESTING-GUIDE.md)
6. ⏳ Tests unitaires pour les guards (à faire)
7. ⏳ Tests E2E complets (à faire)

---

## 📚 Fichiers Modifiés

### Guards créés :

- `src/common/guards/ownership.guard.ts`
- `src/common/guards/prestataire-ownership.guard.ts`

### Controllers sécurisés :

- ✅ `src/Modules/user/controllers/user.controller.ts`
- ✅ `src/Modules/touriste/touriste.controller.ts`
- ✅ `src/Modules/prestataire/prestataire.controller.ts`
- ✅ `src/Modules/hotel/hotel.controller.ts`
- ✅ `src/Modules/chambre/chambre.controller.ts`
- ✅ `src/Modules/restaurant/restaurant.controller.ts`
- ✅ `src/Modules/transport/transport.controller.ts`
- ✅ `src/Modules/guide/guide.controller.ts`
- ✅ `src/Modules/circuit/circuit.controller.ts`
- ✅ `src/Modules/agence-voyage/agence-voyage.controller.ts`
- ✅ `src/Modules/reservation/reservation.controller.ts`
- ✅ `src/Modules/avis/avis.controller.ts`

---

## 📚 Fichiers Complémentaires

- **TESTING-GUIDE.md** : Guide complet de test avec Postman/Insomnia
- **development-roadmap.md** : Roadmap de développement de la plateforme

---

**Date de mise à jour :** 7 août 2026
**Statut :** ✅ Tous les endpoints sécurisés avec validation d'ownership et vérifications métier
