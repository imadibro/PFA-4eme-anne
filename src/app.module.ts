import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyageModule } from './agence-voyage/agence-voyage.module';
import { AvisModule } from './avis/avis.module';
import { ChambreModule } from './chambre/chambre.module';
import { CircuitModule } from './circuit/circuit.module';
import { JwtAuthGuard, RolesGuard } from './common';
import { appConfig, databaseConfig, jwtConfig } from './config';
import { GuideModule } from './guide/guide.module';
import { HotelModule } from './hotel/hotel.module';
import { PackVoyageModule } from './pack-voyage/pack-voyage.module';
import { PrestataireModule } from './prestataire/prestataire.module';
import { ReservationModule } from './reservation/reservation.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TouristeModule } from './touriste/touriste.module';
import { TransportModule } from './transport/transport.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('database.type'),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
        autoLoadEntities: config.get<boolean>('database.autoLoadEntities')
      })
    }),
    UserModule,
    TouristeModule,
    PrestataireModule,
    ReservationModule,
    AvisModule,
    HotelModule,
    ChambreModule,
    RestaurantModule,
    GuideModule,
    AgenceVoyageModule,
    PackVoyageModule,
    TransportModule,
    CircuitModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
