import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Prestataire } from './entities/prestataire.entity';
import { PrestataireController } from './prestataire.controller';
import { PrestataireService } from './prestataire.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prestataire, User])],
  controllers: [PrestataireController],
  providers: [PrestataireService],
  exports: [PrestataireService]
})
export class PrestataireModule {}
