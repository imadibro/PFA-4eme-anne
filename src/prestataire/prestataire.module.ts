import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from './entities/prestataire.entity';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prestataire])],
  controllers: [PrestataireController],
  providers: [PrestataireService],
  exports: [PrestataireService],
})
export class PrestataireModule {}
